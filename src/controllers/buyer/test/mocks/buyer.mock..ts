

import { IAuthPayload, IBuyerDocument } from '@ashnewar/helper-library';
import { Response } from 'express';

export const buyerMockRequest =(sessionData:IJWT , currentUser?: IAuthPayload | null,params?: IParams)=>({
    session: sessionData,
    params: params,
    currentUser: currentUser

});


export const buyerMockResponse = ():Response => {
    const res:Response = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

export interface IJWT{
    jwt ? : string;
}

export interface IParams{
    username?: string;
}

export const authUserPayloadMock : IAuthPayload = {
    id: 1,
    username: 'test',
    email: 'jnvspr1123@gmail.com',
    iat: 1623092497
};

export const buyerMock :IBuyerDocument  = {
    _id: '60c0e9daa344t5ggd23d3',
    username: 'test',
    email: 'jnvspr1123@gmail.com',
    country:'India',
    profilePicture : 'test',
    isSeller: false,
    purchasedGigs: [],
    createdAt: '2021-06-08T10:23:38.000Z',
    updatedAt: '2021-06-08T10:23:38.000Z',

}; //casting to IAuthDocument