package com.finance.userservice.service;

import com.finance.userservice.dto.request.UserRegistrationRequest;
import com.finance.userservice.dto.response.UserResponse;
import com.finance.userservice.entity.User;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse getUserById(Long id);
    UserResponse getUserByEmail(String email);
    UserResponse updateUser(Long id, UserRegistrationRequest request);
    void deleteUser(Long id);
    User getCurrentUser();
    User findOrCreateOAuth2User(String email, String name, String provider);
} 