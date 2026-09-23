package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.DepartmentMaster;

public interface DepartmentMasterRepository extends CrudRepository<DepartmentMaster, Long> {
	
	Optional<DepartmentMaster> findByDepartmentName(String departmentName);

	@Query("select d_m.departmentId, d_m.departmentName from DepartmentMaster d_m")
	public List<String> getAllDepartment();
	
	@Query("select d_m.departmentName from DepartmentMaster d_m")
	public List<String> getAllDepartmentName();

	@Query("select d_m.departmentName from DepartmentMaster d_m where d_m.departmentId= :departmentId")
	public String getDepartmentNameById(@Param("departmentId") Long departmentId);

	@Query(value = "Select * FROM department_master", nativeQuery = true)
	Page<DepartmentMaster> getalldata1(Pageable pageable);

//	@Query("Select CONCAT_WS(';', d_m.departmentName, d_m.createdBy, d_m.dateTimeCreation ) FROM DepartmentMaster d_m")
//	List<String> getalldata();

	@Query(value = "SELECT TOP 1 id FROM department_master ORDER BY id DESC", nativeQuery = true)
	String getLastId();

	boolean existsByDepartmentName(String departmentname);

	@Query(value = "SELECT * FROM department_master x where (x.department_name is null or x.department_name like %:department_name%) ;", nativeQuery = true)
	public Page<DepartmentMaster> getLikeDepartment(@Param("department_name") String department_name,
			Pageable pageable);
	
	@Query(value = "SELECT * FROM department_master x where (x.department_name is null or x.department_name like %:department_name%) "
			+ "AND (x.created_by is null or x.created_by like %:created_by%) ;", nativeQuery = true)
		public Page<DepartmentMaster> getLikeDepartment(@Param("department_name") String department_name, @Param("created_by") String created_by, Pageable pageable);

	
	@Query("select d_m.departmentId, d_m.departmentName from DepartmentMaster d_m WHERE d_m.departmentName NOT LIKE '%SUPER ADMIN%'")
	public List<String> getAllDepartmentForTraning();
	
	@Query(value = "SELECT * FROM department_master x " +
	        "WHERE (:department_name IS NULL OR :department_name = '' OR LOWER(x.department_name) LIKE LOWER(CONCAT('%', :department_name, '%'))) " +
	        "AND (:created_by IS NULL OR :created_by = '' OR LOWER(x.created_by) LIKE LOWER(CONCAT('%', :created_by, '%')))",
	        nativeQuery = true)
	List<DepartmentMaster> getAllDepartmentMaster(
	        @Param("department_name") String department_name,
	        @Param("created_by") String created_by);
}
