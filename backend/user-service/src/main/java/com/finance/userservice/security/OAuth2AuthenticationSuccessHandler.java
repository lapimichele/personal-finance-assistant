package com.finance.userservice.security;

import com.finance.userservice.dto.response.AuthResponse;
import com.finance.userservice.entity.OAuthProvider;
import com.finance.userservice.entity.User;
import com.finance.userservice.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauthToken.getPrincipal();
        String provider = oauthToken.getAuthorizedClientRegistrationId();

        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // Find or create user
        User user = userService.findOrCreateOAuth2User(email, name, provider);

        // Generate JWT token
        String jwt = tokenProvider.generateToken(authentication);

        // Create response with token and user info
        AuthResponse authResponse = new AuthResponse(jwt, userService.getUserById(user.getId()));

        // Write response
        response.setContentType("application/json");
        response.getWriter().write(authResponse.toString());
    }
} 