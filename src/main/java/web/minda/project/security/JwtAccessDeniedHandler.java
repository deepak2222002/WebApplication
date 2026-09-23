package web.minda.project.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.service.ApiErrorResponse;
import web.minda.project.service.DateTimeService;
//
//@Component
//public class JwtAccessDeniedHandler implements AccessDeniedHandler {
//
//	@Override
//	public void handle(HttpServletRequest request, HttpServletResponse response,
//			AccessDeniedException accessDeniedException) throws IOException, ServletException {
//		// TODO Auto-generated method stub
//
//		response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//		response.setContentType("application/json");
//		response.getWriter().write("""
//				    {
//				      "error": "FORBIDDEN",
//				      "message": "You do not have permission to access this resource."
//				    }
//				""");
//
//	}
//}


@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
	
	@Autowired
	DateTimeService dateTimeServiceObject;

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {
    	
    	System.out.println("Handler Run");
    	
    	final ObjectMapper objectMapper = new ObjectMapper();
    	
        boolean isApiCall =
                request.getHeader("Accept") != null &&
                request.getHeader("Accept").contains("application/json");

        if (isApiCall) {
        	ApiErrorResponse error = new ApiErrorResponse();
            error.setTimestamp(dateTimeServiceObject.getCurrentDate());
            error.setStatus(HttpServletResponse.SC_FORBIDDEN);
            error.setError("FORBIDDEN");
            error.setMessage("You do not have permission to access this resource.");
            error.setPath(request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");

            response.getWriter().write(
                    objectMapper.writeValueAsString(error)
            );
            
        } else {
            // ✅ Browser navigation
            response.sendRedirect("/WebApplication/unauthorizeaccess");
        }
    }
}

