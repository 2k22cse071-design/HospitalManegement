import API_BASE_URL from './config';

const api = {
    get: (url) => {
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    post: (url, body) => {
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
    },

    put: (url, body) => {
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
    },

    delete: (url) => {
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

export default api;
