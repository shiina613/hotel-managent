# Hotel Management System - API Testing Guide

## Base URL
```
http://localhost:8080
```

## ⚠️ Important Notes

**Missing Controllers:**
- `RoomTypeController` - Not implemented yet
- `ServiceUsageController` - Not implemented yet

These controllers need to be created before full system testing. For now, you'll need to:
1. Create RoomType records directly in the database OR create the controller
2. Create ServiceUsage records directly in the database OR create the controller

## Testing Order

Based on entity relationships, test APIs in this order:

1. **User** (Independent entity)
2. **RoomType** (Independent entity)  
3. **HotelService** (Independent entity)
4. **Room** (Depends on RoomType)
5. **Booking** (Depends on User and Room)
6. **ServiceUsage** (Depends on Booking and HotelService)
7. **Invoice** (Depends on Booking)

---

## 1. Authentication APIs

### 1.1 Register User
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "fullName": "Admin User",
  "email": "admin@hotel.com",
  "phone": "0123456789",
  "status": "ACTIVE",
  "role": "ADMIN"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "admin",
    "fullName": "Admin User",
    "email": "admin@hotel.com",
    "phone": "0123456789",
    "status": "ACTIVE",
    "role": "ADMIN",
    "createAt": "2024-03-14T10:30:00",
    "updateAt": "2024-03-14T10:30:00"
  },
  "timestamp": "2024-03-14T10:30:00"
}
```

**Enum Values:**
- **UserStatus**: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `DELETED`
- **UserRole**: `ADMIN`, `STAFF`, `CUSTOMER`, `MANAGER`

---

### 1.2 Login
**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "username": "admin",
    "fullName": "Admin User",
    "email": "admin@hotel.com",
    "role": "ADMIN",
    "token": "jwt-token-placeholder"
  },
  "timestamp": "2024-03-14T10:31:00"
}
```

---

## 2. Room Type APIs

**Note:** Create RoomType BEFORE creating Rooms

### 2.1 Create Room Type
**POST** `/api/v1/room-types`

**Request Body:**
```json
{
  "name": "Deluxe Room",
  "description": "Spacious room with city view"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Room type created successfully",
  "data": {
    "id": 1,
    "name": "Deluxe Room",
    "description": "Spacious room with city view",
    "createAt": "2024-03-14T10:32:00",
    "updateAt": "2024-03-14T10:32:00"
  },
  "timestamp": "2024-03-14T10:32:00"
}
```

---

## 3. Hotel Service APIs

**Note:** Create HotelService BEFORE creating ServiceUsage

### 3.1 Create Service
**POST** `/api/v1/services`

**Request Body:**
```json
{
  "name": "Room Service - Breakfast",
  "price": 150000,
  "unit": "PLATE",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "id": 1,
    "name": "Room Service - Breakfast",
    "price": 150000,
    "unit": "PLATE",
    "isActive": true,
    "createAt": "2024-03-14T10:33:00",
    "updateAt": "2024-03-14T10:33:00"
  },
  "timestamp": "2024-03-14T10:33:00"
}
```

**Enum Values:**
- **ServiceUnit**: `PIECE`, `HOUR`, `DAY`, `NIGHT`, `PERSON`, `BOTTLE`, `PLATE`, `SET`

---

