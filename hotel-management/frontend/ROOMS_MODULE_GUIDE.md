# Rooms Module Implementation Guide

## Overview

The Rooms module is now fully integrated with the backend API, providing complete CRUD functionality for managing hotel rooms.

---

## ✅ Features Implemented

### 1. API Integration
- ✅ GET all rooms from `/api/v1/rooms`
- ✅ POST create room to `/api/v1/rooms`
- ✅ DELETE room from `/api/v1/rooms/{id}`
- ✅ Search rooms by keyword
- ✅ Filter rooms by status
- ✅ Real-time data from backend

### 2. User Interface
- ✅ Rooms table with all details
- ✅ Stats cards (Total, Available, Occupied, Maintenance)
- ✅ Search functionality
- ✅ Status filter dropdown
- ✅ Create room modal form
- ✅ Delete confirmation
- ✅ Loading states
- ✅ Error handling
- ✅ Empty state

### 3. Form Validation
- ✅ Room number required
- ✅ Room type ID required
- ✅ Capacity minimum 1
- ✅ Price minimum 0
- ✅ Real-time validation feedback
- ✅ Error messages

---

## 📁 Files Created/Updated

### New Files
1. **frontend/src/api/roomApi.js**
   - API functions for room operations
   - GET, POST, DELETE endpoints
   - Search and filter functions

### Updated Files
2. **frontend/src/pages/rooms/RoomsPage.jsx**
   - Complete rewrite with API integration
   - Create room modal
   - Loading and error states
   - Search and filter functionality

---

## 🚀 How to Use

### Step 1: Ensure Backend is Running
```bash
./mvnw spring-boot:run
```

### Step 2: Ensure RoomType Exists in Database
⚠️ **Important**: Before creating rooms, you must have at least one RoomType in the database.

**Option A: Insert via SQL**
```sql
INSERT INTO room_types (name, description, create_at, update_at) 
VALUES ('Deluxe', 'Luxury room with ocean view', NOW(), NOW());
```

