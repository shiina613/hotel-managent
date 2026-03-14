# Postman Collection - Quick Start Guide

## 🚀 3-Step Setup

### 1. Import Collection
```
Postman → Import → Select "Hotel_Management_API.postman_collection.json"
```

### 2. Start Application
```bash
./mvnw spring-boot:run
```

### 3. Run Requests in Order
Execute folders from top to bottom ⬇️

---

## 📋 Testing Checklist

### ✅ Phase 1: Setup (Required First)
- [ ] **1. Authentication → Register User**
  - Creates admin user
  - Saves `user_id` automatically
  
- [ ] **2. Hotel Services → Create Service**
  - Creates breakfast service
  - Saves `service_id` automatically

### ⚠️ Manual Step Required
- [ ] **Create RoomType in Database**
  ```sql
  INSERT INTO room_types (name, description, create_at, update_at) 
  VALUES ('Deluxe Room', 'Spacious room', NOW(), NOW());
  ```

### ✅ Phase 2: Core Entities
- [ ] **3. Rooms → Create Room**
  - Uses `roomTypeId: 1`
  - Saves `room_id` automatically

- [ ] **4. Bookings → Create Booking**
  - Uses `user_id` and `room_id`
  - Saves `booking_id` automatically

### ✅ Phase 3: Financial
- [ ] **5. Invoices → Create Invoice**
  - Uses `booking_id`
  - Saves `invoice_id` automatically

- [ ] **6. Invoices → Mark Invoice as Paid**
  - Completes the workflow

---

## 🎯 Quick Test Sequence

Run these 6 requests in order:

```
1. POST /api/v1/auth/register
2. POST /api/v1/services
3. POST /api/v1/rooms
4. POST /api/v1/bookings
5. POST /api/v1/invoices
6. PATCH /api/v1/invoices/{id}/mark-as-paid/CREDIT_CARD
```

**Expected Result**: All ✅ green tests, all IDs saved

---

## 📊 Variables Auto-Saved

| Variable | Saved After | Used In |
|----------|-------------|---------|
| `user_id` | Register User | Create Booking |
| `service_id` | Create Service | (Future: Service Usage) |
| `room_id` | Create Room | Create Booking |
| `booking_id` | Create Booking | Create Invoice |
| `invoice_id` | Create Invoice | Mark as Paid |

---

## 🔍 Verify Success

### Check Console Output
```
User ID saved: 1
Service ID saved: 1
Room ID saved: 1
Booking ID saved: 1
Invoice ID saved: 1
```

### Check Test Results
All requests should show:
- ✅ Status code is 201/200
- ✅ Response has success field
- ✅ Data contains expected properties

---

## ⚡ Pro Tips

1. **Run Collection**: Use Collection Runner for automated testing
2. **Check Variables**: Collection → Variables tab to see saved IDs
3. **View Console**: View → Show Postman Console (Alt+Ctrl+C)
4. **Reset Testing**: Clear all variable values to start fresh

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Connection refused | Start Spring Boot app |
| Room not found | Create RoomType in DB first |
| Variables not saving | Check test scripts are enabled |
| 404 errors | Run requests in correct order |

---

## 📞 Need Help?

- 📖 Full Guide: [POSTMAN_COLLECTION_GUIDE.md](./POSTMAN_COLLECTION_GUIDE.md)
- 📚 API Docs: [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
- 📋 Endpoints: [API_ENDPOINTS_SUMMARY.md](./API_ENDPOINTS_SUMMARY.md)

---

**Total Time**: ~5 minutes to complete full workflow ⏱️
