package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.PlantMaster;
import web.minda.project.entity.RoleMaster;

public interface LoginMasterRepository extends CrudRepository<LoginMaster, Long> {

	@Query("SELECT DISTINCT CONCAT(lm.department.departmentName, ',', lm.department.id) " + "FROM LoginMaster lm "
			+ "WHERE lm.plant.id = :plantId ")
	List<String> findDistinctDepartmentsByPlantIdAndActive(@Param("plantId") Long plantId);

	@Query("""
			    SELECT lm
			    FROM LoginMaster lm
			    WHERE lm.plant.id = :plantId
			      AND lm.department.id = :deptId
			      AND (lm.dateOfLeaving IS NULL OR lm.dateOfLeaving = '')
			""")
	List<LoginMaster> getActiveUsersByPlantAndDepartment(@Param("plantId") Long plantId, @Param("deptId") Long deptId);

	/*
	 * @Query("select l_m.loginId, l_m.employeeId from LoginMaster l_m") public
	 * List<String> getAllEmployeeId();
	 * 
	 * @Query("select l_m from LoginMaster l_m where l_m.employeeId =: employeeId and l_m.password =: password"
	 * ) public LoginMaster
	 * getLoginMasterByEmployeeIdAndPassword(@Param("employeeId") String employeeId,
	 * 
	 * @Param("password") String password);
	 */
	@Query("select l_m.loginId, l_m.employeeId from LoginMaster l_m")
	public List<String> getAllEmployeeId();

	@Query("select l_m.password from LoginMaster l_m where l_m.employeeId= :employeeId")
	public String getEmployeePassword(@Param("employeeId") String employeeId);

	@Query("select l_m.firstName from LoginMaster l_m where l_m.employeeId= :employeeId")
	public String getEmployeeName(@Param("employeeId") String employeeId);

	@Query(value = "SELECT CONCAT(first_name, ' ', last_name) FROM traceability.login_master WHERE employee_id = :employeeId", nativeQuery = true)
	String findFullNameByEmployeeId(@Param("employeeId") String employeeId);

	@Modifying(clearAutomatically = true)
	@Transactional
	@Query("update LoginMaster l_m set l_m.firstName= :firstName, l_m.lastName= :lastName, l_m.email= :email, l_m.contact= :contact, l_m.dob= :dob, l_m.password= :password where l_m.loginId= :loginId")
	public void updateLoginMaster(@Param("firstName") String firstName, @Param("lastName") String lastName,
			@Param("email") String email, @Param("contact") String contact, @Param("dob") String dob,
			@Param("password") String password, @Param("loginId") Long loginId);

	@Query("select l_m.department.departmentId, l_m.department.departmentName from LoginMaster l_m where l_m.employeeId= :employeeId")
	public List<String> getDepartmentIdAndName(String employeeId);

	@Query("select l_m.department.departmentName from LoginMaster l_m where l_m.employeeId = :employeeId")
	public String getDepartmentNameById(@Param("employeeId") String employeeId);

	@Query("select l_m.role.roleName from LoginMaster l_m where l_m.employeeId = :employeeId")
	public String getRoleById(@Param("employeeId") String employeeId);

	@Query("select l_m.department.departmentId from LoginMaster l_m where l_m.employeeId = :employeeId")
	public String getDepartmentById(@Param("employeeId") String employeeId);

	@Query("select l_m from LoginMaster l_m where l_m.employeeId = :employeeId and l_m.password = :password")
	public LoginMaster getLoginMasterByEmployeeIdAndPassword(@Param("employeeId") String employeeId,
			@Param("password") String password);

	@Query("select l_m from LoginMaster l_m where l_m.employeeId = :employeeId ")
	public LoginMaster findByEmployeeIds(@PathVariable("employeeId") String employeeId);

	@Query("select l_m.authorization from LoginMaster l_m where l_m.employeeId = :employeeId")
	public String getMasterAuthorizationByEmployeeId(@PathVariable("employeeId") String employeeId);

