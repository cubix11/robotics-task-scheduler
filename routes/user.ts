import { Router, Request, Response } from 'express';
import { UserInput } from '../types';

const router: Router = Router();

router.get('/signup', async (req: Request, res: Response): Promise<void> => {
    const user: UserInput = req.body;
});

export default router;