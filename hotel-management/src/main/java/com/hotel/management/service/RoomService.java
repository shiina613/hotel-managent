package com.hotel.management.service;

import com.hotel.management.dto.RoomDTO;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.RoomStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface RoomService {

    RoomDTO createRoom(RoomDTO roomDTO);

    RoomDTO updateRoom(Integer id, RoomDTO roomDTO);

    void deleteRoom(Integer id);

    Optional<RoomDTO> getRoomById(Integer id);

    Optional<RoomDTO> getRoomByNumber(String roomNumber);

    List<RoomDTO> getAllRooms();

    List<RoomDTO> getRoomsByStatus(RoomStatus status);

    List<RoomDTO> getRoomsByType(Integer roomTypeId);

    List<RoomDTO> getAvailableRooms();

    List<RoomDTO> getAvailableRoomsByCapacity(Integer capacity);

    List<RoomDTO> searchRooms(String keyword);

    List<RoomDTO> filterRooms(RoomStatus status, Integer roomTypeId, String keyword);

    PageResponse<RoomDTO> getAllRooms(Pageable pageable);

    PageResponse<RoomDTO> getRoomsByStatus(RoomStatus status, Pageable pageable);

    PageResponse<RoomDTO> filterRooms(RoomStatus status, Integer roomTypeId, String keyword, Pageable pageable);

    long countRoomsByStatus(RoomStatus status);

    boolean existsByRoomNumber(String roomNumber);
}
