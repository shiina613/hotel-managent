package com.hotel.management.exception;

/**
 * Exception thrown when a business logic violation occurs.
 * This exception is used for domain-specific errors that violate business rules.
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new BusinessException with the specified detail message.
     *
     * @param message the detail message
     */
    public BusinessException(String message) {
        super(message);
    }

    /**
     * Constructs a new BusinessException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new BusinessException with the specified cause.
     *
     * @param cause the cause of the exception
     */
    public BusinessException(Throwable cause) {
        super(cause);
    }
}
