package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.PlantMaster;
import web.minda.project.entity.RoleMaster;

public interface RoleMasterRepository extends CrudRepository<RoleMaster, Long> {

	@Query("select r_m.roleId, r_m.roleName from RoleMaster r_m")
	public List<String> getAllRole();

	@Query("select r_m.roleId, r_m.roleName from RoleMaster r_m")
	public List<String> getAllRole2();

	@Query("select r_m.roleName from RoleMaster r_m")
	public List<String> getAllRoleInList();

	boolean existsByRoleName(String rolename);

	boolean existsById(Long roleId); // This already works because 'id' is the primary key

	Optional<RoleMaster> findByRoleName(String roleName);

//	@Query(value = "SELECT id FROM role_master order by id desc limit 1;", nativeQuery = true)
//	String getLastId();

	@Query(value = "SELECT TOP 1 id FROM role_master ORDER BY id DESC", nativeQuery = true)
	String getLastId();

//	@Query("select CONCAT_WS(';', r_m.roleName, r_m.createdBy, r_m.dateTime ) from RoleMaster r_m")
//	List<String> getalldata();
//
//	@Query("select CONCAT_WS(';', r_m.roleName, r_m.createdBy, r_m.dateTimeCreation, r_m.dateTimeModified) from RoleMaster r_m")
//	List<String> getalldata();

	@Query(value = "Select * FROM role_master", nativeQuery = true)
	Page<RoleMaster> getalldata1(Pageable pageable);

//	@Query(value = "SELECT * FROM role_master x where (x.role_name is null or x.role_name like %:role_name%) ;", nativeQuery = true)
//	public Page<RoleMaster> getLikeRole(@Param("role_name") String role_name, Pageable pageable);

	@Query(value = "SELECT * FROM role_master x where (x.role_name is null or x.role_name like %:role_name%) "
			+ "AND (x.created_by is null or x.created_by like %:created_by%) ;", nativeQuery = true)
	public Page<RoleMaster> getLikeRole(@Param("role_name") String role_name, @Param("created_by") String created_by,
			Pageable pageable);

	@Query(value = "SELECT * FROM role_master x "
			+ "WHERE (:role_name IS NULL OR :role_name = '' OR LOWER(x.role_name) LIKE LOWER(CONCAT('%', :role_name, '%'))) "
			+ "AND (:created_by IS NULL OR :created_by = '' OR LOWER(x.created_by) LIKE LOWER(CONCAT('%', :created_by, '%')))", nativeQuery = true)
	List<RoleMaster> getAllRoleMaster(@Param("role_name") String role_name, @Param("created_by") String created_by);

}
