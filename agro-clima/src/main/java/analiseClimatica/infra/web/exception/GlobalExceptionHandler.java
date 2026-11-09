package analiseClimatica.infra.web.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Tratamento para Regras de Negócio ou Validações Inválidas (Ex: Equipamento sem nome)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResponseDTO> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErroResponseDTO erro = new ErroResponseDTO(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    // 2. Tratamento para Recurso Não Encontrado (Ex: ID de equipamento inexistente)
    // Supondo que você crie uma exceção customizada chamada EntidadeNaoEncontradaException no seu use_case
    @ExceptionHandler(RuntimeException.class) // Troque para EntidadeNaoEncontradaException depois
    public ResponseEntity<ErroResponseDTO> handleRuntimeException(RuntimeException ex) {
        ErroResponseDTO erro = new ErroResponseDTO(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    // 3. Fallback: Captura qualquer erro inesperado (NullPointerException, quedas de banco, etc)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponseDTO> handleExceptionGeral(Exception ex) {
        // No log do servidor, você imprime a stack trace completa para o desenvolvedor
        ex.printStackTrace();

        // Mas para o front-end, você envia uma mensagem amigável e segura
        ErroResponseDTO erro = new ErroResponseDTO(
                "Ocorreu um erro interno no servidor. Contate o administrador.",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}