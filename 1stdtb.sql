-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_management
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `check_in_at` datetime(6) NOT NULL,
  `check_out_at` datetime(6) NOT NULL,
  `create_at` datetime(6) NOT NULL,
  `note` text,
  `room_price` int NOT NULL,
  `status` enum('CANCELLED','CHECKED_IN','CHECKED_OUT','CONFIRMED','PENDING') NOT NULL,
  `total_price` int NOT NULL,
  `update_at` datetime(6) NOT NULL,
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2026-04-12 18:00:00.000000','2026-04-12 22:00:00.000000','2026-04-12 14:57:28.905119','',750000,'CONFIRMED',125000,'2026-04-12 14:58:36.045993',3,3);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime(6) NOT NULL,
  `note` text,
  `paid_at` datetime(6) DEFAULT NULL,
  `pay_method` enum('BANK_TRANSFER','CASH') NOT NULL,
  `room_amount` int NOT NULL,
  `service_amount` int NOT NULL,
  `status` enum('CANCELLED','OVERDUE','PAID','PARTIALLY_PAID','PENDING') NOT NULL,
  `total_price` int NOT NULL,
  `update_at` datetime(6) NOT NULL,
  `booking_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqn380ix1ge287r0rd8th12bwi` (`booking_id`),
  CONSTRAINT `FKb9bhb7xre5v64qvjeholh3qj0` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime(6) NOT NULL,
  `description` text,
  `name` varchar(100) NOT NULL,
  `update_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (1,'2026-03-14 05:16:55.129103','','Phòng đơn','2026-03-14 05:16:55.129103'),(2,'2026-03-14 05:17:02.967159','','Phòng đôi','2026-03-14 05:17:02.967159'),(3,'2026-03-14 05:17:11.137082','','Phòng king-size','2026-03-14 05:17:11.137082'),(4,'2026-03-14 18:56:44.115220','','Phòng 3 người','2026-03-14 18:56:44.115220');
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `capacity` int NOT NULL,
  `create_at` datetime(6) NOT NULL,
  `description` text,
  `img_folder` varchar(255) DEFAULT NULL,
  `price` int NOT NULL,
  `room_number` varchar(50) NOT NULL,
  `status` enum('AVAILABLE','MAINTENANCE','OCCUPIED','RESERVED','UNAVAILABLE') NOT NULL,
  `update_at` datetime(6) NOT NULL,
  `type_id` int NOT NULL,
  `hourly_price` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7ljglxlj90ln3lbas4kl983m2` (`room_number`),
  KEY `FK36pnbgx5yxaalc346d0astj9s` (`type_id`),
  CONSTRAINT `FK36pnbgx5yxaalc346d0astj9s` FOREIGN KEY (`type_id`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (3,3,'2026-04-12 14:34:38.906423','Phòng lớn, có thể ở 3 người','[\"thumb:/uploads/rooms/3/5b164591-a960-4c94-a6fa-4a0597932e01.jpg\",\"/uploads/rooms/3/4f02bebd-575c-4463-89af-c4173ff0be36.png\"]',750000,'101','AVAILABLE','2026-04-12 15:28:15.076607',4,300000),(4,5,'2026-04-12 14:35:21.850345','Phòng kibng-size, có thể tổ chức tiệc nhỏ','[\"thumb:/uploads/rooms/4/f4bf6089-c008-4065-abf9-ad8af531c1e7.png\",\"/uploads/rooms/4/8bad2a5c-1682-49b9-a24f-e99162782551.png\"]',1500000,'202','AVAILABLE','2026-04-12 15:28:20.021352',3,500000),(5,2,'2026-04-12 14:35:45.959750','Phòng đôi ở 2 người','[\"thumb:/uploads/rooms/5/8ac6d2da-316e-4eaf-ab36-4e5c42bfa20d.png\",\"/uploads/rooms/5/670a1e2d-8a8b-40be-be02-3ecc34ca9759.jpg\"]',500000,'303','AVAILABLE','2026-04-12 15:28:25.380066',2,200000),(7,4,'2026-04-12 18:35:17.469549','Phòng đơn, ở một người','[\"thumb:/uploads/rooms/7/c5d422e7-f56a-41ba-87e7-c51370562519.jpg\",\"/uploads/rooms/7/77d444e8-9dde-4170-b284-b8575f4fecd3.png\",\"/uploads/rooms/7/d1a06c1b-29aa-433a-bf88-eca538dbaeaa.jpg\",\"/uploads/rooms/7/f4789b9c-7910-4f1c-a10d-b92f78608a0a.jpg\"]',700000,'404','AVAILABLE','2026-04-12 18:35:29.858301',1,150000);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_usage`
--

DROP TABLE IF EXISTS `service_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_usage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `total_price` int NOT NULL,
  `unit_price` int NOT NULL,
  `use_at` datetime(6) NOT NULL,
  `booking_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfhma1ts71reydvvgww1gfu13h` (`booking_id`),
  KEY `FKsp7vf00mxc26jt67axd6bg3en` (`service_id`),
  CONSTRAINT `FKfhma1ts71reydvvgww1gfu13h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FKsp7vf00mxc26jt67axd6bg3en` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_usage`
--

LOCK TABLES `service_usage` WRITE;
/*!40000 ALTER TABLE `service_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime(6) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int NOT NULL,
  `unit` varchar(50) NOT NULL,
  `update_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'2026-04-05 17:56:50.604286',_binary '','Spa',100000,'HOUR','2026-04-05 17:56:50.604286');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime(6) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('ADMIN','RECEPTIONIST','CUSTOMER') NOT NULL,
  `status` enum('ACTIVE','DELETED','INACTIVE','SUSPENDED') NOT NULL,
  `update_at` datetime(6) NOT NULL,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-03-14 04:03:37.572873','admin@hotel.com','Admin User','admin123','1234567890','ADMIN','ACTIVE','2026-03-14 04:03:37.572873','admin001'),(2,'2026-03-14 04:03:37.753892','john.doe@email.com','John Doe','customer123','9876543210','CUSTOMER','ACTIVE','2026-03-14 04:03:37.753892','customer001'),(3,'2026-04-05 16:16:07.155790','tung01@gmail.com','Nguyễn Quang Tùng','tung01','0971871656','CUSTOMER','ACTIVE','2026-04-05 16:16:07.155790','tung01'),(4,'2026-04-05 17:48:22.382225','shiina@gmail.com','shiina','shiina','01234456876','RECEPTIONIST','ACTIVE','2026-04-12 14:36:53.996964','shiina');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-12 18:40:15
