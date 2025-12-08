// Check if user is logged in
if (!getToken()) {
    window.location.href = 'index.html';
}

// DOM Elements
const employeesTableBody = document.getElementById('employeesTableBody');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const deleteModal = document.getElementById('deleteModal');
const employeeForm = document.getElementById('employeeForm');
const closeModal = document.getElementById('closeModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const alertContainer = document.getElementById('alertContainer');
const modalTitle = document.getElementById('modalTitle');

let employees = [];
let currentEmployeeId = null;
let deleteEmployeeId = null;

// Show alert message
const showAlert = (message, type = 'error') => {
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
};

// Load employees
const loadEmployees = async () => {
    try {
        const response = await employeeAPI.getAll();

        if (response.success) {
            employees = response.data;
            renderEmployees(employees);
        }
    } catch (error) {
        if (error.message.includes('token') || error.message.includes('Access denied')) {
            showAlert('Session expired. Please login again.');
            setTimeout(() => {
                removeToken();
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showAlert('Failed to load employees: ' + error.message);
            employeesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-secondary);">
                        Failed to load employees. Please try again.
                    </td>
                </tr>
            `;
        }
    }
};

// Render employees table
const renderEmployees = (employeeList) => {
    if (employeeList.length === 0) {
        employeesTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: var(--spacing-xl);">
                    No employees found. Click "Add Employee" to create one.
                </td>
            </tr>
        `;
        return;
    }

    employeesTableBody.innerHTML = employeeList.map(emp => `
        <tr>
            <td>${emp.id}</td>
            <td style="font-weight: 600;">${emp.name}</td>
            <td>${emp.department}</td>
            <td>₹${emp.salary.toLocaleString()}</td>
            <td>${emp.phone}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon edit" onclick="editEmployee(${emp.id})" title="Edit">
                        ✏️ Edit
                    </button>
                    <button class="btn-icon delete" onclick="showDeleteModal(${emp.id})" title="Delete">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

// Search employees
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.phone.toString().includes(searchTerm)
    );

    renderEmployees(filtered);
});

// Open add employee modal
addEmployeeBtn.addEventListener('click', () => {
    currentEmployeeId = null;
    modalTitle.textContent = 'Add Employee';
    employeeForm.reset();
    document.getElementById('employeeId').value = '';
    employeeModal.classList.add('active');
});

// Edit employee
window.editEmployee = async (id) => {
    try {
        const response = await employeeAPI.getById(id);

        if (response.success) {
            const emp = response.data;
            currentEmployeeId = id;
            modalTitle.textContent = 'Edit Employee';

            document.getElementById('employeeId').value = emp.id;
            document.getElementById('employeeName').value = emp.name;
            document.getElementById('employeeDepartment').value = emp.department;
            document.getElementById('employeeSalary').value = emp.salary;
            document.getElementById('employeePhone').value = emp.phone;

            employeeModal.classList.add('active');
        }
    } catch (error) {
        showAlert('Failed to load employee details: ' + error.message);
    }
};

// Save employee (create or update)
employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeData = {
        name: document.getElementById('employeeName').value.trim(),
        department: document.getElementById('employeeDepartment').value.trim(),
        salary: parseInt(document.getElementById('employeeSalary').value),
        phone: parseInt(document.getElementById('employeePhone').value)
    };

    const saveBtn = document.getElementById('saveEmployeeBtn');
    const originalText = saveBtn.textContent;

    try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        let response;
        if (currentEmployeeId) {
            response = await employeeAPI.update(currentEmployeeId, employeeData);
        } else {
            response = await employeeAPI.create(employeeData);
        }

        if (response.success) {
            showAlert(response.message, 'success');
            employeeModal.classList.remove('active');
            employeeForm.reset();
            loadEmployees();
        }
    } catch (error) {
        showAlert(error.message || 'Failed to save employee');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
});

// Show delete confirmation modal
window.showDeleteModal = (id) => {
    deleteEmployeeId = id;
    deleteModal.classList.add('active');
};

// Confirm delete
confirmDeleteBtn.addEventListener('click', async () => {
    if (!deleteEmployeeId) return;

    const originalText = confirmDeleteBtn.textContent;

    try {
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Deleting...';

        const response = await employeeAPI.delete(deleteEmployeeId);

        if (response.success) {
            showAlert(response.message, 'success');
            deleteModal.classList.remove('active');
            deleteEmployeeId = null;
            loadEmployees();
        }
    } catch (error) {
        showAlert(error.message || 'Failed to delete employee');
    } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = originalText;
    }
});

// Close modals
closeModal.addEventListener('click', () => {
    employeeModal.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    employeeModal.classList.remove('active');
});

closeDeleteModal.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteEmployeeId = null;
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    deleteEmployeeId = null;
});

// Close modal on outside click
employeeModal.addEventListener('click', (e) => {
    if (e.target === employeeModal) {
        employeeModal.classList.remove('active');
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
        deleteEmployeeId = null;
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    removeToken();
    window.location.href = 'index.html';
});

// Initial load
loadEmployees();
