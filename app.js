const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./backend/routes/authRoutes');
const employeeRoutes = require('./backend/routes/employeeRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Employee Management System API',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            employees: {
                getAll: 'GET /api/employees',
                getById: 'GET /api/employees/:id',
                create: 'POST /api/employees',
                update: 'PUT /api/employees/:id',
                delete: 'DELETE /api/employees/:id'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`📝 Endpoints: http://localhost:${PORT}/\n`);
});
