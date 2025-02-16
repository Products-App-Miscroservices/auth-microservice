import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class CustomError {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ) { }

    static badRequest(message: string) {
        return new RpcException({
            status: HttpStatus.BAD_REQUEST,
            message
        });
    }

    static unauthorized(message: string) {
        return new RpcException({
            status: HttpStatus.UNAUTHORIZED,
            message
        });
    }

    static forbidden(message: string) {
        return new RpcException({
            status: HttpStatus.FORBIDDEN,
            message
        });
    }

    static notFound(message: string) {
        return new RpcException({
            status: HttpStatus.NOT_FOUND,
            message
        });
    }

    static internalServer(message: string) {
        return new RpcException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message
        });
    }
}