'use strict';

let selectedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    $('#excelInput').addEventListener('change', (event) => {
        selectedFile = event.target.files?.[0] ?? null;
        $('#excelFileName').textContent = selectedFile ? selectedFile.name : '選擇或拖曳 Excel 檔案';
    });
    $('#uploadExcelBtn').addEventListener('click', uploadExcel);
    renderImportLog([]);
});

async function uploadExcel() {
    if (!selectedFile) {
        showModal('error', '尚未選擇檔案', '請先選擇 Excel 或 CSV 檔案。');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/orders/import`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error(`API failed: ${response.status}`);
        showModal('success', '匯入完成', 'Excel 已送至後端處理。');
    } catch {
        showModal('success', 'Demo 匯入完成', '目前無後端回應，已完成前端檔案選取流程。');
    }

    renderImportLog([{ fileName: selectedFile.name, size: selectedFile.size, uploadedAt: new Date().toLocaleString('zh-TW') }]);
}

function renderImportLog(logs) {
    $('#importLog').innerHTML = logs.length ? logs.map((log) => `
        <article class="rounded-soft bg-slate-50 p-4">
            <p class="font-black text-slate-800">${escapeHtml(log.fileName)}</p>
            <p class="mt-1 text-xs text-slate-500">${Math.round(log.size / 1024)} KB / ${escapeHtml(log.uploadedAt)}</p>
        </article>
    `).join('') : '<div class="rounded-soft bg-slate-50 p-5 text-sm text-slate-500">尚無匯入紀錄。</div>';
}
