package web.minda.project.security;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.JwtException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//@Component
//public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
//
//    @Override
//    public void commence(HttpServletRequest request, HttpServletResponse response,
//                         AuthenticationException authException) throws IOException {
//
//        String path = request.getRequestURI();
//
//        if (path.startsWith("/WebApplication/auth/login")) {
//            // Login failure → return 401 with message
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//            response.getWriter().write("{\"error\": \"Invalid username or password\"}");
//        } else {
//            // Any other unauthorized access → redirect to custom HTML page
//            response.sendRedirect("/WebApplication/loginpage");
//        }
//    }
//}
import web.minda.project.service.ApiErrorResponse;
import web.minda.project.service.DateTimeService;

//@Component
//public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
//
//    @Override
//    public void commence(HttpServletRequest request,
//                         HttpServletResponse response,
//                         AuthenticationException authException) throws IOException {
//
//        String path = request.getRequestURI();
//        String accept = request.getHeader("Accept");
//        String requestedWith = request.getHeader("X-Requested-With");
//
//        boolean isApiCall =
//                path.startsWith("/WebApplication/controllers/")
//             || path.startsWith("/WebApplication/ExamTrainings/")
//             || "XMLHttpRequest".equalsIgnoreCase(requestedWith)
//             || (accept != null && accept.contains("application/json"));
//
//        if (isApiCall) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//            response.getWriter().write("""
//                {
//                  "error": "UNAUTHORIZED",
//                  "message": "Session expired. Please login again."
//                }
//            """);
//            return;
//        }
//
//        // 🔹 Only browser navigation should redirect
//        response.sendRedirect("/WebApplication/unauthorizeaccess");
//    }
//}

//@Component
//public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
//
//	@Autowired
//	DateTimeService dateTimeServiceObject;
//
//	@Override
//	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ex)
//			throws IOException {
//		
//		System.out.println("Run Entry Point");
//		System.out.println(request.getHeader("Accept"));
//		System.out.println(request.getHeader("Authorization"));
//
//		final ObjectMapper objectMapper = new ObjectMapper();
//
//		boolean isApiCall = (request.getHeader("Accept") != null
//				&& request.getHeader("Accept").startsWith("application/json"));
//			
//		isApiCall = (request.getHeader("Authorization") != null
//				&& request.getHeader("Authorization").startsWith("Bearer"));
//				
//		System.out.println("boolean value " + isApiCall);
//
//		if (isApiCall) {
//			ApiErrorResponse error = new ApiErrorResponse();
//			error.setTimestamp(dateTimeServiceObject.getCurrentDate());
//			error.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//			error.setError("UNAUTHORIZED");
//			error.setMessage("Session expired. Please login again.");
//			error.setPath(request.getRequestURI());
//			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//			response.setContentType("application/json");
//
//			response.getWriter().write(objectMapper.writeValueAsString(error));
//		} else {
//			// ✅ Browser navigation
//			response.sendRedirect("/WebApplication/unauthorizeaccess");
//		}
//	}
//}

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private DateTimeService dateTimeServiceObject;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException ex) throws IOException {

        System.out.println("Run Entry Point");
//        System.out.println("Accept = " + request.getHeader("Accept"));
//        System.out.println("X-Requested-With = " + request.getHeader("X-Requested-With"));

        boolean isApiCall =
                "XMLHttpRequest".equalsIgnoreCase(request.getHeader("X-Requested-With"))
             || (request.getHeader("Accept") != null
                 && request.getHeader("Accept").contains("application/json"));


        ObjectMapper objectMapper = new ObjectMapper();

        if (isApiCall) {
            ApiErrorResponse error = new ApiErrorResponse();
            error.setTimestamp(dateTimeServiceObject.getCurrentDate());
            error.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            error.setError("UNAUTHORIZED");
            error.setMessage("Session expired. Please login again.");
            error.setPath(request.getRequestURI());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        } else {
            // ✅ Browser navigation
            response.sendRedirect("/WebApplication/unauthorizeaccess");
        }
    }
}