### 3.2 Get All Services
**GET** `/api/v1/services`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Room Service - Breakfast",
      "price": 150000,
      "unit": "PLATE",
      "isActive": true,
      "createAt": "2024-03-14T10:33:00",
      "updateAt": "2024-03-14T10:33:00"
    }
  ],
  "timestamp": "2024-03-14T10:34:00"
}
```

---

### 3.3 Get Service by ID
**GET** `/api/v1/services/{id}`

Example: `/api/v1/services/1`

---

### 3.4 Get Active Services
**GET** `/api/v1/services/active`

---

### 3.5 Get Services by Unit
**GET** `/api/v1/services/unit/{unit}`

Example: `/api/v1/services/unit/PLATE`

---

### 3.6 Search Services
**GET** `/api/v1/services/search?keyword=breakfast`

---

### 3.7 Update Service
**PUT** `/api/v1/services/{id}`

**Request Body:**
```json
{
  "name": "Room Service - Breakfast (Updated)",
  "price": 180000,
  "unit": "PLATE",
  "isActive": true
}
```

---

### 3.8 Delete Service
**DELETE** `/api/v1/services/{id}`

---

## 4. Room APIs

**Note:** Create RoomType FIRST, then create Rooms

### 4.1 Create Room
**POST** `/api/v1/rooms`

**Request Body:**
```json
{
  "roomNumber": "101",
  "roomTypeId": 1,
  "status": "AVAILABLE",
  "description": "First floor deluxe room",
  "capacity": 2,
  "imgFolder": "/images/rooms/101",
  "price": 1000000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": 1,
    "roomNumber": "101",
    "roomTypeId": 1,
    "roomTypeName": "Deluxe Room",
    "status": "AVAILABLE",
    "description": "First floor deluxe room",
    "capacity": 2,
    "imgFolder": "/images/rooms/101",
    "price": 1000000,
    "createAt": "2024-03-14T10:35:00",
    "updateAt": "2024-03-14T10:35:00"
  },
  "timestamp": "2024-03-14T10:35:00"
}
```

**Enum Values:**
- **RoomStatus**: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`, `RESERVED`, `UNAVAILABLE`

---

### 4.2 Get All Rooms
**GET** `/api/v1/rooms`

---

### 4.3 Get Room by ID
**GET** `/api/v1/rooms/{id}`

Example: `/api/v1/rooms/1`

---

### 4.4 Get Available Rooms
**GET** `/api/v1/rooms/available`

---

### 4.5 Get Available Rooms by Capacity
**GET** `/api/v1/rooms/available/capacity/{capacity}`

Example: `/api/v1/rooms/available/capacity/2`

---

### 4.6 Get Rooms by Status
**GET** `/api/v1/rooms/status/{status}`

Example: `/api/v1/rooms/status/AVAILABLE`

---

### 4.7 Get Rooms by Type
**GET** `/api/v1/rooms/type/{roomTypeId}`

Example: `/api/v1/rooms/type/1`

---

### 4.8 Search Rooms
**GET** `/api/v1/rooms/search?keyword=101`

---

### 4.9 Update Room
**PUT** `/api/v1/rooms/{id}`

**Request Body:**
```json
{
  "roomNumber": "101",
  "roomTypeId": 1,
  "status": "OCCUPIED",
  "description": "First floor deluxe room - Updated",
  "capacity": 2,
  "imgFolder": "/images/rooms/101",
  "price": 1200000
}
```

---

### 4.10 Delete Room
**DELETE** `/api/v1/rooms/{id}`

---

## 5. Booking APIs

**Note:** Create User and Room FIRST, then create Bookings

### 5.1 Create Booking
**POST** `/api/v1/bookings`

**Request Body:**
```json
{
  "userId": 1,
  "roomId": 1,
  "checkInAt": "2024-03-20T14:00:00",
  "checkOutAt": "2024-03-22T12:00:00",
  "roomPrice": 1000000,
  "totalPrice": 2000000,
  "status": "CONFIRMED",
  "note": "Early check-in requested"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "userName": "Admin User",
    "roomId": 1,
    "roomNumber": "101",
    "createAt": "2024-03-14T10:36:00",
    "checkInAt": "2024-03-20T14:00:00",
    "checkOutAt": "2024-03-22T12:00:00",
    "roomPrice": 1000000,
    "totalPrice": 2000000,
    "status": "CONFIRMED",
    "note": "Early check-in requested",
    "updateAt": "2024-03-14T10:36:00"
  },
  "timestamp": "2024-03-14T10:36:00"
}
```

