import 'mocha';

import getApp, { stopServer } from '../../src/app';
import testUsers from './users.spec';
import testAuth from './auth.spec';

const apiPrefix = "/api/v1/";
describe("Api tests", async () => {
    let app = await getApp();

    after(() => {
        stopServer();
    });

    testAuth(app, apiPrefix);
    testUsers(app, apiPrefix);
});