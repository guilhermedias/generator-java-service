package <%=defaultPackage%>;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Clock;
import java.time.ZoneId;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(value = "test")
public class ApplicationTest {
    @Test
    public void shouldBeAtPacificTimeZone() {
        Clock clock = Clock.systemDefaultZone();
        assertThat(clock.getZone()).isEqualTo(ZoneId.of("<%=timeZone%>"));
    }
}
