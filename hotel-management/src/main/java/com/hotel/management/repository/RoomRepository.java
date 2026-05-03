package com.hotel.management.repository;

import com.hotel.management.entity.Room;
import com.hotel.management.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    Optional<Room> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);

    List<Room> findByStatus(RoomStatus status);

    List<Room> findByRoomTypeId(Integer roomTypeId);

    List<Room> findByStatusAndRoomTypeId(RoomStatus status, Integer roomTypeId);

    Page<Room> findByStatus(RoomStatus status, Pageable pageable);

    @Query("SELECT r FROM Room r WHERE r.status = :status ORDER BY r.createAt DESC")
    List<Room> findAvailableRooms(@Param("status") RoomStatus status);

    @Query("SELECT r FROM Room r WHERE r.roomNumber LIKE %:keyword% OR r.description LIKE %:keyword%")
    List<Room> searchRooms(@Param("keyword") String keyword);

    @Query("SELECT r FROM Room r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:roomTypeId IS NULL OR r.roomType.id = :roomTypeId) AND " +
           "(:keyword IS NULL OR r.roomNumber LIKE %:keyword% OR r.description LIKE %:keyword%)")
    List<Room> filterRooms(@Param("status") RoomStatus status,
                           @Param("roomTypeId") Integer roomTypeId,
                           @Param("keyword") String keyword);

    @Query("SELECT r FROM Room r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:roomTypeId IS NULL OR r.roomType.id = :roomTypeId) AND " +
           "(:keyword IS NULL OR r.roomNumber LIKE %:keyword% OR r.description LIKE %:keyword%)")
    Page<Room> filterRooms(@Param("status") RoomStatus status,
                           @Param("roomTypeId") Integer roomTypeId,
                           @Param("keyword") String keyword,
                           Pageable pageable);

    @Query("SELECT r FROM Room r WHERE r.capacity >= :capacity AND r.status = :status")
    List<Room> findAvailableRoomsByCapacity(@Param("capacity") Integer capacity, @Param("status") RoomStatus status);

    @Query("SELECT COUNT(r) FROM Room r WHERE r.status = :status")
    long countByStatus(@Param("status") RoomStatus status);
}