	@Query("select l_m.reportAuthorization from LoginMaster l_m where l_m.employeeId = :employeeId")
	public String getReportAuthorizationByEmployeeId(@PathVariable("employeeId") String employeeId);

	@Query("select l_m.plant.plantCode ,l_m.title, l_m.firstName, l_m.lastName, l_m.email, l_m.employeeId, l_m.contact, l_m.dob, l_m.dateOfJoining, l_m.dateOfLeaving, l_m.createdBy, l_m.dateTime, l_m.password, l_m.role from LoginMaster l_m ")
	List<String> getalldata();

	@Query("select l_m from LoginMaster l_m where l_m.role>(select l_m from RoleMaster l_m where l_m.roleName= :roleName) and l_m.department= :department order by l_m.department,l_m.role")
	Page<LoginMaster> getalldata1(@Param("roleName") String roleName, @Param("department") DepartmentMaster department,
			Pageable pageable);

	@Query("select l_m from LoginMaster l_m where l_m.role>=(select l_m from RoleMaster l_m where l_m.roleName= :roleName) and l_m.department> :department order by l_m.department,l_m.role ")
	Page<LoginMaster> getalldata2(@Param("roleName") String roleName, @Param("department") DepartmentMaster department,
			Pageable pageable);

	boolean existsByPlant(PlantMaster plant);

	Optional<LoginMaster> findByEmployeeId(String employeeId);

