// src/_helpers/db.ts
import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

export interface Database{
    Sequelize: any;
    User: any;
    Department: any;
    Employee: any;
    Request: any;
    Transfer: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const {host, port, user, password, database} = config.database;

    const connection = await mysql.createConnection({host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, {dialect: 'mysql'});

    const { default: userModel } = await import('../users/users.model');
    db.User = userModel(sequelize);

    const { default: departmentModel } = await import('../department/department.model');
    db.Department = departmentModel(sequelize);

    const { default: employeeModel } = await import('../employee/employee.model');
    db.Employee = employeeModel(sequelize);

    const { default: requestModel } = await import('../requests/requests.model');
    db.Request = requestModel(sequelize);

    const { default: transferModel } = await import('../transfer/transfer.model');
    db.Transfer = transferModel(sequelize);

    // Define associations
    db.Employee.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
    db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

    db.Request.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

    db.Transfer.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'employee' });
    db.Transfer.belongsTo(db.Department, { foreignKey: 'fromDepartmentId', as: 'fromDepartment' });
    db.Transfer.belongsTo(db.Department, { foreignKey: 'toDepartmentId', as: 'toDepartment' });

    await sequelize.sync({alter: true});

    console.log('Database Initialized and models synced');
    
}


