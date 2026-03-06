"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const role_1 = require("../_helpers/role");
const validateRequest_1 = require("../_middleware/validateRequest");
const users_service_1 = require("./users.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    users_service_1.userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
function getById(req, res, next) {
    users_service_1.userService.getById(Number(req.params.id))
        .then(user => res.json(user))
        .catch(next);
}
function create(req, res, next) {
    users_service_1.userService.create(req.body)
        .then(() => res.json({ message: "user created" })) // This line sends the response
        .catch(next);
}
function update(req, res, next) {
    users_service_1.userService.update(Number(req.params.id), req.body)
        .then(user => res.json(user))
        .catch(next);
}
function _delete(req, res, next) {
    users_service_1.userService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().empty(),
        firstName: joi_1.default.string().empty(),
        lastName: joi_1.default.string().empty(),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).empty(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).empty(''),
    }).with('password', 'confirmPassword');
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        title: joi_1.default.string().empty(),
        firstName: joi_1.default.string().empty(),
        lastName: joi_1.default.string().empty(),
        role: joi_1.default.string().valid(role_1.Role.Admin, role_1.Role.User).empty(),
        email: joi_1.default.string().email().empty(),
        password: joi_1.default.string().min(6).empty(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).empty(''),
    }).with('password', 'confirmPassword');
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
