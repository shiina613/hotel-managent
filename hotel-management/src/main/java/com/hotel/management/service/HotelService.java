package com.hotel.management.service;

import com.hotel.management.dto.ServiceDTO;
import com.hotel.management.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

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

    PageResponse<ServiceDTO> getAllServices(Pageable pageable);

    PageResponse<ServiceDTO> filterServices(Boolean active, String unit, String keyword, Pageable pageable);

    boolean existsByName(String name);
}