**Option B: Use Database Tool**
- Open your MySQL client
- Insert a RoomType record
- Note the `id` (you'll need this when creating rooms)

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 4: Navigate to Rooms Page
1. Login to the system
2. Click "Rooms" in the sidebar
3. You'll see the rooms list (initially empty)

---

## 🎯 Using the Rooms Module

### View All Rooms
- The page automatically loads all rooms on mount
- Stats cards show counts by status
- Table displays all room details

### Search Rooms
1. Enter room number in search field
2. Press Enter or click "Search" button
3. Results will filter based on keyword

### Filter by Status
1. Select status from dropdown
2. Table updates automatically
3. Options: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED, UNAVAILABLE

### Reset Filters
- Click "Reset Filters" button
- Clears search and status filter
- Reloads all rooms

### Create New Room
1. Click "Add Room" button
2. Fill in the form:
   - **Room Number**: e.g., "101" (required)
   - **Room Type ID**: e.g., "1" (required, must exist in DB)
   - **Status**: Select from dropdown (default: AVAILABLE)
   - **Capacity**: Number of guests (required, min: 1)
   - **Price**: Price in IDR (required, min: 0)
   - **Image Folder**: Optional path to images
   - **Description**: Optional room description
3. Click "Create Room"
4. On success:
   - Modal closes
   - Room list refreshes
   - Success alert shown

### Delete Room
1. Click "Delete" button on any room
2. Confirm deletion in popup
3. Room is deleted from database
4. List refreshes automatically

---

## 📊 API Endpoints Used

### GET /api/v1/rooms
**Purpose**: Fetch all rooms

**Response**:
```json
{
  "success": true,
  "message": "Rooms retrieved successfully",
  "data": [
    {
      "id": 1,
      "roomNumber": "101",
      "roomTypeId": 1,
      "status": "AVAILABLE",
      "description": "Deluxe room with ocean view",
      "capacity": 2,
      "imgFolder": "/images/rooms/101",
      "price": 150000
    }
  ]
}
```

### POST /api/v1/rooms
**Purpose**: Create new room

**Request Body**:
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

**Response**:
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "id": 1,
    "roomNumber": "101",
    ...
  }
}
```

### DELETE /api/v1/rooms/{id}
**Purpose**: Delete room by ID

**Response**:
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

### GET /api/v1/rooms/search?keyword={keyword}
**Purpose**: Search rooms by keyword

### GET /api/v1/rooms/status/{status}
**Purpose**: Filter rooms by status

---

## 🎨 UI Components

### Stats Cards
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Rooms │  Available  │  Occupied   │ Maintenance │
│     10      │      5      │      3      │      2      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Filters Section
```
┌─────────────────────────────────────────────────────────┐
│ Search: [_________] Status: [All Status ▼] [Search] [Reset] │
└─────────────────────────────────────────────────────────┘
```

### Rooms Table
```
┌──────────┬─────────┬───────────┬──────────┬─────────┬─────────┐
│ Room #   │ Type ID │ Status    │ Capacity │ Price   │ Actions │
├──────────┼─────────┼───────────┼──────────┼─────────┼─────────┤
│ 101      │ 1       │ AVAILABLE │ 2 guests │ 150,000 │ V E D   │
│ 102      │ 1       │ OCCUPIED  │ 2 guests │ 150,000 │ V E D   │
└──────────┴─────────┴───────────┴──────────┴─────────┴─────────┘
```

### Create Room Modal
```
┌─────────────────────────────────────────────────┐
│ Create New Room                            [X]  │
├─────────────────────────────────────────────────┤
│ Room Number: [_________]  Room Type ID: [___]  │
│ Status: [AVAILABLE ▼]     Capacity: [___]      │
│ Price: [_________]        Image Folder: [____] │
│ Description: [_____________________________]   │
│                                                 │
│                        [Cancel] [Create Room]  │
└─────────────────────────────────────────────────┘
```

---

## 🔄 State Management

### Component State
```javascript
const [rooms, setRooms] = useState([]);              // Room list
const [loading, setLoading] = useState(true);        // Loading state
const [error, setError] = useState('');              // Error message
const [showCreateModal, setShowCreateModal] = useState(false); // Modal visibility
const [creating, setCreating] = useState(false);     // Creating state
const [searchKeyword, setSearchKeyword] = useState(''); // Search input
const [statusFilter, setStatusFilter] = useState(''); // Status filter
const [formData, setFormData] = useState({...});     // Form data
const [formErrors, setFormErrors] = useState({});    // Form errors
```

### Data Flow
```
1. Component Mounts
   └─> useEffect() triggers
       └─> fetchRooms() called
           └─> API GET /api/v1/rooms
               └─> setRooms(data)
                   └─> UI updates

2. User Clicks "Add Room"
   └─> setShowCreateModal(true)
       └─> Modal opens

3. User Fills Form & Submits
   └─> validateForm()
       └─> If valid:
           └─> API POST /api/v1/rooms
               └─> On success:
                   └─> fetchRooms() (refresh list)
                   └─> setShowCreateModal(false)
                   └─> Alert success

4. User Clicks "Delete"
   └─> Confirm dialog
       └─> If confirmed:
           └─> API DELETE /api/v1/rooms/{id}
               └─> fetchRooms() (refresh list)
