package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.MouldChildPartMaster;
import web.minda.project.entity.MouldChildPartMaster;

public interface MouldChildPartMasterRepository extends JpaRepository<MouldChildPartMaster, Long> {

	@Query(value = """
			SELECT child_part_name FROM mould_childpart_master WHERE
			(:mouldName IS NULL OR :mouldName = '' OR mould_name LIKE '%' + :mouldName + '%')
			""", nativeQuery = true)
	public List<String> getAllMouldChildPartInList(@Param("mouldName") String mouldName);

	@Query(value = """
			SELECT mcpm.*
			FROM mould_childpart_master mcpm
			LEFT JOIN mould_master mm ON mm.id = mcpm.mould_id
			WHERE (:mouldName IS NULL OR :mouldName = '' OR mcpm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR mcpm.child_part_name LIKE '%' + :childPartName + '%')
			AND (:childPartType IS NULL OR :childPartType = '' OR mcpm.child_part_type LIKE '%' + :childPartType + '%')
			AND (:description IS NULL OR :description = '' OR mcpm.description LIKE '%' + :description + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mcpm.created_by LIKE '%' + :createdBy + '%')


			""", countQuery = """
			SELECT COUNT(*)
			FROM mould_childpart_master mcpm
			LEFT JOIN mould_master mm ON mm.id = mcpm.mould_id
			WHERE (:mouldName IS NULL OR :mouldName = '' OR mcpm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR mcpm.child_part_name LIKE '%' + :childPartName + '%')
			AND (:childPartType IS NULL OR :childPartType = '' OR mcpm.child_part_type LIKE '%' + :childPartType + '%')
			AND (:description IS NULL OR :description = '' OR mcpm.description LIKE '%' + :description + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mcpm.created_by LIKE '%' + :createdBy + '%')

			""", nativeQuery = true)
	Page<MouldChildPartMaster> getLikeMouldChildPart(@Param("mouldName") String mouldName,
			@Param("childPartName") String childPartName, @Param("childPartType") String childPartType,
			@Param("description") String description, @Param("createdBy") String createdBy, Pageable pageable);

//	@Query(value = """
//	        SELECT * FROM mould_childpart_master mcpm left join mould_master mm on mm.id = mcpm.mould_id
//	        WHERE (:mouldName IS NULL OR :mouldName = '' OR mm.location_name LIKE CONCAT('%', :mouldName, '%'))
//	        AND (:binName IS NULL OR :binName = '' OR mcpm.bin_name LIKE CONCAT('%', :binName, '%'))
//	        AND (:status IS NULL OR :status = '' OR mcpm.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR mcpm.created_by LIKE CONCAT('%', :createdBy, '%'))
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
//		    SELECT mcpm.*
//		    FROM mould_childpart_master mcpm
//		    LEFT JOIN mould_master mm ON mm.id = mcpm.mould_id
//		    WHERE (:mouldName IS NULL OR :mouldName = '' 
//		           OR LOWER(mm.location_name) LIKE LOWER(CONCAT('%', :mouldName, '%')))
//		    AND (:binName IS NULL OR :binName = '' 
//		         OR LOWER(mcpm.bin_name) LIKE LOWER(CONCAT('%', :binName, '%')))
//		    AND (:status IS NULL OR :status = '' 
//		         OR LOWER(mcpm.status) LIKE LOWER(CONCAT('%', :status, '%')))
//		    AND (:createdBy IS NULL OR :createdBy = '' 
//		         OR LOWER(mcpm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
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
			SELECT mcpm.*
			FROM mould_childpart_master mcpm
			LEFT JOIN mould_master mm ON mm.id = mcpm.mould_id
			WHERE (:mouldName IS NULL OR :mouldName = '' OR mcpm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR mcpm.child_part_name LIKE '%' + :childPartName + '%')
			AND (:childPartType IS NULL OR :childPartType = '' OR mcpm.child_part_type LIKE '%' + :childPartType + '%')
			AND (:description IS NULL OR :description = '' OR mcpm.description LIKE '%' + :description + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mcpm.created_by LIKE '%' + :createdBy + '%')
			""", nativeQuery = true)
	List<MouldChildPartMaster> getAllMouldChildPartMaster(@Param("mouldName") String mouldName,
			@Param("childPartName") String childPartName, @Param("childPartType") String childPartType,
			@Param("description") String description, @Param("createdBy") String createdBy);

	public Optional<MouldChildPartMaster> findByChildPartName(String childPartName);

	public Optional<MouldChildPartMaster> findByChildPartType(String mouldChildPartType);

	public Optional<MouldChildPartMaster> findByMouldNameAndChildPartName(String mouldNameString, String childPartName);

	public boolean existsByChildPartName(String childPartName);

	public boolean existsByChildPartNameAndMouldChildPartIdNot(String childPartName, Long mouldChildPartId);

}
