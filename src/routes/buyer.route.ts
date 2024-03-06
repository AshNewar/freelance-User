import { currentUsername, email, username } from '@user/controllers/buyer/get';
import express, { Router } from 'express';


const router :Router = express.Router();

export const buyerRoutes = () :Router => {
    router.get('/email',email);
    router.get('/username',currentUsername);
    router.get('/:username',username);
    return router;

};