package <%=defaultPackage%>;

import org.junit.Test;
<% if (springBootVersion === '1.5.4.RELEASE'){%>
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(value = "test")
<%}else{%>
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;


@IntegrationTest({"server.port:0"})
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@EnableAutoConfiguration
@ContextConfiguration(classes = {Application.class})
@ActiveProfiles("test")
<%}%>
public class ApplicationTest {

    @Test
    public void shouldBeAtPacificTimeZone() {
        Clock clock = Clock.systemDefaultZone();
        assertThat(clock.getZone()).isEqualTo(ZoneId.of("UTC"));
    }
}
