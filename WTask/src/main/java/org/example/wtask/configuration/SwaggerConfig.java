package org.example.wtask.configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration // Marks this class as a configuration class
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT", scheme = "bearer") // Configures security scheme for JWT


public class SwaggerConfig {
    @Bean // Declares this method as a Spring Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()) // Initializes OpenAPI components
                .info(new Info().title("Warehouse Management API Documentation") // Sets the API title
                        .description("This document provides API details for a sample Spring Boot Project")); // Sets the API description
    }

    // Use this url to access it
    // http://localhost:8081/swagger-ui/index.html

}