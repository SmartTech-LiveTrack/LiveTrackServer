import Nexmo from 'nexmo';

import {
    NEXMO_API_KEY, 
    NEXMO_API_SECRET,
    IS_TEST_ENV
 } from './constants';

let nexmo;
if (!IS_TEST_ENV) {
    nexmo = new Nexmo({
        apiKey: NEXMO_API_KEY,
        apiSecret: NEXMO_API_SECRET
    });
}

export default nexmo;