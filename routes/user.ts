import { Router, Request, Response, NextFunction } from 'express';
import { UserInput } from '../types';
import { schemaSignup, loginSchema } from '../schema';
import Joi from 'joi';

const router: Router = Router();

router.get('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user: UserInput = req.body;
    const valid: Joi.ValidationResult = schemaSignup.validate(user);
    if(valid.error) {
        res.statusCode = 400;
        return next(new Error(valid.error.details[0].message));
    };
});

export default router;