# Hotel Management API - Complete Test Plan

## Overview
This test plan is based on actual code analysis of the Spring Boot hotel management system. It provides the exact API endpoints, request structures, and testing order for Postman automation.

---

## 1. Existing Controllers

### 1.1 AuthController
- **Base Path**: `/api/v1/auth`
- **Endpoints**:
  - `POST /api/v1/auth/register` - Register new user
  - `POST /api/v1/auth/login` - User login

### 1.2 RoomController
- **Base Path**: `/api/v1/rooms`
- **Endpoints**:
  - `POST /api/v1/rooms` - Create room
  - `GET /api/v1/rooms/{id}` - Get room by ID
  - `GET /api/v1/rooms` - Get all rooms
  - `GET /api/v1/rooms/available` - Get available rooms
  - `GET /api/v1/rooms/available/capacity/{capacity}` - Get available rooms by capacity
  - `GET /api/v1/rooms/status/{status}` - Get rooms by status
  - `GET /api/v1/rooms/type/{roomTypeId}` - Get rooms by type
  - `GET /api/v1/rooms/search?keyword={keyword}` - Search rooms
  - `PUT /api/v1/rooms/{id}` - Update room
  - `DELETE /api/v1/rooms/{id}` - Delete room

### 1.3 ServiceController
- **Base Path**: `/api/v1/services`
- **Endpoints**:
  - `POST /api/v1/services` - Create service
  - `GET /api/v1/services/{id}` - Get service by ID
  - `GET /api/v1/services` - Get all services
  - `GET /api/v1/services/active` - Get active services
  - `GET /api/v1/services/unit/{unit}` - Get services by unit
  - `GET /api/v1/services/search?keyword={keyword}` - Search services
  - `PUT /api/v1/services/{id}` - Update service
  - `DELETE /api/v1/services/{id}` - Delete service

### 1.4 BookingController
- **Base Path**: `/api/v1/bookings`
- **Endpoints**:
  - `POST /api/v1/bookings` - Create booking
  - `GET /api/v1/bookings/{id}` - Get booking by ID
  - `GET /api/v1/bookings` - Get all bookings
  - `GET /api/v1/bookings/user/{userId}` - Get bookings by user
  - `GET /api/v1/bookings/room/{roomId}` - Get bookings by room
  - `GET /api/v1/bookings/status/{status}` - Get bookings by status
  - `GET /api/v1/bookings/date-range?startDate={startDate}&endDate={endDate}` - Get bookings by date range
  - `GET /api/v1/bookings/current` - Get current bookings
  - `PUT /api/v1/bookings/{id}` - Update booking
  - `PATCH /api/v1/bookings/{id}/status/{status}` - Update booking status
  - `DELETE /api/v1/bookings/{id}` - Delete booking

### 1.5 InvoiceController
- **Base Path**: `/api/v1/invoices`
- **Endpoints**:
  - `POST /api/v1/invoices` - Create invoice
  - `GET /api/v1/invoices/{id}` - Get invoice by ID
  - `GET /api/v1/invoices` - Get all invoices
  - `GET /api/v1/invoices/booking/{bookingId}` - Get invoice by booking ID
  - `GET /api/v1/invoices/status/{status}` - Get invoices by status
  - `GET /api/v1/invoices/payment-method/{paymentMethod}` - Get invoices by payment method
  - `GET /api/v1/invoices/date-range?startDate={startDate}&endDate={endDate}` - Get invoices by date range
  - `GET /api/v1/invoices/unpaid` - Get unpaid invoices
  - `GET /api/v1/invoices/user/{userId}` - Get invoices by user
  - `PUT /api/v1/invoices/{id}` - Update invoice
  - `PATCH /api/v1/invoices/{id}/status/{status}` - Update invoice status
  - `PATCH /api/v1/invoices/{id}/mark-as-paid/{paymentMethod}` - Mark invoice as paid
  - `DELETE /api/v1/invoices/{id}` - Delete invoice

### 1.6 RoomTypeController
- **Status**: ⚠️ MISSING - No controller found for RoomType
- **Note**: RoomType entity exists but has no REST API endpoints. RoomType must be created directly in the database or a controller needs to be implemented.

