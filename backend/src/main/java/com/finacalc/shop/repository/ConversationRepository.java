package com.finacalc.shop.repository;

import com.finacalc.shop.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByShopIdOrderByCreatedAtAsc(Long shopId);
    void deleteByShopId(Long shopId);
}
