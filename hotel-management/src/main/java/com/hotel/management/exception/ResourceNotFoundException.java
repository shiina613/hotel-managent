package com.hotel.management.exception;

/**
 * Exception thrown when a requested resource is not found.
 * This exception corresponds to HTTP 404 Not Found status.
 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new ResourceNotFoundException with resource name, field name, and field value.
     * Generates a formatted message: "ResourceName not found with fieldName: 'fieldValue'"
     *
     * @param resourceName the name of the resource
     * @param fieldName    the name of the field used for search
     * @param fieldValue   the value of the field
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }

    /**
     * Constructs a new ResourceNotFoundException with resource name and ID.
     * Generates a formatted message: "ResourceName not found with id: 'id'"
     *
     * @param resourceName the name of the resource
     * @param id           the ID of the resource
     */
    public ResourceNotFoundException(String resourceName, Integer id) {
        super(String.format("%s not found with id: %d", resourceName, id));
    }
}
