package com.finacalc.shop.repository;

import com.finacalc.shop.model.Shop;
import com.finacalc.shop.model.ShopPlatform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    List<Shop> findByOwnerEmail(String ownerEmail);
    List<Shop> findByOwnerEmailAndPlatform(String ownerEmail, ShopPlatform platform);
}
