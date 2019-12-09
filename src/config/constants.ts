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