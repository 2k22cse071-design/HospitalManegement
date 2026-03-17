package com.hospital.backend;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;

public class TokenGenerator {
    public static void main(String[] args) {
        String secret = "9a722ce5467d83048c17c0f1FD73D0C18C1A08ED361AD7E2A0342DBA001D4741";
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);
        
        String token = Jwts.builder()
                .claims(new HashMap<>())
                .subject("admin")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(key)
                .compact();
        
        System.out.println("TOKEN_START:" + token + ":TOKEN_END");
    }
}
