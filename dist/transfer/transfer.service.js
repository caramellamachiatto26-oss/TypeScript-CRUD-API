"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferService = void 0;
// src/transfer/transfer.service.ts
const db_1 = require("../_helpers/db");
exports.transferService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};
async function getAll() {
    return await db_1.db.Transfer.findAll({
        include: [
            { model: db_1.db.Employee, as: 'employee', include: [{ model: db_1.db.User, as: 'user' }] },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' }
        ]
    });
}
async function getById(id) {
    return await getTransfer(id);
}
async function create(params) {
    // Check if employee exists
    const employee = await db_1.db.Employee.findByPk(params.employeeId);
    if (!employee) {
        throw new Error(`Employee with ID "${params.employeeId}" not found`);
    }
    // Check if from department exists
    const fromDepartment = await db_1.db.Department.findByPk(params.fromDepartmentId);
    if (!fromDepartment) {
        throw new Error(`From department with ID "${params.fromDepartmentId}" not found`);
    }
    // Check if to department exists
    const toDepartment = await db_1.db.Department.findByPk(params.toDepartmentId);
    if (!toDepartment) {
        throw new Error(`To department with ID "${params.toDepartmentId}" not found`);
    }
    await db_1.db.Transfer.create(params);
}
async function update(id, params) {
    const transfer = await getTransfer(id);
    if (params.employeeId) {
        const employee = await db_1.db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw new Error(`Employee with ID "${params.employeeId}" not found`);
        }
    }
    if (params.fromDepartmentId) {
        const department = await db_1.db.Department.findByPk(params.fromDepartmentId);
        if (!department) {
            throw new Error(`From department with ID "${params.fromDepartmentId}" not found`);
        }
    }
    if (params.toDepartmentId) {
        const department = await db_1.db.Department.findByPk(params.toDepartmentId);
        if (!department) {
            throw new Error(`To department with ID "${params.toDepartmentId}" not found`);
        }
    }
    await transfer.update(params);
}
async function _delete(id) {
    const transfer = await getTransfer(id);
    await transfer.destroy();
}
async function getTransfer(id) {
    const transfer = await db_1.db.Transfer.findByPk(id, {
        include: [
            { model: db_1.db.Employee, as: 'employee', include: [{ model: db_1.db.User, as: 'user' }] },
            { model: db_1.db.Department, as: 'fromDepartment' },
            { model: db_1.db.Department, as: 'toDepartment' }
        ]
    });
    if (!transfer)
        throw new Error('Transfer not found');
    return transfer;
}
