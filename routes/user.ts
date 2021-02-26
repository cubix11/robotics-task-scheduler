import { Router, Request, Response } from 'express';
import { UserInput } from '../types';
import { schemaSignup, loginSchema } from '../schema';
import Joi from 'joi';

const router: Router = Router();

router.get('/signup', async (req: Request, res: Response): Promise<void> => {
    const user: UserInput = req.body;
    const valid: Joi.ValidationResult = schemaSignup.validate(user);
});

export default router;