	boolean existsByRole(RoleMaster role);

//	@Query(value = "SELECT x.*, y.role_name AS role_name_y FROM login_master as "
//			+ "x LEFT JOIN role_master y ON x.role_id = y.id LEFT JOIN plant_master z ON x.plant_id = z.id "
//			+ "LEFT JOIN department_master a ON x.department_id = a.id WHERE "
//			+ "(x.role_id IS NULL OR y.role_name LIKE %:role_name%)"
//			+ "AND (x.department_id IS NULL OR a.department_name LIKE %:department_name%)"
//			+ "AND (x.plant_id IS NULL OR z.plant_code LIKE %:plant_code%)"
//			+ "AND (x.employee_id IS NULL OR x.employee_id LIKE %:employee_id%)"
//			+ "AND (x.first_name IS NULL OR x.first_name LIKE %:first_name%)"
//			+ "AND (x.last_name IS NULL OR x.last_name LIKE %:last_name%)"
//			+ "AND (x.email IS NULL OR x.email LIKE %:email%)"
//			+ "AND (x.contact IS NULL OR x.contact LIKE %:contact%)"
//			+ "AND (x.created_by IS NULL OR x.created_by LIKE %:created_by%)", nativeQuery = true)
//	public Page<LoginMaster> getLikeLogin( @Param("plant_code") String plant_code, @Param("department_name") String department_name, @Param("role_name") String role_name,
//			@Param("employee_id") String employee_id, @Param("first_name") String first_name, @Param("last_name") String last_name, @Param("email") String email,
//			@Param("contact") String contact, @Param("created_by") String created_by, Pageable pageable);

//	@Query(value = "SELECT x.*, y.role_name AS role_name_y FROM login_master as "
//			+ "x LEFT JOIN role_master as y ON x.role_id = y.id LEFT JOIN plant_master as z ON x.plant_id = z.id "
//			+ "LEFT JOIN department_master as a ON x.department_id = a.id WHERE "
//			+ "(x.role_id IS NULL OR y.role_name LIKE %:role_name%)"
//			+ "AND (x.department_id IS NULL OR a.department_name LIKE %:department_name%)"
//			+ "AND (x.plant_id IS NULL OR z.plant_code LIKE %:plant_code%)"
//			+ "AND (x.employee_id IS NULL OR x.employee_id LIKE %:employee_id%)"
//			+ "AND (x.first_name IS NULL OR x.first_name LIKE %:first_name%)"
//			+ "AND (x.last_name IS NULL OR x.last_name LIKE %:last_name%)"
//			+ "AND (x.email IS NULL OR x.email LIKE %:email%)" 
//			+ "AND (x.contact IS NULL OR x.contact LIKE %:contact%)"
//			+ "AND (x.created_by IS NULL OR x.created_by LIKE %:created_by%) "
//			+ "AND (x.employee_id NOT IN ('111','123',(:self)))",  nativeQuery = true)
//	public Page<LoginMaster> getLikeLogin(@Param("role_name") String role_name,
//			@Param("department_name") String department_name, @Param("plant_code") String plant_code,
//			@Param("employee_id") String employee_id, @Param("first_name") String first_name,
//			@Param("last_name") String last_name, @Param("email") String email, @Param("contact") String contact,
//			@Param("created_by") String created_by, @Param("self") String self, Pageable pageable);

//	@Query("SELECT lm FROM LoginMaster lm " +
//		       "LEFT JOIN lm.role r " +
//		       "LEFT JOIN lm.plant p " +
//		       "LEFT JOIN lm.department d " +
//		       "WHERE (:role_name IS NULL OR r.roleName LIKE CONCAT('%', :role_name, '%')) " +
//		       "AND (:department_name IS NULL OR d.departmentName LIKE CONCAT('%', :department_name, '%')) " +
//		       "AND (:plant_code IS NULL OR p.plantCode LIKE CONCAT('%', :plant_code, '%')) " +
//		       "AND (:search_employee_id IS NULL OR lm.employeeId LIKE CONCAT('%', :search_employee_id, '%')) " +
//		       "AND (:first_name IS NULL OR lm.firstName LIKE CONCAT('%', :first_name, '%')) " +
//		       "AND (:last_name IS NULL OR lm.lastName LIKE CONCAT('%', :last_name, '%')) " +
//		       "AND (:email IS NULL OR lm.email LIKE CONCAT('%', :email, '%')) " +
//		       "AND (:contact IS NULL OR lm.contact LIKE CONCAT('%', :contact, '%')) " +
//		       "AND (:created_by IS NULL OR lm.createdBy LIKE CONCAT('%', :created_by, '%')) " +
//		       "AND (:exclude_employee_id IS NULL OR lm.employeeId <> :exclude_employee_id) " +
//		       "AND lm.employeeId NOT IN ('111', '123')")
//		Page<LoginMaster> getLikeLogin(
//		    @Param("role_name") String roleName,
//		    @Param("department_name") String departmentName,
//		    @Param("plant_code") String plantCode,
//		    @Param("search_employee_id") String searchEmployeeId,
//		    @Param("first_name") String firstName,
//		    @Param("last_name") String lastName,
//		    @Param("email") String email,
//		    @Param("contact") String contact,
//		    @Param("created_by") String createdBy,
//		    @Param("exclude_employee_id") String excludeEmployeeId,
//		    Pageable pageable
//		);

//	
//	@Query("SELECT lm FROM LoginMaster lm " +
//		       "LEFT JOIN lm.role r " +
//		       "LEFT JOIN lm.plant p " +
//		       "LEFT JOIN lm.department d " +
//		       "WHERE 1 = 1")
//		Page<LoginMaster> getLikeLogin(
//			    @Param("role_name") String roleName,
//			    @Param("department_name") String departmentName,
//			    @Param("plant_code") String plantCode,
//			    @Param("search_employee_id") String searchEmployeeId,
//			    @Param("first_name") String firstName,
//			    @Param("last_name") String lastName,
//			    @Param("email") String email,
//			    @Param("contact") String contact,
//			    @Param("created_by") String createdBy,
//			    @Param("exclude_employee_id") String excludeEmployeeId,
//			    Pageable pageable
//			);

