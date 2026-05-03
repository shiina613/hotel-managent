package com.hotel.management.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Class-level constraint that validates booking dates:
 * - checkInAt must not be null
 * - checkOutAt must not be null
 * - checkInAt must be today or in the future (not in the past)
 * - checkInAt must be strictly before checkOutAt
 */
@Documented
@Constraint(validatedBy = BookingDatesValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidBookingDates {

    String message() default "Ngày check-in phải trước ngày check-out và không thể là ngày trong quá khứ";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
