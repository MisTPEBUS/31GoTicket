'use strict';

let API_BASE_URL =
    'https://9f4d-59-124-220-148.ngrok-free.app';

const ApiClient = {
    async request(path, options = {}) {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers ?? {})
            },
            ...options
        });
        console.log();
        const result = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.message || 'API request failed'
            );
        }

        return result;
    },

    get(path) {
        return this.request(path, {
            method: 'GET'
        });
    },

    post(path, body) {
        return this.request(path, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(path, body) {
        return this.request(path, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(path) {
        return this.request(path, {
            method: 'DELETE'
        });
    }
};