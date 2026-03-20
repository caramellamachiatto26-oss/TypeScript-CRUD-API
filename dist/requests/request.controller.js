"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const requests_service_1 = require("./requests.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    requests_service_1.requestService.getAll()
        .then(requests => res.json(requests))
        .catch(next);
}
function getById(req, res, next) {
    requests_service_1.requestService.getById(Number(req.params.id))
        .then(request => res.json(request))
        .catch(next);
}
function create(req, res, next) {
    requests_service_1.requestService.create(req.body)
        .then(() => res.json({ message: "Request created" }))
        .catch(next);
}
function update(req, res, next) {
    requests_service_1.requestService.update(Number(req.params.id), req.body)
        .then(request => res.json(request))
        .catch(next);
}
function _delete(req, res, next) {
    requests_service_1.requestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().required(),
        type: joi_1.default.string().valid('Equipment', 'Leave', 'Resources').required(),
        items: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
            quantity: joi_1.default.number().integer().min(1).required()
        })).required(),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected').empty(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().empty(),
        type: joi_1.default.string().valid('Equipment', 'Leave', 'Resources').empty(),
        items: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
            quantity: joi_1.default.number().integer().min(1).required()
        })).empty(),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected').empty(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
