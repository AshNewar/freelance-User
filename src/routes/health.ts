import { health } from '@user/controllers/health';
import express, { Router } from 'express';


const router :Router = express.Router();

export function HealthRoute(){
    router.get('/user-health', health);

    return router;

}