package com.hotel.management.exception;

/**
 * Exception thrown when a request conflicts with the current state of a resource.
 * This exception corresponds to HTTP 409 Conflict status.
 * Typical use case: double-booking conflict.
 */
public class ConflictException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new ConflictException with the specified detail message.
     *
     * @param message the detail message
     */
    public ConflictException(String message) {
        super(message);
    }

    /**
     * Constructs a new ConflictException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
