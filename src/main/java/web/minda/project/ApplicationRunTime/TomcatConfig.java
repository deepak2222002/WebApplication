package web.minda.project.ApplicationRunTime;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {
	
	 @Bean
	    public TomcatServletWebServerFactory containerFactory() {
	        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
	        factory.addConnectorCustomizers(connector -> {
	            connector.setMaxPostSize(500 * 1024 * 1024); // Set the maximum post size (in bytes)
	        });
	        return factory;
	    }
	
}