---

## 2. Dependency Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DEPENDENCY HIERARCHY                     │
└─────────────────────────────────────────────────────────────┘

1. User (Auth)
   └─> Register/Login first to get userId and token

2. RoomType ⚠️ (No API - Database only)
   └─> Must exist before creating Rooms
   └─> Create manually in database or implement controller

3. Room
   └─> Requires: RoomType ID (roomTypeId)
   └─> Must exist before creating Bookings

4. HotelService (Service)
   └─> Independent - can be created anytime
   └─> Used for service charges in bookings

5. Booking
   └─> Requires: User ID (userId) + Room ID (roomId)
   └─> Must exist before creating Invoices

6. Invoice
   └─> Requires: Booking ID (bookingId)
   └─> Final step in the booking process
```

---

## 3. Test Order

Execute tests in this exact order to satisfy dependencies:

### Phase 1: Authentication & Setup
1. Register Admin User
2. Register Customer User
3. Login as Admin
4. Login as Customer

### Phase 2: RoomType Setup (Manual)
⚠️ **Manual Database Insert Required**
```sql
INSERT INTO room_types (name, description, create_at, update_at) 
VALUES ('Deluxe', 'Luxury room with ocean view', NOW(), NOW());
```

### Phase 3: Room & Service Setup
5. Create Room (requires roomTypeId from database)
6. Get All Rooms
7. Get Available Rooms
8. Create Hotel Service
9. Get All Services

### Phase 4: Booking Flow
10. Create Booking (requires userId and roomId)
11. Get Booking by ID
12. Get Bookings by User
13. Update Booking Status to CONFIRMED

### Phase 5: Invoice Flow
14. Create Invoice (requires bookingId)
15. Get Invoice by ID
16. Get Invoice by Booking ID
17. Mark Invoice as Paid

### Phase 6: Additional Queries
18. Get Rooms by Status
19. Get Bookings by Status
20. Get Unpaid Invoices
21. Search Rooms
22. Search Services

---

## 4. Detailed Endpoint Testing

### 4.1 Authentication Endpoints

#### Test 1: Register Admin User
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/auth/register`
- **Request Body**:
```json
{
  "username": "admin001",
  "password": "admin123",
  "fullName": "Admin User",
  "email": "admin@hotel.com",
  "phone": "1234567890",
  "status": "ACTIVE",
  "role": "ADMIN"
}
```
- **Expected Status**: `201 Created`
- **Success Condition**: Response contains user data with ID
- **Variables to Save**:
  - `adminUserId` from `response.data.id`

#### Test 2: Register Customer User
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/auth/register`
- **Request Body**:
```json
{
  "username": "customer001",
  "password": "customer123",
  "fullName": "John Doe",
  "email": "john.doe@email.com",
  "phone": "9876543210",
  "status": "ACTIVE",
  "role": "CUSTOMER"
}
```
- **Expected Status**: `201 Created`
- **Success Condition**: Response contains user data with ID
- **Variables to Save**:
  - `customerUserId` from `response.data.id`

#### Test 3: Login as Admin
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/auth/login`
- **Request Body**:
```json
{
  "username": "admin001",
  "password": "admin123"
}
```
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains token and user info
- **Variables to Save**:
  - `adminToken` from `response.data.token`

#### Test 4: Login as Customer
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/auth/login`
- **Request Body**:
```json
{
  "username": "customer001",
  "password": "customer123"
}
```
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains token and user info
- **Variables to Save**:
  - `customerToken` from `response.data.token`

---

### 4.2 Room Endpoints

#### Test 5: Create Room
⚠️ **Prerequisite**: RoomType must exist in database (get roomTypeId from DB)

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/rooms`
- **Request Body**:
```json
{
  "roomNumber": "101",
  "roomTypeId": 1,
  "status": "AVAILABLE",
  "description": "Deluxe room with ocean view",
  "capacity": 2,
  "imgFolder": "/images/rooms/101",
  "price": 150000
}
```
- **Expected Status**: `201 Created`
- **Success Condition**: Response contains room data with ID
- **Variables to Save**:
  - `roomId` from `response.data.id`

