//package web.minda.project;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//class WebApplicationTests {
//
//	@Test
//	void contextLoads() {
//	}
//
//}

package web.minda.project;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class WebApplicationTests {

    @Test
    void contextLoads() {
    }
}