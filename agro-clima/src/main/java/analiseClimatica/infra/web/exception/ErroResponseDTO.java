package analiseClimatica.infra.web.exception;


import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ErroResponseDTO {
    private String message;
    private int status;
    private LocalDateTime timestamp;
}