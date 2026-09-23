package web.minda.project.security;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.service.ApiErrorResponse;
import web.minda.project.service.DateTimeService;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@Autowired
	DateTimeService dateTimeServiceObject;

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntime(RuntimeException ex) {

		ApiErrorResponse error = new ApiErrorResponse();
		error.setTimestamp(dateTimeServiceObject.getCurrentDate());
		error.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		error.setError("INTERNAL_SERVER_ERROR");
		error.setMessage(ex.getMessage());
		error.setPath("NO Path Available...");

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<?> handleNotFound(EntityNotFoundException ex) {

		ApiErrorResponse error = new ApiErrorResponse();
		error.setTimestamp(dateTimeServiceObject.getCurrentDate());
		error.setStatus(HttpServletResponse.SC_NOT_FOUND);
		error.setError("NOT_FOUND");
		error.setMessage(ex.getMessage());
		error.setPath("NO Path Available...");

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
	}
}