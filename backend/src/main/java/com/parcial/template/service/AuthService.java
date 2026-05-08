package com.parcial.template.service;

import com.parcial.template.dto.AuthResponse;
import com.parcial.template.dto.LoginRequest;
import com.parcial.template.dto.RegisterRequest;
import com.parcial.template.dto.UserResponse;
import com.parcial.template.entity.AppUser;
import com.parcial.template.entity.Role;
import com.parcial.template.exception.BusinessException;
import com.parcial.template.repository.AppUserRepository;
import com.parcial.template.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final DtoMapper mapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Ya existe un usuario con ese correo.");
        }

        AppUser user = userRepository.save(AppUser.builder()
                .nombre(request.nombre().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build());

        return new AuthResponse(jwtService.generateToken(user), mapper.toUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado."));
        return new AuthResponse(jwtService.generateToken(user), mapper.toUserResponse(user));
    }

    public UserResponse me(AppUser user) {
        return mapper.toUserResponse(user);
    }
}
