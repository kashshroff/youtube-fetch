import { NextFunction } from "express";

interface ClientError extends Error {
    status: number,
    data?: any
}

class ClientError extends Error {
    constructor(status: number, message: string, data: any = undefined) {
        super();
        this.name = 'ClientError';
        this.message = message;
        this.status = status;
        this.data = data;
        Object.setPrototypeOf(this, ClientError.prototype);
    }
}

export const catchErrors = function (fn:Function) {
    return function (req:Request, res:Response, next:NextFunction) {
        return fn(req, res, next).catch(next);
    };
};

export default ClientError;  