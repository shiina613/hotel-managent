package com.hotel.management.service.impl;

import com.hotel.management.dto.RoomTypeDTO;
import com.hotel.management.entity.RoomType;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.repository.RoomTypeRepository;
import com.hotel.management.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    @Override
    public RoomTypeDTO createRoomType(RoomTypeDTO roomTypeDTO) {
        RoomType roomType = RoomType.builder()
                .name(roomTypeDTO.getName())
                .description(roomTypeDTO.getDescription())
                .build();

        RoomType savedRoomType = roomTypeRepository.save(roomType);
        return mapToDTO(savedRoomType);
    }

    @Override
    public RoomTypeDTO updateRoomType(Integer id, RoomTypeDTO roomTypeDTO) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with id: " + id));

        roomType.setName(roomTypeDTO.getName());
        roomType.setDescription(roomTypeDTO.getDescription());

        RoomType updatedRoomType = roomTypeRepository.save(roomType);
        return mapToDTO(updatedRoomType);
    }

    @Override
    public void deleteRoomType(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found with id: " + id));
        
        // Check if there are rooms associated with this room type
        if (!roomType.getRooms().isEmpty()) {
            throw new RuntimeException("Cannot delete room type with associated rooms");
        }
        
        roomTypeRepository.delete(roomType);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RoomTypeDTO> getRoomTypeById(Integer id) {
        return roomTypeRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RoomTypeDTO> getRoomTypeByName(String name) {
        return roomTypeRepository.findByName(name).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomTypeDTO> getAllRoomTypes() {
        return roomTypeRepository.findAllOrderByCreateAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomTypeDTO> searchRoomTypes(String keyword) {
        return roomTypeRepository.searchByName(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return roomTypeRepository.existsByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return roomTypeRepository.existsById(id);
    }

    private RoomTypeDTO mapToDTO(RoomType roomType) {
        return RoomTypeDTO.builder()
                .id(roomType.getId())
                .name(roomType.getName())
                .description(roomType.getDescription())
                .createAt(roomType.getCreateAt())
                .updateAt(roomType.getUpdateAt())
                .build();
    }
}
