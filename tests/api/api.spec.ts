import 'mocha';

import getApp, { stopServer } from '../../src/app';
import testAuth from './auth.spec';
import testLocations from './locations.spec';
import testUsers from './users.spec';

const apiPrefix = "/api/v1/";
describe("Api tests", async () => {
    let app = await getApp();

    after(() => {
        stopServer();
    });

    testAuth(app, apiPrefix);
    testLocations(app, apiPrefix);
    testUsers(app, apiPrefix);
});