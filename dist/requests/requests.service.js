"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestService = void 0;
// src/requests/requests.service.ts
const db_1 = require("../_helpers/db");
exports.requestService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};
async function getAll() {
    return await db_1.db.Request.findAll({
        include: [{ model: db_1.db.User, as: 'user' }]
    });
}
async function getById(id) {
    return await getRequest(id);
}
async function create(params) {
    // Check if user exists
    const user = await db_1.db.User.findByPk(params.userId);
    if (!user) {
        throw new Error(`User with ID "${params.userId}" not found`);
    }
    await db_1.db.Request.create(params);
}
async function update(id, params) {
    const request = await getRequest(id);
    if (params.userId) {
        const user = await db_1.db.User.findByPk(params.userId);
        if (!user) {
            throw new Error(`User with ID "${params.userId}" not found`);
        }
    }
    await request.update(params);
}
async function _delete(id) {
    const request = await getRequest(id);
    await request.destroy();
}
async function getRequest(id) {
    const request = await db_1.db.Request.findByPk(id, {
        include: [{ model: db_1.db.User, as: 'user' }]
    });
    if (!request)
        throw new Error('Request not found');
    return request;
}
