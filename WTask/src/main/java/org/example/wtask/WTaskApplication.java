package org.example.wtask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WTaskApplication {

    public static void main(String[] args) {
        SpringApplication.run(WTaskApplication.class, args);
    }

}
