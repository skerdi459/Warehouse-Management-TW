package org.example.wtask.models.DTO;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

@Data
public class LoginRequest {
    @NotNull
    private String username;

    @NotNull
    private String password;
}
