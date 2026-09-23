package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import web.minda.project.entity.RoleAuthorityMaster;
import web.minda.project.entity.RoleMaster;

public interface RoleAuthorityMasterRepository extends CrudRepository<RoleAuthorityMaster, Long> {

	boolean existsByMasterNameAndRole(String masterName, RoleMaster role);

	Optional<RoleAuthorityMaster> findByMasterName(String masterName);

	List<RoleAuthorityMaster> findByRole(RoleMaster role);

	@Query(value = "SELECT a.* FROM role_authority_master as a LEFT JOIN role_master as b ON a.role_id = b.id "
			+ "WHERE (:roleName IS NULL OR b.role_name LIKE %:roleName%) "
			+ "AND (:masterName IS NULL OR a.master_name LIKE %:masterName%) "
			+ "AND (:createdBy IS NULL OR a.created_by LIKE %:createdBy%) ", countQuery = "SELECT COUNT(*) FROM role_authority_master as a LEFT JOIN role_master as b ON a.role_id = b.id "
					+ "WHERE (:roleName IS NULL OR b.role_name LIKE %:roleName%) "
					+ "AND (:masterName IS NULL OR a.master_name LIKE %:master_name%) "
					+ "AND   (:createdBy IS NULL OR a.created_by LIKE %:createdBy%) ", nativeQuery = true)
	Page<RoleAuthorityMaster> getLikeRoleAuthority(@Param("roleName") String roleName,
			@Param("masterName") String masterName, @Param("createdBy") String createdBy, Pageable pageable);

	@Query(value = "SELECT a.master_name FROM role_authority_master as a "
			+ "LEFT JOIN role_master as b ON a.role_id = b.id "
			+ "LEFT JOIN department_master as c ON a.department_id = c.id "
			+ "WHERE (:roleName IS NULL OR b.role_name LIKE %:roleName%) "
			+ "AND (:departmentName IS NULL OR c.department_name LIKE %:departmentName%) ", nativeQuery = true)
	List<Object[]> getAuthorityByRoleNameAndDepartment(@Param("roleName") String roleName, @Param("departmentName") String departmentName);

}
