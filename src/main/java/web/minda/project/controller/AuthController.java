//package web.minda.project.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import web.minda.project.entity.JwtRequest;
//import web.minda.project.entity.JwtResponse;
//import web.minda.project.entity.LoginMaster;
//import web.minda.project.repositories.LoginMasterRepository;
//import web.minda.project.security.JwtHelper;
//
//
//@RestController
//@RequestMapping("/auth")
//public class AuthController {
//
//	@Autowired
//	private UserDetailsService userDetailsService;
//
//	@Autowired
//	private AuthenticationManager authenticationManager;
//
//	@Autowired
//	private JwtHelper jwtHelper;
//
//	@Autowired
//	LoginMasterRepository loginMasterRepositoryObject;
//	LoginMaster loginMasterObject = new LoginMaster();
//
//	@PostMapping("/login")
//	public ResponseEntity<Object> login(@RequestBody JwtRequest request) {
//		
////		System.out.println(request);
//		
//		this.doAuthenticate(request.getEmployeeId(), request.getPassword());
//
//		UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmployeeId());
//		String token = this.jwtHelper.generateToken(userDetails);
//
//		request.setRole(this.loginMasterRepositoryObject.getRoleById(request.getEmployeeId()));
//		request.setDepartment(this.loginMasterRepositoryObject.getDepartmentById(request.getEmployeeId()));
//		request.setName(this.loginMasterRepositoryObject.getEmployeeName(request.getEmployeeId()));
//
//		JwtResponse response = JwtResponse.builder().JwtToken(token).Username(userDetails.getUsername())
//				.Role(request.getRole()).Department(request.getDepartment()).Name(request.getName()).build();
//
//		return new ResponseEntity<>(response, HttpStatus.OK);
//	}
//
//	private void doAuthenticate(String employeeId, String password) {
//		// TODO Auto-generated method stub
//		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(employeeId,
//				password);
//		try {
//			authenticationManager.authenticate(authentication);
//		} catch (BadCredentialsException e) {
//			throw new BadCredentialsException(" Invalid Username or Password  !!");
//		}
//	}
//
//}

package web.minda.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.entity.JwtRequest;
import web.minda.project.entity.JwtResponse;
import web.minda.project.entity.LoginMaster;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.RoleAuthorityMasterRepository;
import web.minda.project.security.JwtHelper;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtHelper jwtHelper;

	@Autowired
	RoleAuthorityMasterRepository roleAuthorityMasterRepository;

	@Autowired
	LoginMasterRepository loginMasterRepositoryObject;
	LoginMaster loginMasterObject = new LoginMaster();

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody JwtRequest request, HttpServletResponse servletResponse) {

//		// Authenticate
//		this.doAuthenticate(request.getEmployeeId(), request.getPassword());

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getEmployeeId(), request.getPassword()));
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("Invalid Username or Password  !!");
		}

		// Load user details
		UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmployeeId());

		// Generate JWT
		String token = this.jwtHelper.generateToken(userDetails);

		// Fetch additional user info
		request.setRole(this.loginMasterRepositoryObject.getRoleById(request.getEmployeeId()));
		request.setDepartment(this.loginMasterRepositoryObject.getDepartmentById(request.getEmployeeId()));
		request.setName(this.loginMasterRepositoryObject.getEmployeeName(request.getEmployeeId()));

		// 🔹 Create secure HttpOnly cookie
		ResponseCookie jwtCookie = ResponseCookie.from("JWT_TOKEN", token).httpOnly(true) // cannot be accessed by JS
				.secure(true) // only sent via HTTPS
				.sameSite("Strict") // prevents CSRF attacks
				.path("/") // cookie available to entire app
				.maxAge(60 * 60) // 1 hour
				.build();

		// Add cookie to response
		servletResponse.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

		// Also return response body (optional, can be removed if frontend doesn’t need
		// it)
		JwtResponse response = JwtResponse.builder().JwtToken(token) // you can remove this later if you don’t want body
																		// token
				.Username(userDetails.getUsername()).Role(request.getRole()).Department(request.getDepartment())
				.Name(request.getName()).build();

		return ResponseEntity.ok(response);
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		// Clear the cookie by setting same name, empty value, and maxAge=0
		ResponseCookie clearCookie = ResponseCookie.from("JWT_TOKEN", "").httpOnly(true).secure(true) // set false if
																							// not using
																										// HTTPS locally
				
				
				.path("/").maxAge(0) // expires immediately
				.sameSite("Strict").build();
				
		System.out.println("logout");
		response.setHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());

		return ResponseEntity.ok("Logged out successfully");
	}

	private void doAuthenticate(String employeeId, String password) {
		// TODO Auto-generated method stub
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(employeeId,
				password);
		try {
			authenticationManager.authenticate(authentication);
		} catch (BadCredentialsException e) {
			throw new BadCredentialsException("Invalid Username or Password  !!");
		}
	}

}
