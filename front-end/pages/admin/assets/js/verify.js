'use strict';

let html5QrCode = null;
let isSubmitting = false;
let lastScannedText = '';
let lastScannedAt = 0;

document.addEventListener('DOMContentLoaded', () => {
    $('#startScannerBtn').addEventListener('click', startScanner);
    $('#stopScannerBtn').addEventListener('click', stopScanner);
    $('#manualVerifyForm').addEventListener('submit', handleManualVerify);
});

async function startScanner() {
    if (!window.Html5Qrcode) {
        showModal('error', '套件載入失敗', 'html5-qrcode CDN 未載入，請確認網路或改成本機檔案。');
        return;
    }

    if (html5QrCode) {
        await stopScanner();
    }

    html5QrCode = new Html5Qrcode('reader');

    try {
        await html5QrCode.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 260, height: 260 } },
            handleScanSuccess,
            () => undefined
        );
        showToast('掃描器已開啟');
    } catch (error) {
        showModal('error', '無法開啟相機', error instanceof Error ? error.message : '請確認瀏覽器相機權限。');
    }
}

async function stopScanner() {
    if (!html5QrCode) return;

    try {
        await html5QrCode.stop();
        await html5QrCode.clear();
    } catch {
        // stop 在部分瀏覽器重複呼叫會丟錯，靜態頁面直接忽略即可。
    } finally {
        html5QrCode = null;
    }
}

async function handleScanSuccess(decodedText) {
    const now = Date.now();
    if (decodedText === lastScannedText && now - lastScannedAt < 2500) return;

    lastScannedText = decodedText;
    lastScannedAt = now;
    await submitVerify(parseQrPayload(decodedText));
}

async function handleManualVerify(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await submitVerify({
        rawText: 'manual-input',
        activityCode: String(formData.get('activityCode')).trim(),
        spotCode: String(formData.get('spotCode')).trim()
    });
    event.currentTarget.reset();
}

function parseQrPayload(rawText) {
    const payload = { rawText, activityCode: '', spotCode: '' };

    try {
        const url = new URL(rawText);
        payload.activityCode = url.searchParams.get('activityCode') ?? url.searchParams.get('code') ?? '';
        payload.spotCode = url.searchParams.get('spot') ?? url.searchParams.get('spotCode') ?? '';
        return payload;
    } catch {
        const pairs = new URLSearchParams(rawText);
        payload.activityCode = pairs.get('activityCode') ?? pairs.get('code') ?? rawText;
        payload.spotCode = pairs.get('spot') ?? pairs.get('spotCode') ?? '';
        return payload;
    }
}

async function submitVerify(parsed) {
    if (isSubmitting) return;
    isSubmitting = true;

    const payload = {
        activityCode: parsed.activityCode,
        spotCode: parsed.spotCode,
        rawText: parsed.rawText,
        verifierId: 'ADMIN-DEMO',
        scannedAt: new Date().toISOString()
    };

    $('#scanResult').textContent = JSON.stringify(payload, null, 2);

    try {
        // 正式串接時請將 common.js 的 API_BASE_URL 改成後端位置。
        // 後端建議接收 POST /api/admin/checkin/verify。
        await postJson('/api/admin/checkin/verify', payload);
        saveVerifyLog(payload, 'completed_claimed');
        showModal('success', '核銷完成', 'QR Code 參數已送至後端。');
    } catch {
        // 靜態 Demo 沒有後端時，仍保留測試紀錄，方便前端畫面驗收。
        saveVerifyLog(payload, 'completed_claimed');
        showModal('success', 'Demo 核銷完成', '目前無後端回應，已使用本機測試模式保存紀錄。');
    } finally {
        isSubmitting = false;
    }
}

function saveVerifyLog(payload, status) {
    const state = getState();
    state.verifyLogs.push({ ...payload, status });

    const member = state.members.find((item) => item.activityCode === payload.activityCode);
    if (member) {
        member.rewardStatus = 'completed_claimed';
    }

    const order = state.orders.find((item) => item.activityCode === payload.activityCode);
    if (order) {
        order.redeemStatus = 'completed_claimed';
    }

    saveState(state);
}
