# Hotel Management System - API Endpoints Summary

## Available Controllers

### 1. AuthController (`/api/v1/auth`)
- ✅ POST `/register` - Register new user
- ✅ POST `/login` - User login

### 2. RoomController (`/api/v1/rooms`)
- ✅ POST `/` - Create room
- ✅ GET `/` - Get all rooms
- ✅ GET `/{id}` - Get room by ID
- ✅ GET `/available` - Get available rooms
- ✅ GET `/available/capacity/{capacity}` - Get available rooms by capacity
- ✅ GET `/status/{status}` - Get rooms by status
- ✅ GET `/type/{roomTypeId}` - Get rooms by type
- ✅ GET `/search?keyword={keyword}` - Search rooms
- ✅ PUT `/{id}` - Update room
- ✅ DELETE `/{id}` - Delete room

### 3. BookingController (`/api/v1/bookings`)
- ✅ POST `/` - Create booking
- ✅ GET `/` - Get all bookings
- ✅ GET `/{id}` - Get booking by ID
- ✅ GET `/user/{userId}` - Get bookings by user
- ✅ GET `/room/{roomId}` - Get bookings by room
- ✅ GET `/status/{status}` - Get bookings by status
- ✅ GET `/date-range?startDate={start}&endDate={end}` - Get bookings by date range
- ✅ GET `/current` - Get current bookings
- ✅ PUT `/{id}` - Update booking
- ✅ PATCH `/{id}/status/{status}` - Update booking status
- ✅ DELETE `/{id}` - Delete booking

### 4. ServiceController (`/api/v1/services`)
- ✅ POST `/` - Create service
- ✅ GET `/` - Get all services
- ✅ GET `/{id}` - Get service by ID
- ✅ GET `/active` - Get active services
- ✅ GET `/unit/{unit}` - Get services by unit
- ✅ GET `/search?keyword={keyword}` - Search services
- ✅ PUT `/{id}` - Update service
- ✅ DELETE `/{id}` - Delete service

### 5. InvoiceController (`/api/v1/invoices`)
- ✅ POST `/` - Create invoice
- ✅ GET `/` - Get all invoices
- ✅ GET `/{id}` - Get invoice by ID
- ✅ GET `/booking/{bookingId}` - Get invoice by booking
- ✅ GET `/status/{status}` - Get invoices by status
- ✅ GET `/payment-method/{paymentMethod}` - Get invoices by payment method
- ✅ GET `/date-range?startDate={start}&endDate={end}` - Get invoices by date range
- ✅ GET `/unpaid` - Get unpaid invoices
- ✅ GET `/user/{userId}` - Get invoices by user
- ✅ PUT `/{id}` - Update invoice
- ✅ PATCH `/{id}/status/{status}` - Update invoice status
- ✅ PATCH `/{id}/mark-as-paid/{paymentMethod}` - Mark invoice as paid
- ✅ DELETE `/{id}` - Delete invoice

## Missing Controllers

### ❌ RoomTypeController (Not Implemented)
**Recommended Endpoints:**
- POST `/api/v1/room-types` - Create room type
- GET `/api/v1/room-types` - Get all room types
- GET `/api/v1/room-types/{id}` - Get room type by ID
- PUT `/api/v1/room-types/{id}` - Update room type
- DELETE `/api/v1/room-types/{id}` - Delete room type

### ❌ ServiceUsageController (Not Implemented)
**Recommended Endpoints:**
- POST `/api/v1/service-usage` - Create service usage
- GET `/api/v1/service-usage` - Get all service usages
- GET `/api/v1/service-usage/{id}` - Get service usage by ID
- GET `/api/v1/service-usage/booking/{bookingId}` - Get service usages by booking
- GET `/api/v1/service-usage/service/{serviceId}` - Get service usages by service
- PUT `/api/v1/service-usage/{id}` - Update service usage
- DELETE `/api/v1/service-usage/{id}` - Delete service usage

## Total Endpoints

- **Implemented**: 47 endpoints across 5 controllers
- **Missing**: 12 endpoints across 2 controllers
- **Total Expected**: 59 endpoints

## Entity Dependency Graph

```
User (Independent)
  └─> Booking
       ├─> ServiceUsage
       └─> Invoice

RoomType (Independent)
  └─> Room
       └─> Booking
            ├─> ServiceUsage
            └─> Invoice

HotelService (Independent)
  └─> ServiceUsage
```

## Testing Priority

### Phase 1: Independent Entities
1. User (AuthController)
2. RoomType (⚠️ Missing Controller)
3. HotelService (ServiceController)

### Phase 2: Dependent Entities
4. Room (RoomController) - Requires RoomType
5. Booking (BookingController) - Requires User + Room

### Phase 3: Final Entities
6. ServiceUsage (⚠️ Missing Controller) - Requires Booking + HotelService
7. Invoice (InvoiceController) - Requires Booking

## Enum Values Reference

### UserStatus
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`
- `DELETED`

### UserRole
- `ADMIN`
- `STAFF`
- `CUSTOMER`
- `MANAGER`

### RoomStatus
- `AVAILABLE`
- `OCCUPIED`
- `MAINTENANCE`
- `RESERVED`
- `UNAVAILABLE`

### BookingStatus
- `PENDING`
- `CONFIRMED`
- `CHECKED_IN`
- `CHECKED_OUT`
- `CANCELLED`
- `NO_SHOW`

### ServiceUnit
- `PIECE`
- `HOUR`
- `DAY`
- `NIGHT`
- `PERSON`
- `BOTTLE`
- `PLATE`
- `SET`

### PaymentMethod
- `CASH`
- `CREDIT_CARD`
- `DEBIT_CARD`
- `BANK_TRANSFER`
- `MOBILE_PAYMENT`
- `CHEQUE`

### InvoiceStatus
- `PENDING`
- `PAID`
- `PARTIALLY_PAID`
- `OVERDUE`
- `CANCELLED`
- `REFUNDED`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-03-14T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2024-03-14T10:30:00"
}
```

### Validation Error Response
```json
{
  "timestamp": "2024-03-14T10:30:00",
  "status": 400,
  "error": "Validation Error",
  "message": "field1: error1, field2: error2",
  "path": "/api/v1/endpoint",
  "fieldErrors": {
    "field1": "error1",
    "field2": "error2"
  }
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error or business logic error
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
