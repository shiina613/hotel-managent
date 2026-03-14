package com.hotel.management.repository;

import com.hotel.management.entity.HotelService;
import com.hotel.management.enums.ServiceUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<HotelService, Integer> {

    Optional<HotelService> findByName(String name);

    boolean existsByName(String name);

    List<HotelService> findByIsActive(Boolean isActive);

    List<HotelService> findByUnit(ServiceUnit unit);

    @Query("SELECT s FROM HotelService s WHERE s.isActive = true ORDER BY s.name ASC")
    List<HotelService> findAllActiveServices();

    @Query("SELECT s FROM HotelService s WHERE s.name LIKE %:keyword% AND s.isActive = true")
    List<HotelService> searchActiveServices(@Param("keyword") String keyword);

    @Query("SELECT s FROM HotelService s WHERE s.unit = :unit AND s.isActive = true")
    List<HotelService> findServicesByUnit(@Param("unit") ServiceUnit unit);

    @Query("SELECT s FROM HotelService s ORDER BY s.createAt DESC")
    List<HotelService> findAllOrderByCreateAtDesc();
}
