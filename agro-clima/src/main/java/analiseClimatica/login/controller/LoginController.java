package analiseClimatica.login.controller;

import analiseClimatica.login.dto.LoginRequest;
import analiseClimatica.login.dto.LoginResponse;
import analiseClimatica.login.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest data) {
        UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(data.getUsername(), data.getSenha());

        // O Spring verifica as credenciais aqui
        Authentication auth = this.authenticationManager.authenticate(usernamePassword);

        // Se passar, geramos o token
        String token = tokenService.generateToken(auth.getName());

        return ResponseEntity.ok(new LoginResponse(token));
    }
}