	@Query(
			value = """
			SELECT lm.*
			FROM login_master lm
			LEFT JOIN role_master r ON r.id = lm.role_id
			LEFT JOIN plant_master p ON p.id = lm.plant_id
			LEFT JOIN department_master d ON d.id = lm.department_id
			WHERE (:roleName IS NULL OR :roleName = '' OR r.role_name LIKE '%' + :roleName + '%')
			AND (:departmentName IS NULL OR :departmentName = '' OR d.department_name LIKE '%' + :departmentName + '%')
			AND (:plantCode IS NULL OR :plantCode = '' OR p.plant_code LIKE '%' + :plantCode + '%')
			AND (:searchEmployeeId IS NULL OR :searchEmployeeId = '' OR lm.employee_id LIKE '%' + :searchEmployeeId + '%')
			AND (:firstName IS NULL OR :firstName = '' OR lm.first_name LIKE '%' + :firstName + '%')
			AND (:lastName IS NULL OR :lastName = '' OR lm.last_name LIKE '%' + :lastName + '%')
			AND (:email IS NULL OR :email = '' OR lm.email LIKE '%' + :email + '%')
			AND (:contact IS NULL OR :contact = '' OR lm.contact LIKE '%' + :contact + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR lm.created_by LIKE '%' + :createdBy + '%')
			AND (:excludeEmployeeId IS NULL OR :excludeEmployeeId = '' OR lm.employee_id <> :excludeEmployeeId)
			""",

			countQuery = """
			SELECT COUNT(*)
			FROM login_master lm
			LEFT JOIN role_master r ON r.id = lm.role_id
			LEFT JOIN plant_master p ON p.id = lm.plant_id
			LEFT JOIN department_master d ON d.id = lm.department_id
			WHERE (:roleName IS NULL OR :roleName = '' OR r.role_name LIKE '%' + :roleName + '%')
			AND (:departmentName IS NULL OR :departmentName = '' OR d.department_name LIKE '%' + :departmentName + '%')
			AND (:plantCode IS NULL OR :plantCode = '' OR p.plant_code LIKE '%' + :plantCode + '%')
			AND (:searchEmployeeId IS NULL OR :searchEmployeeId = '' OR lm.employee_id LIKE '%' + :searchEmployeeId + '%')
			AND (:firstName IS NULL OR :firstName = '' OR lm.first_name LIKE '%' + :firstName + '%')
			AND (:lastName IS NULL OR :lastName = '' OR lm.last_name LIKE '%' + :lastName + '%')
			AND (:email IS NULL OR :email = '' OR lm.email LIKE '%' + :email + '%')
			AND (:contact IS NULL OR :contact = '' OR lm.contact LIKE '%' + :contact + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR lm.created_by LIKE '%' + :createdBy + '%')
			AND (:excludeEmployeeId IS NULL OR :excludeEmployeeId = '' OR lm.employee_id <> :excludeEmployeeId)
			""",

			nativeQuery = true
			)
			Page<LoginMaster> getLikeLogin(
			        @Param("roleName") String roleName,
			        @Param("departmentName") String departmentName,
			        @Param("plantCode") String plantCode,
			        @Param("searchEmployeeId") String searchEmployeeId,
			        @Param("firstName") String firstName,
			        @Param("lastName") String lastName,
			        @Param("email") String email,
			        @Param("contact") String contact,
			        @Param("createdBy") String createdBy,
			        @Param("excludeEmployeeId") String excludeEmployeeId,
			        Pageable pageable
			);

	@Query("select l_m.department.departmentId, l_m.department.departmentName from LoginMaster l_m where l_m.employeeId = :employeeId")
	List<Object[]> getDepartmentIdAndName1(@Param("employeeId") String employeeId);

	// When using JPQL we don’t need to specify countQuery manually.
//	Spring Data JPA is smart enough to automatically generate the COUNT(*) query from the JPQL @Query

	@Query("select l_m.firstName from LoginMaster l_m")
	public List<String> getAllEmployee();

	//List<LoginMaster> findByRoleIn(List<String> roles);

	//List<LoginMaster>  findByRole(String string);
	
	List<LoginMaster>  findByRole_RoleName(String string);
	
	
}
