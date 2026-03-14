package com.hotel.management.service.impl;

import com.hotel.management.dto.ServiceDTO;
import com.hotel.management.enums.ServiceUnit;
import com.hotel.management.repository.ServiceRepository;
import com.hotel.management.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HotelServiceImpl implements HotelService {

    private final ServiceRepository serviceRepository;

    @Override
    public ServiceDTO createService(ServiceDTO serviceDTO) {
        com.hotel.management.entity.HotelService service = com.hotel.management.entity.HotelService.builder()
                .name(serviceDTO.getName())
                .price(serviceDTO.getPrice())
                .unit(serviceDTO.getUnit())
                .isActive(serviceDTO.getIsActive())
                .build();

        com.hotel.management.entity.HotelService savedService = serviceRepository.save(service);
        return mapToDTO(savedService);
    }

    @Override
    public ServiceDTO updateService(Integer id, ServiceDTO serviceDTO) {
        com.hotel.management.entity.HotelService service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setName(serviceDTO.getName());
        service.setPrice(serviceDTO.getPrice());
        service.setUnit(serviceDTO.getUnit());
        service.setIsActive(serviceDTO.getIsActive());

        com.hotel.management.entity.HotelService updatedService = serviceRepository.save(service);
        return mapToDTO(updatedService);
    }

    @Override
    public void deleteService(Integer id) {
        com.hotel.management.entity.HotelService service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        serviceRepository.delete(service);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceDTO> getServiceById(Integer id) {
        return serviceRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceDTO> getServiceByName(String name) {
        return serviceRepository.findByName(name).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> getActiveServices() {
        return serviceRepository.findAllActiveServices().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> getServicesByUnit(ServiceUnit unit) {
        return serviceRepository.findServicesByUnit(unit).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> searchServices(String keyword) {
        return serviceRepository.searchActiveServices(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return serviceRepository.existsByName(name);
    }

    private ServiceDTO mapToDTO(com.hotel.management.entity.HotelService service) {
        return ServiceDTO.builder()
                .id(service.getId())
                .name(service.getName())
                .price(service.getPrice())
                .unit(service.getUnit())
                .isActive(service.getIsActive())
                .createAt(service.getCreateAt())
                .updateAt(service.getUpdateAt())
                .build();
    }
}
