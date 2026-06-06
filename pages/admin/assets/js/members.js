'use strict';

let memberState = getState();

document.addEventListener('DOMContentLoaded', () => {
    $('#searchMemberBtn').addEventListener('click', renderMemberByCode);
    $('#memberCodeInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') renderMemberByCode();
    });
    renderMemberEmpty('請輸入活動碼查詢會員。');
});

function renderMemberByCode() {
    const code = $('#memberCodeInput').value.trim();
    const member = memberState.members.find((item) => item.activityCode === code);

    if (!member) {
        renderMemberEmpty('查無會員資料，請確認活動碼是否正確。');
        return;
    }

    $('#memberResult').innerHTML = `
        <article class="rounded-card border border-white bg-white/80 p-5 shadow-sm">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p class="text-xs font-black tracking-[.3em] text-primary-700">${escapeHtml(member.id)}</p>
                    <h4 class="mt-2 text-2xl font-black">${escapeHtml(member.name)}</h4>
                    <p class="mt-2 text-sm text-slate-500">${escapeHtml(member.phone)} / ${escapeHtml(member.activityCode)}</p>
                    <p class="mt-3 text-sm text-slate-500">打卡數：<strong class="text-slate-800">${member.checkins}</strong></p>
                    <div class="mt-4">${statusBadge(member.rewardStatus)}</div>
                </div>
                <label class="block sm:w-56"><span class="mb-2 block text-sm font-medium text-slate-600">身分權限</span><select id="roleSelect" class="h-14 w-full rounded-soft border border-slate-200 bg-slate-50 px-5 outline-none focus:border-primary-500 focus:ring-4 focus:ring-blue-100"><option value="member">一般會員</option><option value="staff">工作人員</option><option value="admin">管理員</option></select></label>
            </div>
            <button id="saveRoleBtn" class="primary-gradient mt-5 h-14 w-full rounded-soft font-black text-white shadow-lg sm:w-auto sm:px-8">儲存權限</button>
        </article>
    `;

    $('#roleSelect').value = member.role;
    $('#saveRoleBtn').addEventListener('click', () => {
        member.role = $('#roleSelect').value;
        saveState(memberState);
        showModal('success', '權限已更新', `${member.name} 已設定為 ${STATUS_TEXT_MAP[member.role]}。`);
    });
}

function renderMemberEmpty(message) {
    $('#memberResult').innerHTML = `<div class="rounded-card bg-slate-50 p-8 text-center text-sm text-slate-500">${escapeHtml(message)}</div>`;
}
