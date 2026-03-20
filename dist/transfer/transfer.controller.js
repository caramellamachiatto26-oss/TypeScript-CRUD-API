"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const transfer_service_1 = require("./transfer.service");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    transfer_service_1.transferService.getAll()
        .then(transfers => res.json(transfers))
        .catch(next);
}
function getById(req, res, next) {
    transfer_service_1.transferService.getById(Number(req.params.id))
        .then(transfer => res.json(transfer))
        .catch(next);
}
function create(req, res, next) {
    transfer_service_1.transferService.create(req.body)
        .then(() => res.json({ message: "Transfer created" }))
        .catch(next);
}
function update(req, res, next) {
    transfer_service_1.transferService.update(Number(req.params.id), req.body)
        .then(transfer => res.json(transfer))
        .catch(next);
}
function _delete(req, res, next) {
    transfer_service_1.transferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted successfully' }))
        .catch(next);
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        employeeId: joi_1.default.number().integer().required(),
        fromDepartmentId: joi_1.default.number().integer().required(),
        toDepartmentId: joi_1.default.number().integer().required(),
        transferDate: joi_1.default.date().required(),
        reason: joi_1.default.string().empty(''),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected').empty(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        employeeId: joi_1.default.number().integer().empty(),
        fromDepartmentId: joi_1.default.number().integer().empty(),
        toDepartmentId: joi_1.default.number().integer().empty(),
        transferDate: joi_1.default.date().empty(),
        reason: joi_1.default.string().empty(''),
        status: joi_1.default.string().valid('pending', 'approved', 'rejected').empty(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
