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
    importExcel(file) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/api/ticket-orders/admin/import`, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        }).then(async (response) => {
            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw {
                    status: response.status,
                    data: result,
                    message: result?.message || `API request failed: ${response.status}`
                };
            }

            return result;
        });
    }
};