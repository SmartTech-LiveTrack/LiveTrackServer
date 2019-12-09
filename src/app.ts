import express from 'express';
import { Server } from 'http';
import passport from 'passport';

import { PORT, IS_TEST_ENV } from './config/constants';
import { connect, close as closeDb } from './config/db';
import ApiError from './errors/api_error';
import ApiResponse from './models/api-response';
import { logRequest, logError } from './logger';
import './passport';

const app = express();
let server: Server;
app.use(express.json());
app.use(passport.initialize());
app.use(logRequest);

const doStartServer = async () => {
    await connect();

    const router: any = (await import('./routes')).default;
    router(app);

    app.use(logError);

    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError) {
            res.status(400)
                .json(ApiResponse.error("Invalid JSON", []));
        } else if (err instanceof ApiError ) {
            res.status(err.status)
                .json(ApiResponse.error(err.message, err.getErrors()));
        } else {
            next(err);
        }
    });

    app.use((err, req, res, next) => {
        res.status(500)
            .json(ApiResponse.error("An error occurred", []));
    });

    server = app.listen(PORT, () => {
        console.log("Server started on " + PORT);    
    });

    server.on('close', async () => {
        await closeDb();
        console.log('Stopping server...')
    });
    
    return app;
}

if (!IS_TEST_ENV) {
    doStartServer();
}

export default async function () {
  if (IS_TEST_ENV) {
      return await doStartServer();
  }      
};

export const stopServer = () => {
    if (server) {
        server.close();
    } else {
        throw new Error('Server not running');
    }
}