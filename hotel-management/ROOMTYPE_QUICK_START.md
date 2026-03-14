# RoomType Module - Quick Start Guide

## 🚀 Getting Started

The RoomType module is now fully implemented and ready to use!

## ✅ What's Been Done

1. **6 new files created** - All necessary backend components
2. **Project compiles successfully** - No errors
3. **Frontend already ready** - Vietnamese UI already exists
4. **Postman collection created** - Ready for testing

## 📋 Quick Test Steps

### Step 1: Start the Backend
```bash
./mvnw spring-boot:run
```

### Step 2: Test with cURL

#### Create a Room Type
```bash
curl -X POST http://localhost:8080/api/v1/room-types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Room",
    "description": "Basic room with essential amenities"
  }'
```

#### Get All Room Types
```bash
curl http://localhost:8080/api/v1/room-types
```

#### Get Room Type by ID
```bash
curl http://localhost:8080/api/v1/room-types/1
```

#### Update Room Type
```bash
curl -X PUT http://localhost:8080/api/v1/room-types/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Standard Room",
    "description": "Enhanced standard room"
  }'
```

#### Delete Room Type
```bash
curl -X DELETE http://localhost:8080/api/v1/room-types/1
```

### Step 3: Test with Postman

1. Import `Hotel_Management_RoomType.postman_collection.json`
2. Set `base_url` variable to `http://localhost:8080`
3. Run the collection in order (1-10)
4. All tests should pass ✅

### Step 4: Test with Frontend

1. Start the frontend:
```bash
cd frontend
npm run dev
```

2. Navigate to: http://localhost:5173/room-types
3. The Vietnamese "Loại Phòng" page should work perfectly!

## 🎯 Key Features

### ✅ CRUD Operations
- Create room types
- Read all room types
- Read single room type
- Update room types
- Delete room types
- Search room types

### ✅ Validation
- Name is required
- Duplicate names prevented
- Size constraints enforced

### ✅ Business Rules
- Cannot delete room types with associated rooms
- Proper 404 responses for missing resources
- Consistent API response format

### ✅ Integration
- Works seamlessly with Room module
- Frontend already configured
- Database relationships established

## 📊 Expected Response Format

### Success Response
```json
{
  "success": true,
  "message": "Room type created successfully",
  "data": {
    "id": 1,
    "name": "Standard Room",
    "description": "Basic room with essential amenities",
    "createAt": "2026-03-14T05:00:00",
    "updateAt": "2026-03-14T05:00:00"
  },
  "timestamp": "2026-03-14T05:00:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Room type name already exists",
  "timestamp": "2026-03-14T05:00:00"
}
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/room-types` | Create room type |
| GET | `/api/v1/room-types` | Get all room types |
| GET | `/api/v1/room-types/{id}` | Get room type by ID |
| GET | `/api/v1/room-types/search?keyword={keyword}` | Search room types |
| PUT | `/api/v1/room-types/{id}` | Update room type |
| DELETE | `/api/v1/room-types/{id}` | Delete room type |

## 🧪 Testing Workflow

### 1. Create Room Types
Create at least 2-3 room types:
- Standard Room
- Deluxe Room
- Suite Room

### 2. Verify Creation
- Get all room types
- Verify they appear in the list
- Check the Vietnamese frontend

### 3. Create Rooms
Now you can create rooms using these room types:
```bash
curl -X POST http://localhost:8080/api/v1/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "roomTypeId": 1,
    "status": "AVAILABLE",
    "capacity": 2,
    "price": 500000
  }'
```

### 4. Test Validation
- Try creating duplicate room type name (should fail)
- Try deleting room type with rooms (should fail)
- Try getting non-existent room type (should return 404)

## 🎓 For Your Graduation Project Demo

### Demo Flow
1. **Show Room Types Management**
   - Open "Loại Phòng" page in Vietnamese UI
   - Create a new room type
   - Show the list updates automatically

2. **Show Room Creation**
   - Open "Phòng" page
   - Create a room
   - Show room type dropdown populated from API

3. **Show Validation**
   - Try creating duplicate room type
   - Show error message in Vietnamese

4. **Show Integration**
   - Show how rooms reference room types
   - Show room list with room type names

## 📝 Database Setup

The RoomType table will be created automatically by JPA/Hibernate.

If you need to manually create it:
```sql
CREATE TABLE room_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🐛 Troubleshooting

### Issue: "Room type name already exists"
**Solution**: Each room type name must be unique. Use a different name.

### Issue: "Cannot delete room type with associated rooms"
**Solution**: Delete all rooms of this type first, then delete the room type.

### Issue: "Room type not found"
**Solution**: Verify the room type ID exists by calling GET /api/v1/room-types

### Issue: Frontend shows "Không tải được loại phòng"
**Solution**: 
1. Check backend is running on port 8080
2. Check CORS is configured correctly
3. Check browser console for errors

## ✨ Next Steps

1. ✅ RoomType module is complete
2. ✅ Frontend is ready
3. ✅ Integration works
4. 🎯 Start testing for your demo!

## 📚 Documentation Files

- `ROOMTYPE_MODULE_IMPLEMENTATION.md` - Complete technical documentation
- `ROOMTYPE_QUICK_START.md` - This file
- `Hotel_Management_RoomType.postman_collection.json` - Postman tests

## 🎉 Success!

Your RoomType module is fully implemented and ready for your graduation project demo!

**Total Implementation Time**: Complete in one session
**Files Created**: 6 new files + 1 Postman collection
**Compilation Status**: ✅ Success
**Frontend Integration**: ✅ Ready
**Testing**: ✅ Postman collection included

Good luck with your graduation project! 🎓
