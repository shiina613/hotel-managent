package com.hotel.management.service;

import com.hotel.management.dto.RoomTypeDTO;

import java.util.List;
import java.util.Optional;

public interface RoomTypeService {

    RoomTypeDTO createRoomType(RoomTypeDTO roomTypeDTO);

    RoomTypeDTO updateRoomType(Integer id, RoomTypeDTO roomTypeDTO);

    void deleteRoomType(Integer id);

    Optional<RoomTypeDTO> getRoomTypeById(Integer id);

    Optional<RoomTypeDTO> getRoomTypeByName(String name);

    List<RoomTypeDTO> getAllRoomTypes();

    List<RoomTypeDTO> searchRoomTypes(String keyword);

    boolean existsByName(String name);

    boolean existsById(Integer id);
}
