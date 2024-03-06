import { username } from '@user/controllers/buyer/get';
import { seller } from '@user/controllers/seller/create';
import { email, id, random } from '@user/controllers/seller/get';
import { seed } from '@user/controllers/seller/seed';
import { update } from '@user/controllers/seller/update';
import express ,{ Router } from 'express';

const router:Router =express.Router();

export const sellerRoutes = ():Router=>{
    router.get('/:sellerId',id);
    router.get('/username/:username',username);
    router.get('/email/:email',email);
    router.get('/random/:size',random);
    router.post('/create',seller);
    router.put('/:sellerId',update);
    router.put('/seed/:count',seed);

    return router;
};