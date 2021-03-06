import dotenv from 'dotenv';

let env_path = process.env.ENV_PATH;
if (env_path) {
    env_path = env_path.trim();
    let result = dotenv.config({ path: env_path });
    if (result.error) {
        throw result.error;
    }
}

export const DB_URL = process.env.DB_URL;
export const DB_USERNAME = "";
export const DB_PASSWORD = "";
export const DB_NAME = process.env.DB_NAME;

export const PORT = process.env.PORT;

export const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';
export const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export const SECRET = process.env.SECRET;

export const NUM_OF_CONTACT_TELS = 2;
export const MIN_NUM_OF_CONTACTS = 1;
export const MAX_NUM_OF_CONTACTS = 10;

export const NEXMO_API_KEY = process.env.NEXMO_API_KEY;
export const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET;
export const BRAND_NAME = process.env.BRAND_NAME;