**Enum Values:**
- **BookingStatus**: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`, `NO_SHOW`

---

### 5.2 Get All Bookings
**GET** `/api/v1/bookings`

---

### 5.3 Get Booking by ID
**GET** `/api/v1/bookings/{id}`

Example: `/api/v1/bookings/1`

---

### 5.4 Get Bookings by User
**GET** `/api/v1/bookings/user/{userId}`

Example: `/api/v1/bookings/user/1`

---

### 5.5 Get Bookings by Room
**GET** `/api/v1/bookings/room/{roomId}`

Example: `/api/v1/bookings/room/1`

---

### 5.6 Get Bookings by Status
**GET** `/api/v1/bookings/status/{status}`

Example: `/api/v1/bookings/status/CONFIRMED`

---

### 5.7 Get Bookings by Date Range
**GET** `/api/v1/bookings/date-range?startDate=2024-03-20T00:00:00&endDate=2024-03-25T23:59:59`

---

### 5.8 Get Current Bookings
**GET** `/api/v1/bookings/current`

---

### 5.9 Update Booking
**PUT** `/api/v1/bookings/{id}`

**Request Body:**
```json
{
  "userId": 1,
  "roomId": 1,
  "checkInAt": "2024-03-20T14:00:00",
  "checkOutAt": "2024-03-23T12:00:00",
  "roomPrice": 1000000,
  "totalPrice": 3000000,
  "status": "CONFIRMED",
  "note": "Extended stay"
}
```

---

### 5.10 Update Booking Status
**PATCH** `/api/v1/bookings/{id}/status/{status}`

Example: `/api/v1/bookings/1/status/CHECKED_IN`

---

### 5.11 Delete Booking
**DELETE** `/api/v1/bookings/{id}`

---

## 6. Invoice APIs

**Note:** Create Booking FIRST, then create Invoice

### 6.1 Create Invoice
**POST** `/api/v1/invoices`

**Request Body:**
```json
{
  "bookingId": 1,
  "roomAmount": 2000000,
  "serviceAmount": 300000,
  "totalPrice": 2300000,
  "payMethod": "CREDIT_CARD",
  "status": "PENDING",
  "note": "Payment pending"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": 1,
    "bookingId": 1,
    "createAt": "2024-03-14T10:37:00",
    "roomAmount": 2000000,
    "serviceAmount": 300000,
    "totalPrice": 2300000,
    "payMethod": "CREDIT_CARD",
    "status": "PENDING",
    "paidAt": null,
    "note": "Payment pending",
    "updateAt": "2024-03-14T10:37:00"
  },
  "timestamp": "2024-03-14T10:37:00"
}
```

**Enum Values:**
- **PaymentMethod**: `CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `MOBILE_PAYMENT`, `CHEQUE`
- **InvoiceStatus**: `PENDING`, `PAID`, `PARTIALLY_PAID`, `OVERDUE`, `CANCELLED`, `REFUNDED`

---

### 6.2 Get All Invoices
**GET** `/api/v1/invoices`

---

### 6.3 Get Invoice by ID
**GET** `/api/v1/invoices/{id}`

Example: `/api/v1/invoices/1`

---

### 6.4 Get Invoice by Booking ID
**GET** `/api/v1/invoices/booking/{bookingId}`

Example: `/api/v1/invoices/booking/1`

---

### 6.5 Get Invoices by Status
**GET** `/api/v1/invoices/status/{status}`

Example: `/api/v1/invoices/status/PENDING`

---

### 6.6 Get Invoices by Payment Method
**GET** `/api/v1/invoices/payment-method/{paymentMethod}`

Example: `/api/v1/invoices/payment-method/CREDIT_CARD`

---

### 6.7 Get Invoices by Date Range
**GET** `/api/v1/invoices/date-range?startDate=2024-03-01T00:00:00&endDate=2024-03-31T23:59:59`

---

### 6.8 Get Unpaid Invoices
**GET** `/api/v1/invoices/unpaid`

