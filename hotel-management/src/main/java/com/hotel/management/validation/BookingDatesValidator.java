package com.hotel.management.validation;

import com.hotel.management.dto.request.CreateBookingRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDateTime;

/**
 * Validator for {@link ValidBookingDates}.
 * Validates that:
 * <ul>
 *   <li>checkInAt is not null</li>
 *   <li>checkOutAt is not null</li>
 *   <li>checkInAt is today or in the future (not in the past)</li>
 *   <li>checkInAt is strictly before checkOutAt</li>
 * </ul>
 */
public class BookingDatesValidator implements ConstraintValidator<ValidBookingDates, CreateBookingRequest> {

    @Override
    public void initialize(ValidBookingDates constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(CreateBookingRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true; // null object is handled by @NotNull on the parameter
        }

        LocalDateTime checkIn = request.getCheckInAt();
        LocalDateTime checkOut = request.getCheckOutAt();

        // If either date is null, let @NotNull handle it — don't double-report
        if (checkIn == null || checkOut == null) {
            return true;
        }

        LocalDateTime now = LocalDateTime.now();

        // Disable default constraint violation so we can provide a custom message
        context.disableDefaultConstraintViolation();

        // Check: checkInAt must not be in the past
        if (checkIn.isBefore(now)) {
            context.buildConstraintViolationWithTemplate(
                            "Ngày check-in không thể là ngày trong quá khứ")
                    .addPropertyNode("checkInAt")
                    .addConstraintViolation();
            return false;
        }

        // Check: checkInAt must be strictly before checkOutAt
        if (!checkIn.isBefore(checkOut)) {
            context.buildConstraintViolationWithTemplate(
                            "Ngày check-in phải trước ngày check-out và không thể là ngày trong quá khứ")
                    .addPropertyNode("checkInAt")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
