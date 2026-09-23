package web.minda.project.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.download.DownloadExcelData;
import web.minda.project.download.MasterTemplate;
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.MasterDetails;
import web.minda.project.entity.RoleMaster;
import web.minda.project.entity.ShiftMaster;
import web.minda.project.repositories.DepartmentMasterRepository;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.MasterDetailsRepository;
import web.minda.project.repositories.RoleMasterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class LoginMasterAjaxController {
	private List<String> datList;
	@Autowired
	LoginMasterRepository loginMasterRepositoryObject;
	LoginMaster loginMasterObject = new LoginMaster();

	@Autowired
	MasterDetailsRepository masterDetailsRepositoryObject;

	@Autowired
	RoleMasterRepository roleMasterRepositoryObject;

	@Autowired
	DepartmentMasterRepository departmentMasterRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	// -------------------Login Master Ajax Controller ---------------------///
	@PostMapping("/insertLoginMaster")
	public ResponseEntity<Object> insertLoginMaster(@RequestBody LoginMaster loginJsonObject) {

		try {
			if (!loginMasterRepositoryObject.existsById(Long.parseLong(loginJsonObject.getEmployeeId()))) {

				Optional<RoleMaster> roleOptional = roleMasterRepositoryObject
						.findByRoleName(loginJsonObject.getRole().getRoleName());

				Optional<DepartmentMaster> depOptional = departmentMasterRepositoryObject
						.findByDepartmentName(loginJsonObject.getDepartment().getDepartmentName());

				loginJsonObject.setRole(roleOptional.get());
				loginJsonObject.setDepartment(depOptional.get());
				loginJsonObject.setDateTime(dateTimeService.getCurrentDateAndTime());
				loginJsonObject.setPassword(new BCryptPasswordEncoder().encode(loginJsonObject.getPassword()));

				this.loginMasterRepositoryObject.save(loginJsonObject);
				return new ResponseEntity<>("User added successfully.", HttpStatus.OK);
			}
			return new ResponseEntity<>("User already existed.", HttpStatus.NOT_ACCEPTABLE);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/editLoginMaster")
	public ResponseEntity<Object> editLoginMaster(@RequestBody LoginMaster loginJsonObject) {

		try {

			if (loginJsonObject.getDateOfLeaving().length() > 0) {
				loginJsonObject.setDepartment(null);
			}

			if (loginJsonObject.getPassword().equals("") || loginJsonObject.getPassword() == null) {

				String loginPassword = this.loginMasterRepositoryObject
						.getEmployeePassword(loginJsonObject.getEmployeeId());

				loginJsonObject.setPassword(loginPassword);
				loginJsonObject.setDateTime(dateTimeService.getCurrentDateAndTime());

				this.loginMasterRepositoryObject.save(loginJsonObject);
				return new ResponseEntity<>("User updated successfully.", HttpStatus.OK);

			} else {

				loginJsonObject.setDateTime(dateTimeService.getCurrentDateAndTime());
				loginJsonObject.setPassword(new BCryptPasswordEncoder().encode(loginJsonObject.getPassword()));
				this.loginMasterRepositoryObject.save(loginJsonObject);
				return new ResponseEntity<>("User updated successfully.", HttpStatus.OK);
			}

		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/deleteLoginMaster/{id}")
	public ResponseEntity<Object> deleteLogin(@PathVariable Long id) {
		try {
			this.loginMasterRepositoryObject.deleteById(id);
			return new ResponseEntity<Object>("Data deleted successfully", HttpStatus.OK);
		} catch (DataIntegrityViolationException e) {
			Optional<LoginMaster> object = this.loginMasterRepositoryObject.findById(id);
			return new ResponseEntity<Object>("Unable to delete Data due to mapping" + object, HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/download/data/loginmaster")
	public void exportToExcellogin(HttpServletResponse response) throws IOException {
		try {
			// response.setContentType("application/octet-stream");
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			List<String> listPlant = this.loginMasterRepositoryObject.getalldata();
			String[] headerList = new String[] { "Plant Code", "Title", "First Name", "Last Name", "Email",
					"Employee Id", "Contact", "DOB", "Date Of Join", "Date Of Leave", "created By", "Date Time",
					"Password", "Role" };

			ServletOutputStream outputStream = response.getOutputStream();
			DownloadExcelData excelExporter = new DownloadExcelData(listPlant, outputStream, "Login Master",
					headerList);
			excelExporter.export();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@GetMapping("/download/template/loginmaster")
	public void logintemplate(HttpServletResponse response) throws IOException {
		try {
			// response.setContentType("application/octet-stream");
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			String[] headerList = new String[] { "Plant Code", "Title", "First Name", "Last Name", "Email",
					"Employee Id", "Contact", "DOB", "Date Of Join", "Date Of Leave", "Password", "Role" };

			ServletOutputStream outputStream = response.getOutputStream();
			MasterTemplate<LoginMaster> excelExporter = new MasterTemplate<>(outputStream, "Login Master", headerList,
					this.datList);
			excelExporter.export();

		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@PostMapping("/getLikeUserMaster/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeUserMaster(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody LoginMaster masterObject) {
		try {
			System.out.println(masterObject);
			Pageable pageable = PageRequest.of(page, pageSize);
			String roleName = masterObject.getRole() != null ? masterObject.getRole().getRoleName() : null;
			String deptName = masterObject.getDepartment() != null ? masterObject.getDepartment().getDepartmentName()
					: null;
			String plantCode = masterObject.getPlant() != null ? masterObject.getPlant().getPlantCode() : null;

			String loggedInEmployeeId = masterObject.getCreatedBy(); // assume this is coming from session
			Page<LoginMaster> pagableObject = this.loginMasterRepositoryObject.getLikeLogin(roleName, deptName,
					plantCode, masterObject.getEmployeeId(), masterObject.getFirstName(), masterObject.getLastName(),
					masterObject.getEmail(), masterObject.getContact(), masterObject.getCreatedBy(), loggedInEmployeeId, // used
																															// as
																															// exclusion
																															// filter
					pageable);

			return new ResponseEntity<>(pagableObject, HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/getUserNameByEmployeeId")
	public ResponseEntity<Object> getUserNameByEmployeeId(@RequestBody LoginMaster loginMasterJsonObject) {
		Optional<LoginMaster> loginMasterobjectLoginMaster = this.loginMasterRepositoryObject
				.findById(loginMasterJsonObject.getLoginId());
		return new ResponseEntity<>(loginMasterobjectLoginMaster, HttpStatus.OK);
	}

	@PatchMapping("/editPersonalLoginMaster")
	public ResponseEntity<Object> editPersonalLoginMaster(@RequestBody LoginMaster loginJsonObject) {

		try {

			loginJsonObject.setDateTime(dateTimeService.getCurrentDateAndTime());
			loginJsonObject.setPassword(new BCryptPasswordEncoder().encode(loginJsonObject.getPassword()));

			this.loginMasterRepositoryObject.updateLoginMaster(loginJsonObject.getFirstName(),
					loginJsonObject.getLastName(), loginJsonObject.getEmail(), loginJsonObject.getContact(),
					loginJsonObject.getDob(), loginJsonObject.getPassword(), loginJsonObject.getLoginId());
			return new ResponseEntity<>("User updated successfully.", HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<Object>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getMasterAuthorityByRole/{employeeId}")
	public ResponseEntity<Object> getMasterAuthorityByRole(@PathVariable String employeeId) {

		String objectmaster = this.loginMasterRepositoryObject.getMasterAuthorizationByEmployeeId(employeeId);
		List<String> module = new ArrayList<>(); /* = this.masterDetailsRepositoryObject.getAllModule(); */

		String[] list = objectmaster.split("-");

		List<MasterDetails> masterObject = new ArrayList<>();

		for (String masterId : list) {

			String[] idList = masterId.split(",");

			MasterDetails object = this.masterDetailsRepositoryObject.getDataById(Integer.parseInt(idList[0]));
			if (!module.contains(object.getModule())) {
				module.add(object.getModule());
			}
			masterObject.add(object);
		}

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("masterId", masterObject);
		responseMap.put("modules", module);

		return new ResponseEntity<>(responseMap, HttpStatus.OK);
	}

}
