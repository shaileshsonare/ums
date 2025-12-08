const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

// All routes are protected with JWT authentication
router.use(authMiddleware);

// GET /api/employees - Get all employees
router.get('/', getAllEmployees);

// GET /api/employees/:id - Get single employee
router.get('/:id', getEmployeeById);

// POST /api/employees - Create employee
router.post('/', createEmployee);

// PUT /api/employees/:id - Update employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;
