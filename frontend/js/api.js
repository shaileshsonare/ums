const API_BASE_URL = 'http://localhost:3000/api';

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Set JWT token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove JWT token from localStorage
const removeToken = () => localStorage.removeItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
const authAPI = {
    register: (username, password) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        }),

    login: (username, password) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        })
};

// Employee API
const employeeAPI = {
    getAll: () => apiRequest('/employees'),

    getById: (id) => apiRequest(`/employees/${id}`),

    create: (employeeData) =>
        apiRequest('/employees', {
            method: 'POST',
            body: JSON.stringify(employeeData)
        }),

    update: (id, employeeData) =>
        apiRequest(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(employeeData)
        }),

    delete: (id) =>
        apiRequest(`/employees/${id}`, {
            method: 'DELETE'
        })
};