#### Test 6: Get All Rooms
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains array of rooms

#### Test 7: Get Room by ID
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms/{{roomId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains room details

#### Test 8: Get Available Rooms
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms/available`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains only AVAILABLE rooms

#### Test 9: Get Available Rooms by Capacity
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms/available/capacity/2`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains rooms with capacity >= 2

#### Test 10: Get Rooms by Status
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms/status/AVAILABLE`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains rooms with AVAILABLE status
- **Valid Status Values**: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`, `RESERVED`, `UNAVAILABLE`

#### Test 11: Get Rooms by Type
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms/type/1`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains rooms of specified type

#### Test 12: Search Rooms
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/rooms/search?keyword=deluxe`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains rooms matching keyword

#### Test 13: Update Room
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/v1/rooms/{{roomId}}`
- **Request Body**:
```json
{
  "roomNumber": "101",
  "roomTypeId": 1,
  "status": "AVAILABLE",
  "description": "Updated deluxe room with ocean view",
  "capacity": 2,
  "imgFolder": "/images/rooms/101",
  "price": 175000
}
```
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains updated room data

#### Test 14: Delete Room
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/v1/rooms/{{roomId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response confirms deletion
- **Note**: Only run this at the end of testing

---

### 4.3 Service Endpoints

#### Test 15: Create Hotel Service
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/services`
- **Request Body**:
```json
{
  "name": "Room Service",
  "price": 50000,
  "unit": "PIECE",
  "isActive": true
}
```
- **Expected Status**: `201 Created`
- **Success Condition**: Response contains service data with ID
- **Variables to Save**:
  - `serviceId` from `response.data.id`
- **Valid Unit Values**: `PIECE`, `HOUR`, `DAY`, `NIGHT`, `PERSON`, `BOTTLE`, `PLATE`, `SET`

#### Test 16: Get All Services
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/services`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains array of services

#### Test 17: Get Service by ID
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/services/{{serviceId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains service details

#### Test 18: Get Active Services
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/services/active`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains only active services

#### Test 19: Get Services by Unit
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/services/unit/PIECE`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains services with PIECE unit

#### Test 20: Search Services
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/services/search?keyword=room`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains services matching keyword

#### Test 21: Update Service
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/v1/services/{{serviceId}}`
- **Request Body**:
```json
{
  "name": "Room Service Premium",
  "price": 75000,
  "unit": "PIECE",
  "isActive": true
}
```
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains updated service data

#### Test 22: Delete Service
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/v1/services/{{serviceId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response confirms deletion
- **Note**: Only run this at the end of testing

---

### 4.4 Booking Endpoints

#### Test 23: Create Booking
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/bookings`
- **Request Body**:
```json
{
  "userId": {{customerUserId}},
  "roomId": {{roomId}},
  "checkInAt": "2026-03-20T14:00:00",
  "checkOutAt": "2026-03-25T12:00:00",
  "roomPrice": 150000,
  "totalPrice": 750000,
  "status": "PENDING",
  "note": "Early check-in requested"
}
```
- **Expected Status**: `201 Created`
- **Success Condition**: Response contains booking data with ID
- **Variables to Save**:
  - `bookingId` from `response.data.id`
- **Valid Status Values**: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`
- **Note**: Dates must be in the future (validation: @Future)

#### Test 24: Get Booking by ID
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings/{{bookingId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains booking details

#### Test 25: Get All Bookings
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains array of bookings

#### Test 26: Get Bookings by User
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings/user/{{customerUserId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains bookings for specified user

#### Test 27: Get Bookings by Room
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings/room/{{roomId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains bookings for specified room

#### Test 28: Get Bookings by Status
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings/status/PENDING`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains bookings with PENDING status

#### Test 29: Get Bookings by Date Range
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings/date-range?startDate=2026-03-01T00:00:00&endDate=2026-03-31T23:59:59`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains bookings within date range
- **Note**: Use ISO 8601 format for dates

#### Test 30: Get Current Bookings
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/bookings/current`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains currently active bookings

#### Test 31: Update Booking
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/v1/bookings/{{bookingId}}`
- **Request Body**:
```json
{
  "userId": {{customerUserId}},
  "roomId": {{roomId}},
  "checkInAt": "2026-03-20T14:00:00",
  "checkOutAt": "2026-03-26T12:00:00",
  "roomPrice": 150000,
  "totalPrice": 900000,
  "status": "CONFIRMED",
  "note": "Extended stay by 1 day"
}
```
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains updated booking data

#### Test 32: Update Booking Status
- **Method**: `PATCH`
- **URL**: `{{baseUrl}}/api/v1/bookings/{{bookingId}}/status/CONFIRMED`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains booking with updated status

#### Test 33: Delete Booking
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/v1/bookings/{{bookingId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response confirms deletion
- **Note**: Only run this at the end of testing

---

### 4.5 Invoice Endpoints

#### Test 34: Create Invoice
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/v1/invoices`
- **Request Body**:
```json
{
  "bookingId": {{bookingId}},
  "roomAmount": 750000,
  "serviceAmount": 100000,
  "totalPrice": 850000,
  "payMethod": "CASH",
  "status": "PENDING",
  "note": "Payment due within 24 hours"
}
```
- **Expected Status**: `201 Created`
- **Success Condition**: Response contains invoice data with ID
- **Variables to Save**:
  - `invoiceId` from `response.data.id`
- **Valid Payment Methods**: `CASH`, `BANK_TRANSFER`
- **Valid Status Values**: `PENDING`, `PAID`, `PARTIALLY_PAID`, `OVERDUE`, `CANCELLED`

#### Test 35: Get Invoice by ID
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/{{invoiceId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoice details

#### Test 36: Get All Invoices
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains array of invoices

#### Test 37: Get Invoice by Booking ID
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/booking/{{bookingId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoice for specified booking

#### Test 38: Get Invoices by Status
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/status/PENDING`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoices with PENDING status

#### Test 39: Get Invoices by Payment Method
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/payment-method/CASH`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoices with CASH payment method

#### Test 40: Get Invoices by Date Range
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/date-range?startDate=2026-03-01T00:00:00&endDate=2026-03-31T23:59:59`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoices within date range

#### Test 41: Get Unpaid Invoices
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/unpaid`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains only unpaid invoices

#### Test 42: Get Invoices by User
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/v1/invoices/user/{{customerUserId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoices for specified user

#### Test 43: Update Invoice
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/v1/invoices/{{invoiceId}}`
- **Request Body**:
```json
{
  "bookingId": {{bookingId}},
  "roomAmount": 750000,
  "serviceAmount": 150000,
  "totalPrice": 900000,
  "payMethod": "BANK_TRANSFER",
  "status": "PENDING",
  "note": "Updated service charges"
}
```
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains updated invoice data

#### Test 44: Update Invoice Status
- **Method**: `PATCH`
- **URL**: `{{baseUrl}}/api/v1/invoices/{{invoiceId}}/status/PAID`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoice with updated status

#### Test 45: Mark Invoice as Paid
- **Method**: `PATCH`
- **URL**: `{{baseUrl}}/api/v1/invoices/{{invoiceId}}/mark-as-paid/CASH`
- **Expected Status**: `200 OK`
- **Success Condition**: Response contains invoice marked as PAID with paidAt timestamp

#### Test 46: Delete Invoice
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/v1/invoices/{{invoiceId}}`
- **Expected Status**: `200 OK`
- **Success Condition**: Response confirms deletion
- **Note**: Only run this at the end of testing

---

## 5. Postman Environment Variables

Set up these variables in your Postman environment:

```json
{
  "baseUrl": "http://localhost:8080",
  "adminUserId": "",
  "customerUserId": "",
  "adminToken": "",
  "customerToken": "",
  "roomTypeId": 1,
  "roomId": "",
  "serviceId": "",
  "bookingId": "",
  "invoiceId": ""
}
```

---

## 6. Postman Test Scripts

### Auto-save Response Variables

Add this script to the "Tests" tab of each request to automatically save IDs:

```javascript
// For Register Admin
if (pm.response.code === 201 && pm.request.url.toString().includes('/auth/register')) {
    const response = pm.response.json();
    if (response.data && response.data.id && pm.request.body.raw.includes('admin')) {
        pm.environment.set('adminUserId', response.data.id);
    } else if (response.data && response.data.id) {
        pm.environment.set('customerUserId', response.data.id);
    }
}

// For Login
if (pm.response.code === 200 && pm.request.url.toString().includes('/auth/login')) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        if (pm.request.body.raw.includes('admin')) {
            pm.environment.set('adminToken', response.data.token);
        } else {
            pm.environment.set('customerToken', response.data.token);
        }
    }
}

// For Create Room
if (pm.response.code === 201 && pm.request.url.toString().includes('/rooms')) {
    const response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set('roomId', response.data.id);
    }
}

// For Create Service
if (pm.response.code === 201 && pm.request.url.toString().includes('/services')) {
    const response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set('serviceId', response.data.id);
    }
}

// For Create Booking
if (pm.response.code === 201 && pm.request.url.toString().includes('/bookings')) {
    const response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set('bookingId', response.data.id);
    }
}

// For Create Invoice
if (pm.response.code === 201 && pm.request.url.toString().includes('/invoices')) {
    const response = pm.response.json();
    if (response.data && response.data.id) {
        pm.environment.set('invoiceId', response.data.id);
    }
}

// Generic success test
pm.test("Status code is successful", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test("Response has success field", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('success');
});
```

---

## 7. Known Issues & Workarounds

### Issue 1: Missing RoomType Controller
- **Problem**: No REST API to create RoomType
- **Workaround**: Insert RoomType directly into database:
```sql
INSERT INTO room_types (name, description, create_at, update_at) 
VALUES 
  ('Standard', 'Standard room with basic amenities', NOW(), NOW()),
  ('Deluxe', 'Deluxe room with premium amenities', NOW(), NOW()),
  ('Suite', 'Luxury suite with separate living area', NOW(), NOW());
```

### Issue 2: Future Date Validation
- **Problem**: Booking dates must be in the future (@Future validation)
- **Workaround**: Always use dates ahead of current date (e.g., 2026-03-20)

### Issue 3: JWT Token Placeholder
- **Problem**: Login returns "jwt-token-placeholder" (not implemented)
- **Impact**: Token-based authentication not functional yet
- **Workaround**: Tests can proceed without real JWT validation

---

## 8. Response Structure

All endpoints follow this standard response format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## 9. Validation Rules Summary

### User
- Username: 3-100 characters, unique
- Password: min 6 characters
- Email: valid email format, unique
- Phone: max 20 characters

### Room
- Room Number: max 50 characters, unique
- Capacity: min 1
- Price: min 0

### Service
- Name: 2-100 characters, unique
- Price: min 0

### Booking
- Check-in/Check-out: must be future dates
- Room Price: min 0
- Total Price: min 0

### Invoice
- All amounts: min 0
- Booking: must exist and be unique (one invoice per booking)

---

## 10. Testing Checklist

- [ ] Phase 1: Authentication (Tests 1-4)
- [ ] Phase 2: Manual RoomType creation in database
- [ ] Phase 3: Room & Service setup (Tests 5-22)
- [ ] Phase 4: Booking flow (Tests 23-33)
- [ ] Phase 5: Invoice flow (Tests 34-46)
- [ ] Verify all environment variables are saved
- [ ] Test error scenarios (duplicate entries, not found, etc.)
- [ ] Test query endpoints with different filters
- [ ] Test update operations
- [ ] Test delete operations (last)

---

## End of Test Plan

**Generated**: Based on actual code analysis of Spring Boot Hotel Management System
**Controllers Analyzed**: AuthController, RoomController, ServiceController, BookingController, InvoiceController
**Total Endpoints**: 46 test cases covering all available REST APIs
