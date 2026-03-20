// src/transfer/transfer.service.ts
import { db } from '../_helpers/db';
import { Transfer, TransferCreationAttributes } from './transfer.model';

export const transferService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Transfer[]> {
    return await db.Transfer.findAll({
        include: [
            { model: db.Employee, as: 'employee', include: [{ model: db.User, as: 'user' }] },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' }
        ]
    });
}

async function getById(id: number): Promise<Transfer> {
    return await getTransfer(id);
}

async function create(params: TransferCreationAttributes): Promise<void> {
    // Check if employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee) {
        throw new Error(`Employee with ID "${params.employeeId}" not found`);
    }

    // Check if from department exists
    const fromDepartment = await db.Department.findByPk(params.fromDepartmentId);
    if (!fromDepartment) {
        throw new Error(`From department with ID "${params.fromDepartmentId}" not found`);
    }

    // Check if to department exists
    const toDepartment = await db.Department.findByPk(params.toDepartmentId);
    if (!toDepartment) {
        throw new Error(`To department with ID "${params.toDepartmentId}" not found`);
    }

    await db.Transfer.create(params);
}

async function update(id: number, params: Partial<TransferCreationAttributes>): Promise<void> {
    const transfer = await getTransfer(id);

    if (params.employeeId) {
        const employee = await db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw new Error(`Employee with ID "${params.employeeId}" not found`);
        }
    }

    if (params.fromDepartmentId) {
        const department = await db.Department.findByPk(params.fromDepartmentId);
        if (!department) {
            throw new Error(`From department with ID "${params.fromDepartmentId}" not found`);
        }
    }

    if (params.toDepartmentId) {
        const department = await db.Department.findByPk(params.toDepartmentId);
        if (!department) {
            throw new Error(`To department with ID "${params.toDepartmentId}" not found`);
        }
    }

    await transfer.update(params as Partial<TransferCreationAttributes>);
}

async function _delete(id: number): Promise<void> {
    const transfer = await getTransfer(id);
    await transfer.destroy();
}

async function getTransfer(id: number): Promise<Transfer> {
    const transfer = await db.Transfer.findByPk(id, {
        include: [
            { model: db.Employee, as: 'employee', include: [{ model: db.User, as: 'user' }] },
            { model: db.Department, as: 'fromDepartment' },
            { model: db.Department, as: 'toDepartment' }
        ]
    });
    if (!transfer) throw new Error('Transfer not found');
    return transfer;
}