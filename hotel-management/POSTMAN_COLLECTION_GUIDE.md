# Postman Collection Guide - Hotel Management API

## 📦 Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Hotel_Management_API.postman_collection.json`
4. Collection will be imported with all requests and test scripts

## 🎯 Collection Features

### ✅ Auto-Variable Management
The collection automatically saves IDs from responses:
- `user_id` - Saved after user registration
- `service_id` - Saved after service creation
- `room_id` - Saved after room creation
- `booking_id` - Saved after booking creation
- `invoice_id` - Saved after invoice creation

### ✅ Test Scripts
Every request includes test scripts that:
- Verify HTTP status codes
- Check response structure
- Validate success fields
- Log saved IDs to console

### ✅ Dependency Order
Requests are organized in the correct testing order:
1. Authentication (User)
2. Hotel Services
3. Rooms
4. Bookings
5. Invoices

## 🚀 Quick Start

### Step 1: Start Your Application
```bash
./mvnw spring-boot:run
```

### Step 2: Run Collection in Order

Execute requests in this sequence:

#### 1. Authentication
- ✅ **Register User** - Creates admin user, saves `user_id`
- ✅ **Login** - Authenticates user

#### 2. Hotel Services
- ✅ **Create Service** - Creates breakfast service, saves `service_id`
- ✅ **Get All Services** - Lists all services
- ✅ **Get Service by ID** - Gets specific service

#### 3. Rooms
⚠️ **Note**: You need to create a RoomType first (manually in DB or create controller)
- Set `roomTypeId: 1` in the request body
- ✅ **Create Room** - Creates room 101, saves `room_id`
- ✅ **Get All Rooms** - Lists all rooms
- ✅ **Get Room by ID** - Gets specific room
- ✅ **Get Available Rooms** - Lists available rooms

#### 4. Bookings
- ✅ **Create Booking** - Uses `user_id` and `room_id`, saves `booking_id`
- ✅ **Get All Bookings** - Lists all bookings
- ✅ **Get Booking by ID** - Gets specific booking
- ✅ **Get Bookings by User** - Lists user's bookings
- ✅ **Update Booking Status** - Changes status to CHECKED_IN

#### 5. Invoices
- ✅ **Create Invoice** - Uses `booking_id`, saves `invoice_id`
- ✅ **Get All Invoices** - Lists all invoices
- ✅ **Get Invoice by ID** - Gets specific invoice
- ✅ **Get Invoice by Booking** - Gets invoice for booking
- ✅ **Get Unpaid Invoices** - Lists unpaid invoices
- ✅ **Mark Invoice as Paid** - Marks invoice as paid

## 📊 Collection Variables

View and edit variables:
1. Click on collection name
2. Go to **Variables** tab
3. See current values

### Default Variables
```
base_url = http://localhost:8080
user_id = (auto-set)
room_id = (auto-set)
service_id = (auto-set)
booking_id = (auto-set)
invoice_id = (auto-set)
```

## 🔍 Viewing Test Results

After running a request:
1. Check **Test Results** tab
2. View passed/failed tests
3. Check **Console** for logged IDs

Example console output:
```
User ID saved: 1
Service ID saved: 1
Room ID saved: 1
Booking ID saved: 1
Invoice ID saved: 1
```

## 🎨 Request Examples

### Create User Request
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

### Create Service Request
```json
{
  "name": "Room Service - Breakfast",
  "price": 150000,
  "unit": "PLATE",
  "isActive": true
}
```

### Create Room Request
```json
{
  "roomNumber": "101",
  "roomTypeId": 1,
  "status": "AVAILABLE",
  "description": "Deluxe room with city view",
  "capacity": 2,
  "imgFolder": "/images/rooms/101",
  "price": 1000000
}
```

### Create Booking Request
```json
{
  "userId": {{user_id}},
  "roomId": {{room_id}},
  "checkInAt": "2024-03-20T14:00:00",
  "checkOutAt": "2024-03-22T12:00:00",
  "roomPrice": 1000000,
  "totalPrice": 2000000,
  "status": "CONFIRMED",
  "note": "Early check-in requested"
}
```

