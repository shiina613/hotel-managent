package com.hotel.management.service;

import com.hotel.management.dto.ServiceDTO;
import com.hotel.management.enums.ServiceUnit;

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

    List<ServiceDTO> getServicesByUnit(ServiceUnit unit);

    List<ServiceDTO> searchServices(String keyword);

    boolean existsByName(String name);
}
