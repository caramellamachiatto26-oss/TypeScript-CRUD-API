"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeService = void 0;
// src/employee/employee.service.ts
const db_1 = require("../_helpers/db");
exports.employeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};
async function getAll() {
    return await db_1.db.Employee.findAll({
        include: [
            { model: db_1.db.Department, as: 'department' },
            { model: db_1.db.User, as: 'user' }
        ]
    });
}
async function getById(id) {
    return await getEmployee(id);
}
async function create(params) {
    const existingEmployee = await db_1.db.Employee.findOne({ where: { employeeId: params.employeeId } });
    if (existingEmployee) {
        throw new Error(`Employee ID "${params.employeeId}" already exists`);
    }
    // Check if user exists
    const user = await db_1.db.User.findOne({ where: { email: params.id } });
    if (!user) {
        throw new Error(`User with email "${params.id}" not found`);
    }
    // Check if department exists
    const department = await db_1.db.Department.findByPk(params.departmentId);
    if (!department) {
        throw new Error(`Department with ID "${params.departmentId}" not found`);
    }
    await db_1.db.Employee.create(params);
}
async function update(id, params) {
    const employee = await getEmployee(id);
    if (params.id) {
        const user = await db_1.db.User.findOne({ where: { email: params.id } });
        if (!user) {
            throw new Error(`User with email "${params.id}" not found`);
        }
    }
    if (params.departmentId) {
        const department = await db_1.db.Department.findByPk(params.departmentId);
        if (!department) {
            throw new Error(`Department with ID "${params.departmentId}" not found`);
        }
    }
    await employee.update(params);
}
async function _delete(id) {
    const employee = await getEmployee(id);
    await employee.destroy();
}
async function getEmployee(id) {
    const employee = await db_1.db.Employee.findByPk(id, {
        include: [
            { model: db_1.db.Department, as: 'department' },
            { model: db_1.db.User, as: 'user' }
        ]
    });
    if (!employee)
        throw new Error('Employee not found');
    return employee;
}
