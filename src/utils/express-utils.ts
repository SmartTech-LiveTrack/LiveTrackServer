import { RequestEntity } from "../models/http";

export const makeCallback = (handler: (body: RequestEntity<any>) => Promise<any>) => {
    return async (req, res, next) => {
        let body = {
            url: req.url,
            body: req.body,
            params: req.params,
            user: req.user,
        };
        try {
            let response = await handler(body);
            return res.status(response.statusCode)
                .json(response.body);
        } catch (e) {
            next(e);
        }
    }
}