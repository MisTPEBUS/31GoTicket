'use strict';

let spotState = getState();

document.addEventListener('DOMContentLoaded', () => {
    $('#spotForm').addEventListener('submit', handleSpotSubmit);
    $('#spotSearch').addEventListener('input', renderSpots);
    renderSpots();
});

function handleSpotSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = String(formData.get('code')).trim();
    const newSpot = {
        id: crypto.randomUUID(),
        name: String(formData.get('name')).trim(),
        code,
        url: String(formData.get('url')).trim() || `${LIFF_BASE_URL}?spot=${encodeURIComponent(code)}`,
        status: String(formData.get('status'))
    };

    spotState.spots.unshift(newSpot);
    saveState(spotState);
    event.currentTarget.reset();
    renderSpots();
    showModal('success', '新增完成', `${newSpot.name} 已加入打卡地點。`);
}

function renderSpots() {
    const keyword = $('#spotSearch')?.value.trim().toLowerCase() ?? '';
    const spots = spotState.spots.filter((spot) => spot.name.toLowerCase().includes(keyword) || spot.code.toLowerCase().includes(keyword));

    $('#spotList').innerHTML = spots.map((spot) => `
        <article class="rounded-card border border-white bg-white/80 p-5 shadow-sm">
            <div class="flex items-start justify-between gap-4">
                <div>
                    ${statusBadge(spot.status)}
                    <h4 class="mt-3 text-lg font-black">${escapeHtml(spot.name)}</h4>
                    <p class="mt-1 text-sm font-bold text-slate-500">${escapeHtml(spot.code)}</p>
                </div>
                <img class="h-20 w-20 rounded-soft bg-slate-50 p-2" src="${getQrCodeUrl(spot.url)}" alt="${escapeAttr(spot.name)} QR Code" />
            </div>
            <div class="mt-4 break-all rounded-soft bg-slate-50 p-3 text-xs text-slate-500">${escapeHtml(spot.url)}</div>
            <div class="mt-4 grid grid-cols-2 gap-3">
                <button class="generate-qr-btn primary-gradient h-12 rounded-soft text-sm font-black text-white" data-url="${escapeAttr(spot.url)}">產生 QRCODE</button>
                <button class="copy-url-btn h-12 rounded-soft border border-slate-200 bg-white text-sm font-black text-primary-700" data-url="${escapeAttr(spot.url)}">複製 LIFF URL</button>
            </div>
        </article>
    `).join('');

    $$('.copy-url-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            await navigator.clipboard.writeText(button.dataset.url ?? '');
            showToast('LIFF URL 已複製');
        });
    });

    $$('.generate-qr-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = getQrCodeUrl(button.dataset.url ?? '', 480);
            link.download = 'spot-qrcode.png';
            link.click();
        });
    });
}
