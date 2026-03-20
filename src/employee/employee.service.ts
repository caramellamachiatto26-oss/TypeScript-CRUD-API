// src/employee/employee.service.ts
import { db } from '../_helpers/db';
import { Employee, EmployeeCreationAttributes } from './employee.model';

export const employeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Employee[]> {
    return await db.Employee.findAll({
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' }
        ]
    });
}

async function getById(id: number): Promise<Employee> {
    return await getEmployee(id);
}

async function create(params: EmployeeCreationAttributes & { email: string }): Promise<void> {
    // Find user by email
    const user = await db.User.findOne({ where: { email: params.email } });
    if (!user) {
        throw new Error(`User with email "${params.email}" not found`);
    }

    // Check if department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department) {
        throw new Error(`Department with ID "${params.departmentId}" not found`);
    }

    // Check if employeeId is unique
    const existingEmployee = await db.Employee.findOne({ where: { employeeId: params.employeeId } });
    if (existingEmployee) {
        throw new Error(`Employee ID "${params.employeeId}" already exists`);
    }

    await db.Employee.create({
        ...params,
        userId: user.id,
    });
}

async function update(id: number, params: Partial<EmployeeCreationAttributes> & { email?: string }): Promise<void> {
    const employee = await getEmployee(id);

    if (params.email) {
        const user = await db.User.findOne({ where: { email: params.email } });
        if (!user) {
            throw new Error(`User with email "${params.email}" not found`);
        }
        params.userId = user.id;
        delete params.email;
    }

    if (params.departmentId) {
        const department = await db.Department.findByPk(params.departmentId);
        if (!department) {
            throw new Error(`Department with ID "${params.departmentId}" not found`);
        }
    }

    if (params.employeeId) {
        const existingEmployee = await db.Employee.findOne({ where: { employeeId: params.employeeId, id: { [db.Sequelize.Op.ne]: id } } });
        if (existingEmployee) {
            throw new Error(`Employee ID "${params.employeeId}" already exists`);
        }
    }

    await employee.update(params as Partial<EmployeeCreationAttributes>);
}

async function _delete(id: number): Promise<void> {
    const employee = await getEmployee(id);
    await employee.destroy();
}

async function getEmployee(id: number): Promise<Employee> {
    const employee = await db.Employee.findByPk(id, {
        include: [
            { model: db.User, as: 'user' },
            { model: db.Department, as: 'department' }
        ]
    });
    if (!employee) {
        throw new Error('Employee not found');
    }
    return employee;
}
