package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.MouldPreventiveMaintenanceMaster;
import web.minda.project.entity.MouldPreventiveMaintenanceMaster;

public interface MouldPreventiveMaintenanceMasterRepository extends JpaRepository<MouldPreventiveMaintenanceMaster, Long> {
	

	@Query(value = """
			SELECT mpmm.*
			FROM mould_preventive_maintenance_master mpmm
			LEFT JOIN mould_childpart_master mcpm ON mcpm.id = mpmm.mould_childpart_id
			WHERE (:mouldName IS NULL OR :mouldName = '' OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR mpmm.child_part_name LIKE '%' + :childPartName + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mpmm.created_by LIKE '%' + :createdBy + '%')


			""", countQuery = """
			SELECT COUNT(*)
			FROM mould_preventive_maintenance_master mpmm
			LEFT JOIN mould_childpart_master mcpm ON mcpm.id = mpmm.mould_childpart_id
			WHERE (:mouldName IS NULL OR :mouldName = '' OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR mpmm.child_part_name LIKE '%' + :childPartName + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mpmm.created_by LIKE '%' + :createdBy + '%')

			""", nativeQuery = true)
	Page<MouldPreventiveMaintenanceMaster> getLikeMouldPreventiveMaintenance(@Param("mouldName") String mouldName,
			@Param("childPartName") String childPartName, @Param("createdBy") String createdBy, Pageable pageable);

//	@Query(value = """
//	        SELECT * FROM mould_preventive_maintenance_master mpmm left join mould_childpart_master mcpm on mcpm.id = mpmm.mould_childpart_id
//	        WHERE (:mouldName IS NULL OR :mouldName = '' OR mcpm.location_name LIKE CONCAT('%', :mouldName, '%'))
//	        AND (:binName IS NULL OR :binName = '' OR mpmm.bin_name LIKE CONCAT('%', :binName, '%'))
//	        AND (:status IS NULL OR :status = '' OR mpmm.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR mpmm.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<RackMaster> getLikeRack(
//	        @Param("mouldName") String mouldName,
//	        @Param("binName") String binName,	
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
//
//	public boolean existsByBinNameAndLocation_LocationNameAndRackIdNot(String binName, String mouldName, Long rackId);
//	
//	@Query(value = """
//		    SELECT mpmm.*
//		    FROM mould_preventive_maintenance_master mpmm
//		    LEFT JOIN mould_childpart_master mcpm ON mcpm.id = mpmm.mould_childpart_id
//		    WHERE (:mouldName IS NULL OR :mouldName = '' 
//		           OR LOWER(mcpm.location_name) LIKE LOWER(CONCAT('%', :mouldName, '%')))
//		    AND (:binName IS NULL OR :binName = '' 
//		         OR LOWER(mpmm.bin_name) LIKE LOWER(CONCAT('%', :binName, '%')))
//		    AND (:status IS NULL OR :status = '' 
//		         OR LOWER(mpmm.status) LIKE LOWER(CONCAT('%', :status, '%')))
//		    AND (:createdBy IS NULL OR :createdBy = '' 
//		         OR LOWER(mpmm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
//		    """,
//		    nativeQuery = true
//		)
//		List<RackMaster> getAllRackMaster(
//		        @Param("mouldName") String mouldName,
//		        @Param("binName") String binName,
//		        @Param("status") String status,
//		        @Param("createdBy") String createdBy
//		);

	@Query(value = """
			SELECT mpmm.*
			FROM mould_preventive_maintenance_master mpmm
			LEFT JOIN mould_childpart_master mcpm ON mcpm.id = mpmm.mould_childpart_id
			WHERE (:mouldName IS NULL OR :mouldName = '' OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR mpmm.child_part_name LIKE '%' + :childPartName + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mpmm.created_by LIKE '%' + :createdBy + '%')
			""", nativeQuery = true)
	List<MouldPreventiveMaintenanceMaster> getAllMouldPreventiveMaintenanceMaster(@Param("mouldName") String mouldName,
			@Param("childPartName") String childPartName, @Param("createdBy") String createdBy);

	public Optional<MouldPreventiveMaintenanceMaster> findByChildPartName(String childPartName);
	public Optional<MouldPreventiveMaintenanceMaster> findByMouldNameAndChildPartName(String mouldName, String childPartName);

//	public Optional<MouldPreventiveMaintenanceMaster> findByChildPartType(String mouldChildPartType);

	public boolean existsByChildPartName(String childPartName);
	public boolean existsByMouldNameAndChildPartName(String mouldName, String childPartName);

	public boolean existsByMouldNameAndPreventiveMaintenanceIdNot(String mouldName, Long preventiveMaintenanceId);

}
