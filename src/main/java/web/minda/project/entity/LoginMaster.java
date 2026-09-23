package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "login_master")
public class LoginMaster {

	@Id
	@Column(name = "id")
	private Long loginId;

	@Column(name = "title")
	private String title;
	
	@Column(name = "designation")
	private String designation;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "email")
	private String email;

	@Column(name = "employee_id")
	private String employeeId;

	@Column(name = "contact")
	private String contact;

	@Column(name = "dob")
	private String dob;

	@Column(name = "date_of_joining")
	private String dateOfJoining;

	@Column(name = "date_of_leaving")
	private String dateOfLeaving;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time")
	private String dateTime;

	@Column(name = "password")
	private String password;

	@ManyToOne
	private RoleMaster role;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "authorizations")
	private String authorization;

	@Column(name = "report_authorization")
	private String reportAuthorization;

	@ManyToOne
	private DepartmentMaster department;

	@ManyToOne
	private PlantMaster plant;

	public Long getLoginId() {
		return loginId;
	}

	public void setLoginId(Long loginId) {
		this.loginId = loginId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getDateOfJoining() {
		return dateOfJoining;
	}

	public void setDateOfJoining(String dateOfJoining) {
		this.dateOfJoining = dateOfJoining;
	}

	public String getDateOfLeaving() {
		return dateOfLeaving;
	}

	public void setDateOfLeaving(String dateOfLeaving) {
		this.dateOfLeaving = dateOfLeaving;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDateTime() {
		return dateTime;
	}

	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public RoleMaster getRole() {
		return role;
	}

	public void setRole(RoleMaster role) {
		this.role = role;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getAuthorization() {
		return authorization;
	}

	public void setAuthorization(String authorization) {
		this.authorization = authorization;
	}

	public String getReportAuthorization() {
		return reportAuthorization;
	}

	public void setReportAuthorization(String reportAuthorization) {
		this.reportAuthorization = reportAuthorization;
	}

	public DepartmentMaster getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentMaster department) {
		this.department = department;
	}

	public PlantMaster getPlant() {
		return plant;
	}

	public void setPlant(PlantMaster plant) {
		this.plant = plant;
	}

	public LoginMaster(Long loginId, String title, String designation, String firstName, String lastName, String email,
			String employeeId, String contact, String dob, String dateOfJoining, String dateOfLeaving, String status,
			String dateTime, String password, RoleMaster role, String createdBy, String authorization,
			String reportAuthorization, DepartmentMaster department, PlantMaster plant) {
		super();
		this.loginId = loginId;
		this.title = title;
		this.designation = designation;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.employeeId = employeeId;
		this.contact = contact;
		this.dob = dob;
		this.dateOfJoining = dateOfJoining;
		this.dateOfLeaving = dateOfLeaving;
		this.status = status;
		this.dateTime = dateTime;
		this.password = password;
		this.role = role;
		this.createdBy = createdBy;
		this.authorization = authorization;
		this.reportAuthorization = reportAuthorization;
		this.department = department;
		this.plant = plant;
	}

	public LoginMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	

}
