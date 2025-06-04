package com.finance.userservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "spring.security.oauth2.client")
public class OAuth2Config {
    private Map<String, OAuth2ClientProperties> registration = new HashMap<>();

    public Map<String, OAuth2ClientProperties> getRegistration() {
        return registration;
    }

    public void setRegistration(Map<String, OAuth2ClientProperties> registration) {
        this.registration = registration;
    }

    public static class OAuth2ClientProperties {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        private String scope;

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public String getClientSecret() {
            return clientSecret;
        }

        public void setClientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
        }

        public String getRedirectUri() {
            return redirectUri;
        }

        public void setRedirectUri(String redirectUri) {
            this.redirectUri = redirectUri;
        }

        public String getScope() {
            return scope;
        }

        public void setScope(String scope) {
            this.scope = scope;
        }
    }
} 