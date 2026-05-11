package com.datastory.ai.service;

import com.datastory.ai.dto.AuthResponse;
import com.datastory.ai.dto.LoginRequest;
import com.datastory.ai.dto.SignupRequest;
import com.datastory.ai.dto.UserResponse;
import com.datastory.ai.entity.AppUser;
import com.datastory.ai.entity.UserRole;
import com.datastory.ai.exception.DuplicateResourceException;
import com.datastory.ai.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();

        if (appUserRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered.");
        }

        AppUser user = AppUser.builder()
                .fullName(request.fullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(UserRole.USER)
                .build();

        AppUser savedUser = appUserRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return toAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new DuplicateResourceException("User account is unavailable."));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return toAuthResponse(user, token);
    }

    private AuthResponse toAuthResponse(AppUser user, String token) {
        return new AuthResponse(
                token,
                "Bearer",
                new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole())
        );
    }
}
