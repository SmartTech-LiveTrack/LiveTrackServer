interface HttpEntity <T> {
    statusCode: number;
    body: T;
}

export interface RequestEntity<T> extends HttpEntity<T> {
    url: string;
}

export interface ResponseEntity<T> extends HttpEntity<T> {}