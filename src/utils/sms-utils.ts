import {
    BRAND_NAME,
    IS_TEST_ENV
} from '../config/constants';
import nexmo from '../config/nexmo';

const doSendSms = (to: string, text: string):
    Promise<void> => {
    return new Promise((resolve, reject) => {
        nexmo.message.sendSms(
            BRAND_NAME, to, text, (err, responseData) => {
                if (err) {
                    reject(err);
                } else {
                    if (responseData.messages[0]['status'] === "0") {
                        console.log("Message sent successfully.");
                        resolve();
                    } else {
                        reject(new Error(
                            `Message failed with error: ${responseData.messages[0]['error-text']}`));
                    }
                }
            })
    });
}

const mockSendSms = (to: string, text: string):
    Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

export const sendSms = (to: string, text: string):
    Promise<void> => {
    if (IS_TEST_ENV) {
        return mockSendSms(to, text);
    } else {
        return doSendSms(to, text);
    }
}