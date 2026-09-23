package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.PlantMaster;
import web.minda.project.entity.RoleMaster;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.RoleAuthorityMasterRepository;
import web.minda.project.security.JwtHelper;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorizationAjaxController {

	@Autowired
	private JwtHelper jwtHelper;

	@Autowired
	private RoleAuthorityMasterRepository roleAuthorityMasterRepository;

	@Autowired
	LoginMasterRepository loginMasterRepositoryObject;

	@Autowired
	DateTimeService dateTimeService;

	@GetMapping("/getAuthorities")
	public ResponseEntity<Object> getAuthorities(@CookieValue(name = "JWT_TOKEN", required = false) String token) {

		try {

			if (token == null) {
				// extract username/role from token
//				String employeeId = this.jwtHelper.getUsernameFromToken(token);
				String roleName = loginMasterRepositoryObject.getRoleById("111");
				String departmentName = loginMasterRepositoryObject.getDepartmentNameById("111");

				Optional<LoginMaster> optionObject = (Optional<LoginMaster>) loginMasterRepositoryObject
						.findByEmployeeId("111");

				List<Object[]> permissions = roleAuthorityMasterRepository.getAuthorityByRoleNameAndDepartment(roleName,
						departmentName);
				Map<String, Object> response = new HashMap<>();

				response.put("permissions", permissions);

				if (!optionObject.isPresent()) {
					response.put("userDetails", "NOT FOUND");
				} else {
					response.put("userDetails", optionObject.get());
				}

				return new ResponseEntity<>(response, HttpStatus.OK);
//				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token missing or expired");
			} else {
				// extract username/role from token
				String employeeId = this.jwtHelper.getUsernameFromToken(token);
				String roleName = loginMasterRepositoryObject.getRoleById(employeeId);
				String departmentName = loginMasterRepositoryObject.getDepartmentNameById(employeeId);
				
				
				
				Optional<LoginMaster> optionObject = (Optional<LoginMaster>) loginMasterRepositoryObject
						.findByEmployeeId(employeeId);

				List<Object[]> permissions = roleAuthorityMasterRepository.getAuthorityByRoleNameAndDepartment(roleName,
						departmentName);
				Map<String, Object> response = new HashMap<>();

				response.put("permissions", permissions);

				if (!optionObject.isPresent()) {
					response.put("userDetails", "NOT FOUND");
				} else {
					response.put("userDetails", optionObject.get());
				}

				return new ResponseEntity<>(response, HttpStatus.OK);
			}

		} catch (Exception e) {
			// TODO: handle exception
			System.err.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getUserDetailByCookie")
	public ResponseEntity<Object> getUserDetailByCookie(
			@CookieValue(name = "JWT_TOKEN", required = false) String token) {

		try {

			if (token == null) {
				Optional<LoginMaster> optionObject = (Optional<LoginMaster>) loginMasterRepositoryObject
						.findByEmployeeId("111");
				return new ResponseEntity<>(optionObject.get(), HttpStatus.OK);
			}

			// extract username/role from token
			String employeeId = this.jwtHelper.getUsernameFromToken(token);
			Optional<LoginMaster> optionObject = (Optional<LoginMaster>) loginMasterRepositoryObject
					.findByEmployeeId(employeeId);

			if (optionObject.isPresent()) {
				return new ResponseEntity<>(optionObject.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			// TODO: handle exception
			System.err.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getCurrentUserAndDate")
	public ResponseEntity<Object> getCurrentUserAndDate(
			@CookieValue(name = "JWT_TOKEN", required = false) String token) {

		try {

			if (token == null) {
				Optional<LoginMaster> optionObject = (Optional<LoginMaster>) loginMasterRepositoryObject
						.findByEmployeeId("111");

				Map<String, Object> response = new HashMap<>();

				response.put("username", optionObject.get().getFirstName());
				response.put("datetime", dateTimeService.getCurrentDate());

				System.out.println("running");
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

			// extract username/role from token
			String employeeId = this.jwtHelper.getUsernameFromToken(token);

			System.out.println(token + employeeId);

			Optional<LoginMaster> optionObject = (Optional<LoginMaster>) loginMasterRepositoryObject
					.findByEmployeeId(employeeId);

			Map<String, Object> response = new HashMap<>();

			if (optionObject.isPresent()) {
				response.put("username", optionObject.get().getFirstName());
				response.put("datetime", dateTimeService.getCurrentDate());

				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			// TODO: handle exception
			System.err.println(e);
			return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}