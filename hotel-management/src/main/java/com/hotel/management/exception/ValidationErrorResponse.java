package com.hotel.management.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Extended error response for validation errors.
 * Includes detailed field-level error information.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;

    private String error;

    private String message;

    private String path;

    /**
     * Map of field names to their validation error messages.
     * Example: {"email": "must not be blank", "password": "size must be at least 6"}
     */
    @Builder.Default
    private Map<String, String> fieldErrors = new HashMap<>();

    /**
     * Add a field error to the map.
     *
     * @param fieldName the name of the field
     * @param errorMessage the validation error message
     */
    public void addFieldError(String fieldName, String errorMessage) {
        this.fieldErrors.put(fieldName, errorMessage);
    }
}
