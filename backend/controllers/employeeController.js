const db = require('../config/database');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employee ORDER BY id DESC');
        res.json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees'
        });
    }
};

// Get single employee
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const [employees] = await db.query('SELECT * FROM employee WHERE id = ?', [id]);

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            data: employees[0]
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employee'
        });
    }
};

// Create employee
const createEmployee = async (req, res) => {
    try {
        const { name, department, salary, phone } = req.body;

        // Validate input
        if (!name || !department || !salary || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (name, department, salary, phone)'
            });
        }

        // Check if name already exists (unique constraint)
        const [existing] = await db.query('SELECT id FROM employee WHERE name = ?', [name]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this name already exists'
            });
        }

        const [result] = await db.query(
            'INSERT INTO employee (name, department, salary, phone) VALUES (?, ?, ?, ?)',
            [name, department, salary, phone]
        );

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: {
                id: result.insertId,
                name,
                department,
                salary,
                phone
            }
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating employee'
        });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, salary, phone } = req.body;

        // Validate input
        if (!name || !department || !salary || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (name, department, salary, phone)'
            });
        }

        // Check if employee exists
        const [existing] = await db.query('SELECT id FROM employee WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if new name conflicts with another employee
        const [nameConflict] = await db.query(
            'SELECT id FROM employee WHERE name = ? AND id != ?',
            [name, id]
        );
        if (nameConflict.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Another employee with this name already exists'
            });
        }

        await db.query(
            'UPDATE employee SET name = ?, department = ?, salary = ?, phone = ? WHERE id = ?',
            [name, department, salary, phone, id]
        );

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: {
                id: parseInt(id),
                name,
                department,
                salary,
                phone
            }
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee'
        });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const [existing] = await db.query('SELECT id FROM employee WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await db.query('DELETE FROM employee WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
