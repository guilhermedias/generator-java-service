package <%=defaultPackage%>.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
public class ClockConfiguration {

    @Bean
    public Clock clockBuilder(){
        return Clock.systemUTC();
    }
}
