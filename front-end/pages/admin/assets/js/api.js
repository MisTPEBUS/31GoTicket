'use strict';
//member
const UserApi = {
    getAdminUserByActiveCode(activeCode) {
        return apiFetch(
            `/api/user/admin/info/${encodeURIComponent(activeCode)}`
        );
    },

    updateUserRole(activeCode, role) {
        return apiFetch(
            `/api/user/admin/info/${encodeURIComponent(activeCode)}/${encodeURIComponent(role)}`,
            {
                method: 'POST'
            }
        );
    }
};

//import-order

const OrdersApi = {
    importOrders(payload) {
        return apiFetch('/api/ticket-orders/admin/import', {
            method: 'POST',
            body: payload
        });
    }
};