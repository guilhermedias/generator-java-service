package <%=defaultPackage%>.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

@Configuration
@Profile("local")
@PropertySource("application-local.properties")
public class PropertiesConfiguration {
}