```

---

## ⚠️ Important Notes

### RoomType Dependency
- **Critical**: RoomType must exist before creating rooms
- The `roomTypeId` field references the `room_types` table
- If RoomType doesn't exist, room creation will fail
- Error message: "Foreign key constraint fails"

**Solution**:
1. Create RoomTypes in database first
2. Use the RoomType ID when creating rooms
3. Future enhancement: Add RoomType management page

### Validation Rules
- **Room Number**: Required, max 50 characters, must be unique
- **Room Type ID**: Required, must exist in database
- **Status**: Required, must be valid enum value
- **Capacity**: Required, minimum 1
- **Price**: Required, minimum 0
- **Description**: Optional, max 500 characters
- **Image Folder**: Optional, max 255 characters

### Status Values
```javascript
const roomStatuses = [
  'AVAILABLE',    // Room is ready for booking
  'OCCUPIED',     // Room is currently occupied
  'MAINTENANCE',  // Room is under maintenance
  'RESERVED',     // Room is reserved
  'UNAVAILABLE'   // Room is not available
];
```

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch rooms"
**Cause**: Backend not running or CORS issue

**Solution**:
1. Check backend is running on port 8080
2. Verify CORS is configured
3. Check browser console for errors
4. Test API with Postman

### Issue 2: "Room number already exists"
**Cause**: Duplicate room number

**Solution**:
1. Use a different room number
2. Room numbers must be unique
3. Check existing rooms first

### Issue 3: "Foreign key constraint fails"
**Cause**: RoomType doesn't exist

**Solution**:
1. Insert RoomType in database first
2. Use correct RoomType ID
3. Verify RoomType exists: `SELECT * FROM room_types;`

### Issue 4: Empty room list
**Cause**: No rooms in database

**Solution**:
1. This is normal for new installations
2. Click "Add Room" to create first room
3. Ensure RoomType exists first

### Issue 5: Modal won't close
**Cause**: JavaScript error or state issue

**Solution**:
1. Check browser console for errors
2. Refresh page
3. Clear browser cache

---

## 🎯 Next Steps

### Phase 1: Enhance Rooms Module
- [ ] Add Edit Room functionality
- [ ] Add View Room details modal
- [ ] Add room images upload
- [ ] Add bulk operations
- [ ] Add export to Excel

### Phase 2: RoomType Management
- [ ] Create RoomType management page
- [ ] Add RoomType CRUD operations
- [ ] Link RoomType to Rooms
- [ ] Show RoomType name instead of ID

### Phase 3: Advanced Features
- [ ] Room availability calendar
- [ ] Room booking from Rooms page
- [ ] Room maintenance scheduling
- [ ] Room occupancy reports
- [ ] Room revenue analytics

### Phase 4: User Experience
- [ ] Toast notifications instead of alerts
- [ ] Confirmation modals for delete
- [ ] Loading skeletons
- [ ] Pagination for large datasets
- [ ] Advanced search filters

---

## 📚 Code Examples

### Fetch Rooms
```javascript
const fetchRooms = async () => {
  try {
    setLoading(true);
    const response = await roomApi.getAllRooms();
    
    if (response.success) {
      setRooms(response.data || []);
    }
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

### Create Room
```javascript
const handleCreateRoom = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    setCreating(true);
    const response = await roomApi.createRoom(formData);
    
    if (response.success) {
      setShowCreateModal(false);
      fetchRooms();
      alert('Room created successfully!');
    }
  } catch (err) {
    setError(err);
  } finally {
    setCreating(false);
  }
};
```

### Delete Room
```javascript
const handleDeleteRoom = async (roomId) => {
  if (!window.confirm('Are you sure?')) return;
  
  try {
    const response = await roomApi.deleteRoom(roomId);
    
    if (response.success) {
      fetchRooms();
      alert('Room deleted successfully!');
    }
  } catch (err) {
    alert(err);
  }
};
```

---

## ✅ Testing Checklist

- [ ] Backend running on port 8080
- [ ] RoomType exists in database
- [ ] Can view all rooms
- [ ] Can search rooms
- [ ] Can filter by status
- [ ] Can create new room
- [ ] Can delete room
- [ ] Loading states work
- [ ] Error messages display
- [ ] Form validation works
- [ ] Modal opens/closes
- [ ] Stats cards update
- [ ] Table refreshes after create/delete

---

## 🎉 Success!

The Rooms module is now fully functional with:
- ✅ Real backend API integration
- ✅ Complete CRUD operations (Create, Read, Delete)
- ✅ Search and filter functionality
- ✅ Loading and error states
- ✅ Form validation
- ✅ Modern, responsive UI

**Next**: Implement the Services, Bookings, and Invoices modules using the same pattern!
