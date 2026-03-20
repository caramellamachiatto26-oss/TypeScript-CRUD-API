// src/requests/request.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { requestService } from './requests.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    requestService.getAll()
        .then(requests => res.json(requests))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    requestService.getById(Number(req.params.id))
        .then(request => res.json(request))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    requestService.create(req.body)
        .then(() => res.json({ message: "Request created" }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    requestService.update(Number(req.params.id), req.body)
        .then(request => res.json(request))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    requestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted successfully' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        userId: Joi.number().integer().required(),
        type: Joi.string().valid('Equipment', 'Leave', 'Resources').required(),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required()
            })
        ).required(),
        status: Joi.string().valid('pending', 'approved', 'rejected').empty(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        userId: Joi.number().integer().empty(),
        type: Joi.string().valid('Equipment', 'Leave', 'Resources').empty(),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required()
            })
        ).empty(),
        status: Joi.string().valid('pending', 'approved', 'rejected').empty(),
    });
    validateRequest(req, next, schema);
}