import HttpStatus from 'http-status-codes';
import Nexmo from 'nexmo';

import { 
    NEXMO_API_KEY, 
    NEXMO_API_SECRET, 
    BRAND_NAME, 
    IS_TEST_ENV} from '../config/constants';

import ApiError from '../errors/api_error';

let nexmo: Nexmo;

if (!IS_TEST_ENV) {
    nexmo = new Nexmo({
        apiKey: NEXMO_API_KEY,
        apiSecret: NEXMO_API_SECRET
    });
}

const formatPhoneNumber = (phone: string) => {
    return phone;
}

const doSendVerificationRequest = (phone: string): 
    Promise<string> => {
    phone = formatPhoneNumber(phone);
    return new Promise((resolve, reject) => {
        nexmo.verify.request({
            number: phone,
            brand: BRAND_NAME,
        }, (err, result) => {
            if (err) {
                reject(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to send verification request"));
            } else {
                const verifyRequestId = result.request_id;
                resolve(verifyRequestId);
            }
        });
    });
}

export const sendVerificationRequest = (phone: string): 
    Promise<string> => {
    if (!IS_TEST_ENV) {
        return doSendVerificationRequest(phone);
    }
}

const doVerifyCode = (requestId: string, code: string): 
    Promise<VerificationResult> => {
    return new Promise((resolve, reject) => {
        nexmo.verify.check({
            request_id: requestId,
            code: code,
        }, (err, result) => {
            if (err) {
                reject(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to verify code"));
            } else if(result.status === '0') {
                resolve(VerificationResult.SUCCESS);
            } else if (result.status === '17') {
                resolve(VerificationResult.EXPIRED);
            } else {
                resolve(VerificationResult.FAILED);
            }
        });    
    });
}

export const verifyCode = (requestId: string, code: string): 
    Promise<VerificationResult> => {
    if (IS_TEST_ENV) {
        return mockVerificationRequest(requestId, code);
    } else {
        return doVerifyCode(requestId, code);
    }
}

const verificationMap = new Map<string, string>();

export const putVerificationCode = (requestId: string, code: string) => {
    if (!IS_TEST_ENV) {
        throw new Error("Operation is only allowed in test environment");
    }
    verificationMap.set(requestId, code);
}

const mockVerificationRequest = async (requestId: string, code: string): 
    Promise<VerificationResult> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (verificationMap.has(requestId) === false) {
                resolve(VerificationResult.FAILED);
            }else if (verificationMap.get(requestId) === code) {
                resolve(VerificationResult.SUCCESS);
            } else {
                resolve(VerificationResult.FAILED);
            }
        }, 1000);
    });
}

export enum VerificationResult {
    SUCCESS, EXPIRED, FAILED
}