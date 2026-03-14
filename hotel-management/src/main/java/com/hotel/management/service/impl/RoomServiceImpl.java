package com.hotel.management.service.impl;

import com.hotel.management.dto.RoomDTO;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.RoomType;
import com.hotel.management.enums.RoomStatus;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.RoomTypeRepository;
import com.hotel.management.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    @Override
    public RoomDTO createRoom(RoomDTO roomDTO) {
        RoomType roomType = roomTypeRepository.findById(roomDTO.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("RoomType not found with id: " + roomDTO.getRoomTypeId()));

        Room room = Room.builder()
                .roomNumber(roomDTO.getRoomNumber())
                .roomType(roomType)
                .status(roomDTO.getStatus())
                .description(roomDTO.getDescription())
                .capacity(roomDTO.getCapacity())
                .imgFolder(roomDTO.getImgFolder())
                .price(roomDTO.getPrice())
                .build();

        Room savedRoom = roomRepository.save(room);
        return mapToDTO(savedRoom);
    }

    @Override
    public RoomDTO updateRoom(Integer id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        if (!room.getRoomType().getId().equals(roomDTO.getRoomTypeId())) {
            RoomType roomType = roomTypeRepository.findById(roomDTO.getRoomTypeId())
                    .orElseThrow(() -> new RuntimeException("RoomType not found with id: " + roomDTO.getRoomTypeId()));
            room.setRoomType(roomType);
        }

        room.setStatus(roomDTO.getStatus());
        room.setDescription(roomDTO.getDescription());
        room.setCapacity(roomDTO.getCapacity());
        room.setImgFolder(roomDTO.getImgFolder());
        room.setPrice(roomDTO.getPrice());

        Room updatedRoom = roomRepository.save(room);
        return mapToDTO(updatedRoom);
    }

    @Override
    public void deleteRoom(Integer id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        roomRepository.delete(room);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RoomDTO> getRoomById(Integer id) {
        return roomRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RoomDTO> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getRoomsByType(Integer roomTypeId) {
        return roomRepository.findByRoomTypeId(roomTypeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getAvailableRoomsByCapacity(Integer capacity) {
        return roomRepository.findAvailableRoomsByCapacity(capacity, RoomStatus.AVAILABLE).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> searchRooms(String keyword) {
        return roomRepository.searchRooms(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countRoomsByStatus(RoomStatus status) {
        return roomRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByRoomNumber(String roomNumber) {
        return roomRepository.existsByRoomNumber(roomNumber);
    }

    private RoomDTO mapToDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .roomTypeId(room.getRoomType().getId())
                .roomTypeName(room.getRoomType().getName())
                .status(room.getStatus())
                .description(room.getDescription())
                .capacity(room.getCapacity())
                .imgFolder(room.getImgFolder())
                .price(room.getPrice())
                .createAt(room.getCreateAt())
                .updateAt(room.getUpdateAt())
                .build();
    }
}