---

### 6.9 Get Invoices by User ID
**GET** `/api/v1/invoices/user/{userId}`

Example: `/api/v1/invoices/user/1`

---

### 6.10 Update Invoice
**PUT** `/api/v1/invoices/{id}`

**Request Body:**
```json
{
  "bookingId": 1,
  "roomAmount": 2000000,
  "serviceAmount": 350000,
  "totalPrice": 2350000,
  "payMethod": "CREDIT_CARD",
  "status": "PAID",
  "note": "Payment completed"
}
```

---

### 6.11 Update Invoice Status
**PATCH** `/api/v1/invoices/{id}/status/{status}`

Example: `/api/v1/invoices/1/status/PAID`

---

### 6.12 Mark Invoice as Paid
**PATCH** `/api/v1/invoices/{id}/mark-as-paid/{paymentMethod}`

Example: `/api/v1/invoices/1/mark-as-paid/CREDIT_CARD`

---

### 6.13 Delete Invoice
**DELETE** `/api/v1/invoices/{id}`

---

## Testing Workflow Example

### Complete Flow Test

1. **Register a User**
   ```
   POST /api/v1/auth/register
   ```

2. **Create a Room Type**
   ```
   POST /api/v1/room-types
   ```

3. **Create a Hotel Service**
   ```
   POST /api/v1/services
   ```

4. **Create a Room** (using roomTypeId from step 2)
   ```
   POST /api/v1/rooms
   ```

5. **Create a Booking** (using userId from step 1 and roomId from step 4)
   ```
   POST /api/v1/bookings
   ```

6. **Create Service Usage** (using bookingId from step 5 and serviceId from step 3)
   ```
   POST /api/v1/service-usage
   ```

7. **Create an Invoice** (using bookingId from step 5)
   ```
   POST /api/v1/invoices
   ```

8. **Mark Invoice as Paid**
   ```
   PATCH /api/v1/invoices/{id}/mark-as-paid/CREDIT_CARD
   ```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "timestamp": "2024-03-14T10:40:00"
}
```

### Validation Error Response

```json
{
  "timestamp": "2024-03-14T10:40:00",
  "status": 400,
  "error": "Validation Error",
  "message": "username: must not be blank, email: must not be blank",
  "path": "/api/v1/auth/register",
  "fieldErrors": {
    "username": "must not be blank",
    "email": "must not be blank"
  }
}
```

---

## Postman Collection Setup

### Environment Variables

Create a Postman environment with these variables:

```
base_url = http://localhost:8080
user_id = (set after creating user)
room_type_id = (set after creating room type)
room_id = (set after creating room)
booking_id = (set after creating booking)
service_id = (set after creating service)
invoice_id = (set after creating invoice)
```

### Auto-set Variables

Add this to the **Tests** tab of POST requests:

```javascript
// For Create User
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("user_id", jsonData.data.id);
}

// For Create Room Type
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("room_type_id", jsonData.data.id);
}

// For Create Room
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("room_id", jsonData.data.id);
}

// For Create Booking
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("booking_id", jsonData.data.id);
}

// For Create Service
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("service_id", jsonData.data.id);
}

// For Create Invoice
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("invoice_id", jsonData.data.id);
}
```

---

## Notes

- All timestamps use ISO 8601 format: `yyyy-MM-dd'T'HH:mm:ss`
- All prices are in VND (Vietnamese Dong)
- IDs are auto-generated integers
- Foreign key relationships must be respected (create parent entities first)
- Validation errors return HTTP 400 with detailed field errors
- Not found errors return HTTP 404
- Server errors return HTTP 500

---

## Quick Reference - Testing Order

```
1. User (Independent)
2. RoomType (Independent)
3. HotelService (Independent)
4. Room (Requires: RoomType)
5. Booking (Requires: User, Room)
6. ServiceUsage (Requires: Booking, HotelService)
7. Invoice (Requires: Booking)
```
