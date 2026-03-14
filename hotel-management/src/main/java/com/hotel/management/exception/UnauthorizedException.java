package com.hotel.management.exception;

/**
 * Exception thrown when authentication fails or credentials are invalid.
 * This exception corresponds to HTTP 401 Unauthorized status.
 */
public class UnauthorizedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new UnauthorizedException with the specified detail message.
     *
     * @param message the detail message
     */
    public UnauthorizedException(String message) {
        super(message);
    }

    /**
     * Constructs a new UnauthorizedException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new UnauthorizedException with the specified cause.
     *
     * @param cause the cause of the exception
     */
    public UnauthorizedException(Throwable cause) {
        super(cause);
    }
}
