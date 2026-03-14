package com.hotel.management.exception;

/**
 * Exception thrown when a user is authenticated but lacks permission to access a resource.
 * This exception corresponds to HTTP 403 Forbidden status.
 */
public class ForbiddenException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new ForbiddenException with the specified detail message.
     *
     * @param message the detail message
     */
    public ForbiddenException(String message) {
        super(message);
    }

    /**
     * Constructs a new ForbiddenException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public ForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new ForbiddenException with the specified cause.
     *
     * @param cause the cause of the exception
     */
    public ForbiddenException(Throwable cause) {
        super(cause);
    }
}