### Create Invoice Request
```json
{
  "bookingId": {{booking_id}},
  "roomAmount": 2000000,
  "serviceAmount": 300000,
  "totalPrice": 2300000,
  "payMethod": "CREDIT_CARD",
  "status": "PENDING",
  "note": "Payment pending"
}
```

## 🔄 Running Collection with Runner

### Option 1: Manual Run
1. Click on collection name
2. Click **Run** button
3. Select requests to run
4. Click **Run Hotel Management API**

### Option 2: Run All
1. Select all requests
2. Set delay between requests (500ms recommended)
3. Click **Run**

### Expected Results
- ✅ All tests should pass
- ✅ All IDs should be saved
- ✅ Console shows saved IDs

## ⚠️ Prerequisites

### Before Testing
1. **Database**: Ensure MySQL is running
2. **Application**: Start Spring Boot app
3. **RoomType**: Create at least one RoomType record
   ```sql
   INSERT INTO room_types (name, description, create_at, update_at) 
   VALUES ('Deluxe Room', 'Spacious room with city view', NOW(), NOW());
   ```

### Enum Values Reference

**UserStatus**: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `DELETED`
**UserRole**: `ADMIN`, `STAFF`, `CUSTOMER`, `MANAGER`
**RoomStatus**: `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`, `RESERVED`, `UNAVAILABLE`
**BookingStatus**: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`, `NO_SHOW`
**ServiceUnit**: `PIECE`, `HOUR`, `DAY`, `NIGHT`, `PERSON`, `BOTTLE`, `PLATE`, `SET`
**PaymentMethod**: `CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `MOBILE_PAYMENT`, `CHEQUE`
**InvoiceStatus**: `PENDING`, `PAID`, `PARTIALLY_PAID`, `OVERDUE`, `CANCELLED`, `REFUNDED`

## 🐛 Troubleshooting

### Issue: "Room not found with id"
**Solution**: Create RoomType first, then create Room

### Issue: "User not found with id"
**Solution**: Run "Register User" request first

### Issue: "Booking not found with id"
**Solution**: Run "Create Booking" request first

### Issue: Variables not saving
**Solution**: 
1. Check test scripts are enabled
2. Verify response status is 201/200
3. Check console for errors

### Issue: Connection refused
**Solution**: 
1. Ensure Spring Boot app is running
2. Check port 8080 is not in use
3. Verify `base_url` variable

## 📝 Customization

### Change Base URL
1. Click collection name
2. Go to **Variables** tab
3. Update `base_url` value
4. Save

### Add Custom Tests
Edit request → **Tests** tab → Add JavaScript:
```javascript
pm.test("Custom test", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

### Add Pre-request Scripts
Edit request → **Pre-request Script** tab → Add JavaScript:
```javascript
console.log("Running request: " + pm.info.requestName);
```

## 🎯 Best Practices

1. **Run in Order**: Always execute requests in dependency order
2. **Check Console**: Monitor console for saved IDs
3. **Verify Tests**: Ensure all tests pass before proceeding
4. **Reset Variables**: Clear variables when starting fresh testing
5. **Save Collection**: Save after making changes

## 📚 Additional Resources

- [API Testing Guide](./API_TESTING_GUIDE.md) - Detailed API documentation
- [API Endpoints Summary](./API_ENDPOINTS_SUMMARY.md) - Quick reference
- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)

## ✅ Collection Contents

### Total Requests: 22

**Authentication (2)**
- Register User
- Login

**Hotel Services (3)**
- Create Service
- Get All Services
- Get Service by ID

**Rooms (4)**
- Create Room
- Get All Rooms
- Get Room by ID
- Get Available Rooms

**Bookings (5)**
- Create Booking
- Get All Bookings
- Get Booking by ID
- Get Bookings by User
- Update Booking Status

**Invoices (6)**
- Create Invoice
- Get All Invoices
- Get Invoice by ID
- Get Invoice by Booking
- Get Unpaid Invoices
- Mark Invoice as Paid

**Collection Variables (6)**
- base_url
- user_id
- room_id
- service_id
- booking_id
- invoice_id

---

**Ready to test!** Import the collection and start testing your Hotel Management API. 🚀
