package com.hotel.management.service;

import com.hotel.management.dto.ServiceDTO;

import java.util.List;
import java.util.Optional;

public interface HotelService {

    ServiceDTO createService(ServiceDTO serviceDTO);

    ServiceDTO updateService(Integer id, ServiceDTO serviceDTO);

    void deleteService(Integer id);

    Optional<ServiceDTO> getServiceById(Integer id);

    Optional<ServiceDTO> getServiceByName(String name);

    List<ServiceDTO> getAllServices();

    List<ServiceDTO> getActiveServices();

    List<ServiceDTO> getServicesByUnit(String unit);

    List<ServiceDTO> searchServices(String keyword);

    List<ServiceDTO> filterServices(Boolean active, String unit, String keyword);

    boolean existsByName(String name);
}
