import User from "../data/user";

interface HttpEntity <T> {
    body: T;
}

export interface RequestEntity<T> extends HttpEntity<T> {
    url: string;
    params: any;
    user: User;
}

export interface ResponseEntity<T> extends HttpEntity<T> {
    statusCode: number;
}