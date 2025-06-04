package com.finance.userservice.repository;

import com.finance.userservice.entity.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuthProviderRepository extends JpaRepository<OAuthProvider, Long> {
    Optional<OAuthProvider> findByProviderAndProviderId(String provider, String providerId);
    Optional<OAuthProvider> findByUserIdAndProvider(Long userId, String provider);
    boolean existsByProviderAndProviderId(String provider, String providerId);
} 