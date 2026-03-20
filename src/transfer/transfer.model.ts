// src/transfer/transfer.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface TransferAttributes {
    id: number;
    employeeId: number;
    fromDepartmentId: number;
    toDepartmentId: number;
    transferDate: Date;
    reason: string;
    status: string; // pending, approved, rejected
    createdAt: Date;
    updatedAt: Date;
}

export interface TransferCreationAttributes
    extends Optional<TransferAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

export class Transfer
    extends Model<TransferAttributes, TransferCreationAttributes>
    implements TransferAttributes {

    public id!: number;
    public employeeId!: number;
    public fromDepartmentId!: number;
    public toDepartmentId!: number;
    public transferDate!: Date;
    public reason!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function(sequelize: Sequelize): typeof Transfer {
    Transfer.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            employeeId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id'
                }
            },
            fromDepartmentId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'departments',
                    key: 'id'
                }
            },
            toDepartmentId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'departments',
                    key: 'id'
                }
            },
            transferDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            sequelize,
            modelName: 'Transfer',
            tableName: 'transfers',
            timestamps: true,
        }
    );
    return Transfer;
}