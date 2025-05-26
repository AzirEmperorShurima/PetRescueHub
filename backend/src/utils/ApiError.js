import { StatusCodes } from 'http-status-codes';

/**
 * Lớp lỗi cơ sở cho API
 */
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Lỗi 400 Bad Request - Dùng khi dữ liệu đầu vào không hợp lệ
 */
export class BadRequestError extends ApiError {
    constructor(message = 'Dữ liệu đầu vào không hợp lệ') {
        super(message, StatusCodes.BAD_REQUEST);
    }
}

/**
 * Lỗi 401 Unauthorized - Dùng khi người dùng chưa xác thực
 */
export class UnauthorizedError extends ApiError {
    constructor(message = 'Bạn cần đăng nhập để thực hiện hành động này') {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

/**
 * Lỗi 403 Forbidden - Dùng khi người dùng không có quyền
 */
export class ForbiddenError extends ApiError {
    constructor(message = 'Bạn không có quyền thực hiện hành động này') {
        super(message, StatusCodes.FORBIDDEN);
    }
}

/**
 * Lỗi 404 Not Found - Dùng khi không tìm thấy tài nguyên
 */
export class NotFoundError extends ApiError {
    constructor(message = 'Không tìm thấy tài nguyên yêu cầu') {
        super(message, StatusCodes.NOT_FOUND);
    }
}

/**
 * Lỗi 409 Conflict - Dùng khi có xung đột dữ liệu
 */
export class ConflictError extends ApiError {
    constructor(message = 'Dữ liệu đã tồn tại hoặc xung đột') {
        super(message, StatusCodes.CONFLICT);
    }
}

/**
 * Lỗi 500 Internal Server Error - Dùng cho lỗi server
 */
export class InternalServerError extends ApiError {
    constructor(message = 'Lỗi máy chủ nội bộ') {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// Export lớp cơ sở để có thể mở rộng thêm các lớp lỗi khác nếu cần
export default ApiError;