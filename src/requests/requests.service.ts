// src/requests/requests.service.ts
import { db } from '../_helpers/db';
import { Request, RequestCreationAttributes } from './requests.model';

export const requestService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Request[]> {
    return await db.Request.findAll({
        include: [{ model: db.User, as: 'user' }]
    });
}

async function getById(id: number): Promise<Request> {
    return await getRequest(id);
}

async function create(params: RequestCreationAttributes): Promise<void> {
    // Check if user exists
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error(`User with ID "${params.userId}" not found`);
    }

    await db.Request.create(params);
}

async function update(id: number, params: Partial<RequestCreationAttributes>): Promise<void> {
    const request = await getRequest(id);

    if (params.userId) {
        const user = await db.User.findByPk(params.userId);
        if (!user) {
            throw new Error(`User with ID "${params.userId}" not found`);
        }
    }

    await request.update(params as Partial<RequestCreationAttributes>);
}

async function _delete(id: number): Promise<void> {
    const request = await getRequest(id);
    await request.destroy();
}

async function getRequest(id: number): Promise<Request> {
    const request = await db.Request.findByPk(id, {
        include: [{ model: db.User, as: 'user' }]
    });
    if (!request) throw new Error('Request not found');
    return request;
}