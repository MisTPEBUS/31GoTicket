'use strict';

let selectedFile = null;
let importedOrders = [];

const PREVIEW_COLUMNS = [
    ['orderNo', '訂單編號'],
    ['productName', '預約商品'],
    ['bookingDate', '預約日期'],
    ['bookingTime', '預約時段'],
    ['status', '商品狀態'],
    ['contactName', '聯絡人'],
    ['phone', '聯絡電話']
];

document.addEventListener('DOMContentLoaded', () => {
    const input = $('#excelInput');
    const dropZone = $('#excelDropZone');

    input.addEventListener('change', async (event) => {
        const file = event.target.files?.[0] ?? null;
        await handleSelectedFile(file);
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('ring-4', 'ring-blue-100');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('ring-4', 'ring-blue-100');
    });

    dropZone.addEventListener('drop', async (event) => {
        event.preventDefault();
        dropZone.classList.remove('ring-4', 'ring-blue-100');

        const file = event.dataTransfer.files?.[0] ?? null;
        await handleSelectedFile(file);
    });

    $('#uploadExcelBtn').addEventListener('click', uploadImportedOrders);
    $('#reImportBtn').addEventListener('click', resetImportState);

    switchImportView(false);
    renderPreview([]);
});

async function handleSelectedFile(file) {
    if (!file) return;

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
        showModal('error', '檔案格式錯誤', '請上傳 .xlsx、.xls 或 .csv 檔案。');
        return;
    }

    selectedFile = file;
    $('#excelFileName').textContent = file.name;

    try {
        importedOrders = await parseExcel(file);

        if (!importedOrders.length) {
            showModal('error', '沒有資料', 'Excel 內沒有可匯入的訂單資料。');
            resetImportState();
            return;
        }

        switchImportView(true);
        renderPreview(importedOrders);
        $('#importSummary').textContent = `檔案：${file.name}，已讀取 ${importedOrders.length} 筆資料，請確認後送出。`;
    } catch (error) {
        console.error(error);
        importedOrders = [];
        renderPreview([]);
        switchImportView(false);
        showModal('error', '解析失敗', 'Excel 欄位或內容格式不正確。');
    }
}

async function parseExcel(file) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, {
        type: 'array',
        cellDates: false
    });

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
        raw: false
    });

    return rows
        .map(normalizeOrderRow)
        .filter((row) => row.orderNo);
}

function normalizeOrderRow(row) {
    return {
        orderNo: clean(row['訂單編號']),
        verifyCode: clean(row['核銷碼']),
        productName: clean(row['預約商品']),
        bookingDate: clean(row['預約日期']),
        bookingTime: clean(row['預約時段']),
        bookingSpec: clean(row['預約規格']),
        productSpec: clean(row['商品規格']),
        paymentOrderNo: clean(row['付款訂單編號']),
        paymentDate: clean(row['付款日期']),
        bookingNo: clean(row['預約單號']),
        bookingDeadline: clean(row['預約截止時間']),
        bookingCreatedAt: clean(row['預約單建立日期']),
        status: clean(row['商品狀態']),
        refundDate: clean(row['訂單退款日期']),
        b2bOrderNo: clean(row['B2B經銷商訂單編號']),
        externalBookingOrderNo: clean(row['外部預約訂單編號']),
        email: clean(row['訂單電子信箱']),
        phone: clean(row['訂單聯絡電話']),
        contactName: clean(row['訂單聯絡人'])
    };
}

function clean(value) {
    const text = String(value ?? '').trim();
    return text === '---' ? '' : text;
}

function switchImportView(hasData) {
    $('#uploadSection').classList.toggle('hidden', hasData);
    $('#previewSection').classList.toggle('hidden', !hasData);
}

function resetImportState() {
    selectedFile = null;
    importedOrders = [];

    $('#excelInput').value = '';
    $('#excelFileName').textContent = '選擇或拖曳 Excel 檔案';
    $('#importSummary').textContent = '尚未選擇檔案。';

    renderPreview([]);
    switchImportView(false);
}

function renderPreview(rows) {
    renderDesktopPreview(rows);
    renderMobilePreview(rows);
}

function renderDesktopPreview(rows) {
    $('#importPreviewHead').innerHTML = `
        <tr>
            ${PREVIEW_COLUMNS.map(([, label]) => `
                <th class="whitespace-nowrap px-4 py-3">${escapeHtml(label)}</th>
            `).join('')}
        </tr>
    `;

    if (!rows.length) {
        $('#importPreviewBody').innerHTML = `
            <tr>
                <td colspan="${PREVIEW_COLUMNS.length}" class="px-4 py-6 text-center text-slate-400">
                    尚無預覽資料。
                </td>
            </tr>
        `;
        return;
    }

    $('#importPreviewBody').innerHTML = rows.slice(0, 100).map((row) => `
        <tr class="hover:bg-slate-50">
            ${PREVIEW_COLUMNS.map(([key]) => `
                <td class="whitespace-nowrap px-4 py-3 text-slate-600">
                    ${escapeHtml(row[key])}
                </td>
            `).join('')}
        </tr>
    `).join('');
}

function renderMobilePreview(rows) {
    if (!rows.length) {
        $('#mobilePreviewList').innerHTML = `
            <div class="rounded-soft bg-slate-50 p-5 text-center text-sm text-slate-400">
                尚無預覽資料。
            </div>
        `;
        return;
    }

    $('#mobilePreviewList').innerHTML = rows.slice(0, 100).map((row) => `
        <article class="rounded-soft bg-white/80 p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <p class="break-all text-sm font-black text-slate-800">${escapeHtml(row.orderNo)}</p>
                    <p class="mt-1 text-sm text-slate-500">${escapeHtml(row.productName)}</p>
                </div>
                <span class="shrink-0 rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">${escapeHtml(row.status)}</span>
            </div>
            <div class="mt-4 grid gap-2 text-sm text-slate-600">
                <p><span class="font-black text-slate-500">日期：</span>${escapeHtml(row.bookingDate)} ${escapeHtml(row.bookingTime)}</p>
                <p><span class="font-black text-slate-500">聯絡人：</span>${escapeHtml(row.contactName)}</p>
                <p><span class="font-black text-slate-500">電話：</span>${escapeHtml(row.phone)}</p>
            </div>
        </article>
    `).join('');
}

async function uploadImportedOrders() {
    if (!importedOrders.length) {
        showModal('error', '尚無資料', '請先選擇 Excel 並確認預覽資料。');
        return;
    }

    const button = $('#uploadExcelBtn');
    button.disabled = true;
    button.textContent = '匯入中...';

    try {
        await OrdersApi.importOrders({
            source: 'excel',
            fileName: selectedFile?.name ?? '',
            orders: importedOrders
        });
        showModal('success', '匯入完成', `已送出 ${importedOrders.length} 筆訂單資料。`);
    } catch (error) {
        console.error(error);
        showModal('error', '匯入失敗', error.message || '後端 API 發生錯誤。');
    } finally {
        button.disabled = false;
        button.textContent = '呼叫匯入 API';
    }
}
