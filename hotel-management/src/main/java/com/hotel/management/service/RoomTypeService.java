package com.hotel.management.service;

import com.hotel.management.dto.RoomTypeDTO;
import com.hotel.management.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

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

    PageResponse<RoomTypeDTO> getAllRoomTypes(Pageable pageable);

    PageResponse<RoomTypeDTO> searchRoomTypes(String keyword, Pageable pageable);

    boolean existsByName(String name);

    boolean existsById(Integer id);
}
