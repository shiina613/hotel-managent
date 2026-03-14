package com.hotel.management.exception;

/**
 * Exception thrown when a request contains invalid or malformed data.
 * This exception corresponds to HTTP 400 Bad Request status.
 */
public class BadRequestException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new BadRequestException with the specified detail message.
     *
     * @param message the detail message
     */
    public BadRequestException(String message) {
        super(message);
    }

    /**
     * Constructs a new BadRequestException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new BadRequestException with the specified cause.
     *
     * @param cause the cause of the exception
     */
    public BadRequestException(Throwable cause) {
        super(cause);
    }
}
