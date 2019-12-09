import express from 'express';

import AuthRouter from './auth';
import UserRouter from './user';

const routePrefix = '/api/v1/';
export default function (app: express.Express) { 
    app.use(routePrefix+'auth', AuthRouter);
    app.use(routePrefix+'users', UserRouter);
}