'use strict';

document.addEventListener('DOMContentLoaded', () => {
    loadTodayOrderStatus();
});

async function loadTodayOrderStatus() {
    const today = getTodayText();

    try {
        $('#ticketCount').textContent = '讀取中';
        $('#redeemCount').textContent = '讀取中';
        $('#redeemRate').textContent = '讀取中';

        const response = await OrderStatusApi.getByDate(today);
        const data = response.data;

        const orders = data.orders ?? [];
        const totalCount = data.totalCount ?? 0;

        const redeemedCount = orders.filter((order) => {
            return (
                order.status === 'completed_claimed' ||
                order.status === 'completed_unclaimed' ||
                order.status === 'reward_pending'
            );
        }).length;

        const rate =
            totalCount > 0
                ? Math.round((redeemedCount / totalCount) * 100)
                : 0;

        $('#ticketCount').textContent = String(totalCount);
        $('#redeemCount').textContent = String(redeemedCount);
        $('#redeemRate').textContent = `${rate}%`;

        renderTodayOrders(orders);
    } catch (error) {
        console.error(error);

        $('#ticketCount').textContent = '0';
        $('#redeemCount').textContent = '0';
        $('#redeemRate').textContent = '0%';

        $('#verifyLogList').innerHTML = `
            <div class="rounded-soft bg-red-50 p-5 text-sm font-bold text-red-600">
                今日訂單狀態讀取失敗
            </div>
        `;
    }
}

function renderTodayOrders(orders) {
    const target = $('#verifyLogList');

    if (!orders.length) {
        target.innerHTML = `
            <div class="rounded-soft bg-slate-50 p-5 text-sm text-slate-500">
                今日尚無訂單資料。
            </div>
        `;
        return;
    }

    target.innerHTML = orders.map((order) => `
        <article class="rounded-soft border border-slate-200 bg-white/70 p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="font-black text-slate-800">
                        ${escapeHtml(order.orderNo || '-')}
                    </p>
                    <p class="mt-1 text-sm font-bold text-slate-600">
                        ${escapeHtml(order.participantName || '-')}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                        建立時間：${escapeHtml(order.createdAt || '-')}
                    </p>
                </div>

                ${statusBadge(order.status || '-')}
            </div>
        </article>
    `).join('');
}

function getTodayText() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}