package com.naoido.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JwtPayloadDto {
    @JsonProperty("iss")
    private String issuer;

    @JsonProperty("sub")
    private String subject;

    @JsonProperty("aud")
    private String audience;

    @JsonProperty("exp")
    private long expiration;

    @JsonProperty("iat")
    private long issuedAt;

    @JsonProperty("email")
    private String email;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("app_metadata")
    private Map<String, Object> appMetadata;

    @JsonProperty("user_metadata")
    private Map<String, Object> userMetadata;

    @JsonProperty("role")
    private String role;

    @JsonProperty("aal")
    private String authenticationAssuranceLevel;

    @JsonProperty("amr")
    private List<AuthenticationMethodReference> authenticationMethods;

    @JsonProperty("session_id")
    private String sessionId;

    @JsonProperty("is_anonymous")
    private boolean isAnonymous;

    // Getters and Setters
    public String getIssuer() {
        return this.issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getSubject() {
        return this.subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getAudience() {
        return this.audience;
    }

    public void setAudience(String audience) {
        this.audience = audience;
    }

    public long getExpiration() {
        return this.expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public long getIssuedAt() {
        return this.issuedAt;
    }

    public void setIssuedAt(long issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Map<String, Object> getAppMetadata() {
        return this.appMetadata;
    }

    public void setAppMetadata(Map<String, Object> appMetadata) {
        this.appMetadata = appMetadata;
    }

    public Map<String, Object> getUserMetadata() {
        return this.userMetadata;
    }

    public void setUserMetadata(Map<String, Object> userMetadata) {
        this.userMetadata = userMetadata;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAuthenticationAssuranceLevel() {
        return this.authenticationAssuranceLevel;
    }

    public void setAuthenticationAssuranceLevel(String authenticationAssuranceLevel) {
        this.authenticationAssuranceLevel = authenticationAssuranceLevel;
    }

    public List<AuthenticationMethodReference> getAuthenticationMethods() {
        return this.authenticationMethods;
    }

    public void setAuthenticationMethods(List<AuthenticationMethodReference> authenticationMethods) {
        this.authenticationMethods = authenticationMethods;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean isAnonymous() {
        return this.isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.isAnonymous = anonymous;
    }

    public static class AuthenticationMethodReference {
        @JsonProperty("method")
        private String method;

        @JsonProperty("timestamp")
        private long timestamp;

        public String getMethod() {
            return this.method;
        }

        public void setMethod(String method) {
            this.method = method;
        }

        public long getTimestamp() {
            return this.timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
