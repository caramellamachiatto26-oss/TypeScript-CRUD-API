// src/transfer/transfer.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { transferService } from './transfer.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    transferService.getAll()
        .then(transfers => res.json(transfers))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    transferService.getById(Number(req.params.id))
        .then(transfer => res.json(transfer))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    transferService.create(req.body)
        .then(() => res.json({ message: "Transfer created" }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    transferService.update(Number(req.params.id), req.body)
        .then(transfer => res.json(transfer))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    transferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted successfully' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.number().integer().required(),
        fromDepartmentId: Joi.number().integer().required(),
        toDepartmentId: Joi.number().integer().required(),
        transferDate: Joi.date().required(),
        reason: Joi.string().empty(''),
        status: Joi.string().valid('pending', 'approved', 'rejected').empty(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.number().integer().empty(),
        fromDepartmentId: Joi.number().integer().empty(),
        toDepartmentId: Joi.number().integer().empty(),
        transferDate: Joi.date().empty(),
        reason: Joi.string().empty(''),
        status: Joi.string().valid('pending', 'approved', 'rejected').empty(),
    });
    validateRequest(req, next, schema);
}