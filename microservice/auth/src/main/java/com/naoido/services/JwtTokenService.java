package com.naoido.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.naoido.dto.JwtPayloadDto;

import java.util.Base64;

public class JwtTokenService {
    private static final String JWT_SECRET = System.getenv("SUPABASE_JWT_SECRET");
    private static final String ISSUER = System.getenv("SUPABASE_BASE_URL") + "/auth/v1";
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(JWT_SECRET);
    private static final JWTVerifier VERIFIER = JWT.require(ALGORITHM).withIssuer(ISSUER).build();
    private final String token;

    public JwtTokenService(String token) {
        this.token = token;
    }

    public boolean isValidToken() {
        if (this.token == null || !this.token.startsWith("Bearer ")) {
            return false;
        }

        return !VERIFIER.verify(token.substring("Bearer ".length())).getSubject().isEmpty();
    }

    public JwtPayloadDto getPayload() throws JsonProcessingException {
        String payloadJson = new String(Base64.getUrlDecoder().decode(this.token.split("\\.")[1]));
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(payloadJson, JwtPayloadDto.class);
    }
}
