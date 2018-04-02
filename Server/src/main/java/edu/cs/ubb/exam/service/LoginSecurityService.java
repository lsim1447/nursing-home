package edu.cs.ubb.exam.service;

/**
 * Created by Szilu on 2017. 05. 10..
 */

import edu.cs.ubb.exam.model.LoginSecurity;
import edu.cs.ubb.exam.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import org.jose4j.lang.JoseException;

import java.security.Key;

@Service
public class LoginSecurityService {

    @Autowired
    UserService userService;

    private static final String tokenIssuer = "magical";
    private static final String tokenAlgorithm = AlgorithmIdentifiers.HMAC_SHA256;
    private static final Key tokenKey = new HmacKey("x&'Q`dg)6Xj5b]q98TaK._TL%T#pm@?T".getBytes());
    private static final JwtConsumer tokenVerifier;

    static {
        tokenVerifier = new JwtConsumerBuilder()
                .setJwsAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST, tokenAlgorithm))
                .setRequireSubject()
                .setRequireExpirationTime()
                .setAllowedClockSkewInSeconds(30)
                .setExpectedIssuer(tokenIssuer)
                .setVerificationKey(tokenKey)
                .build();
    }

    public LoginSecurity checkLogin(User u){
        try{
            String token = generateToken(u);
            return new LoginSecurity(u, token);
        } catch (Exception e) {
            return new LoginSecurity(null, null);
        }
    }

    private String generateToken(User user) {
        JwtClaims claims = new JwtClaims();
        claims.setIssuedAtToNow();
        claims.setIssuer(tokenIssuer);
        claims.setExpirationTimeMinutesInTheFuture(60*24);
        claims.setSubject(Long.toString(user.getId()));
        claims.setStringClaim("email", user.getEmail());
        claims.setStringClaim("fullname", user.getFullname());
        claims.setStringClaim("alvl", user.getAlvl());
        JsonWebSignature jwt = new JsonWebSignature();
        jwt.setPayload(claims.toJson());
        jwt.setAlgorithmHeaderValue(tokenAlgorithm);
        jwt.setKey(tokenKey);

        try {
            return jwt.getCompactSerialization();
        } catch (JoseException e) {
            throw new RuntimeException(e);
        }
    }

    public User checkToken(String token) {
        try {
            JwtClaims claims = tokenVerifier.processToClaims(token);
            long userId = Long.parseLong(claims.getSubject());
            return userService.findUserById(userId);
        } catch (InvalidJwtException | MalformedClaimException | NumberFormatException e ) {
            return null;
        }
    }
}
