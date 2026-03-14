package com.hotel.management.repository;

import com.hotel.management.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

    Optional<RoomType> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT rt FROM RoomType rt WHERE rt.name LIKE %:keyword%")
    List<RoomType> searchByName(@Param("keyword") String keyword);

    @Query("SELECT rt FROM RoomType rt ORDER BY rt.createAt DESC")
    List<RoomType> findAllOrderByCreateAtDesc();
}
