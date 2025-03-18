package org.example.wtask.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.example.wtask.models.Enums.Role;

import java.util.List;

@Data
@AllArgsConstructor
public class RegisterRequest {
    @NotNull
    private String username;

    @NotNull
    private String email;

    private List<Role> roles;

    @NotNull
    private String password;

}
