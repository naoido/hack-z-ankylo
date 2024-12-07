package com.naoido.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;

public class SupabaseAuthService {
    private static final String JWT_SECRET = System.getenv("SUPABASE_JWT_SECRET");
    private static final String ISSUER = System.getenv("SUPABASE_ISSUER");
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(JWT_SECRET);
    private static final JWTVerifier VERIFIER = JWT.require(ALGORITHM).withIssuer(ISSUER).build();

    public static String getUserId(String token) {
        return VERIFIER.verify(token).getSubject();
    }
}
