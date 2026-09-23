package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.PlantMaster;

public interface LocationMasterRepository extends JpaRepository<LocationMaster,Long> {
	
	@Query(value="""
			select location_name from location_master 
			""",nativeQuery = true)
	public List<String> getAllLocationList();
	
	
	@Query(value="SELECT * FROM location_master ",nativeQuery = true)
	List<LocationMaster> getAllLocationMasters();

//	@Query(value="select * from location_master  WHERE id = :locationId",nativeQuery = true)
//	public LocationMaster findByLocationIds(@Param("locationId") Long locationId);
//	
//	@Query(value="select * from location_master  WHERE location_name = :locationName",nativeQuery = true)
//	public LocationMaster findByLocationNames(@Param("locationName") Long locationName);
//	
//	@Query(value="select * from location_master  WHERE code = :code",nativeQuery = true)
//	public LocationMaster findByCodes(@Param("code") Long code);
	
	
	Optional<LocationMaster> findByLocationId(Long locationId);
	Optional<LocationMaster> findByLocationName(String locationName);
	Optional<LocationMaster> findByCode(String code);


	boolean existsByLocationId(Long Id);
	
	boolean existsByLocationName(String locationName);
	
	boolean existsByCode(String Code);
	
	@Query(value = """
			SELECT CONCAT_WS(';',location_name, description, code, label_file_path, 
			maximum_racks, status, reprint,created_by,
			 date_time_modified) FROM location_master
			""",
		       nativeQuery = true)
		List<LocationMaster> getalldata();

	@Query(
			value = """
			SELECT * FROM location_master
			WHERE (:locationName IS NULL OR :locationName = '' OR location_name LIKE CONCAT('%', :locationName, '%'))
			AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
			AND (:code IS NULL OR :code = '' OR code LIKE CONCAT('%', :code, '%'))
			AND (:maximumRacks IS NULL OR :maximumRacks = '' OR maximum_racks LIKE CONCAT('%', :maximumRacks, '%'))
			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
			AND (:reprint IS NULL OR :reprint = '' OR reprint LIKE CONCAT('%', :reprint, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			countQuery = """
			SELECT COUNT(*) FROM location_master
			WHERE (:locationName IS NULL OR :locationName = '' OR location_name LIKE CONCAT('%', :locationName, '%'))
			AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
			AND (:code IS NULL OR :code = '' OR code LIKE CONCAT('%', :code, '%'))
			AND (:maximumRacks IS NULL OR :maximumRacks = '' OR maximum_racks LIKE CONCAT('%', :maximumRacks, '%'))
			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
			AND (:reprint IS NULL OR :reprint = '' OR reprint LIKE CONCAT('%', :reprint, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			nativeQuery = true
			)
			Page<LocationMaster> getLikeLocation(
			@Param("locationName") String locationName,
			@Param("description") String description,
			@Param("code") String code,
			@Param("maximumRacks") String maximumRacks,
			@Param("status") String status,
			@Param("reprint") String reprint,
			@Param("createdBy") String createdBy,
			Pageable pageable
			);

//	@Query(value = """
//	        SELECT * FROM location_master
//	        WHERE (:locationName IS NULL OR :locationName = '' OR location_name LIKE CONCAT('%', :locationName, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:code IS NULL OR :code = '' OR code LIKE CONCAT('%', :code, '%'))
//	        AND (:maximumRacks IS NULL OR :maximumRacks = '' OR code LIKE CONCAT('%', :maximumRacks, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:reprint IS NULL OR :reprint = '' OR reprint LIKE CONCAT('%', :reprint, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<LocationMaster> getLikeLocation(
//	        @Param("locationName") String locationName,
//	        @Param("description") String description,
//	        @Param("code") String code,
//	        @Param("maximumRacks") String maximumRacks,
//	        @Param("status") String status,
//	        @Param("reprint") String reprint,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);

	
	@Query(value = """
		    SELECT * FROM location_master lm
		    WHERE (:locationName IS NULL OR :locationName = '' 
		           OR LOWER(lm.location_name) LIKE LOWER(CONCAT('%', :locationName, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(lm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:code IS NULL OR :code = '' 
		         OR LOWER(lm.code) LIKE LOWER(CONCAT('%', :code, '%')))
		    AND (:maximumRacks IS NULL OR :maximumRacks = '' 
		         OR LOWER(lm.maximum_racks) LIKE LOWER(CONCAT('%', :maximumRacks, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(lm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:reprint IS NULL OR :reprint = '' 
		         OR LOWER(lm.reprint) LIKE LOWER(CONCAT('%', :reprint, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(lm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<LocationMaster> getAllLocationMaster(
		        @Param("locationName") String locationName,
		        @Param("description") String description,
		        @Param("code") String code,
		        @Param("maximumRacks") String maximumRacks,
		        @Param("status") String status,
		        @Param("reprint") String reprint,
		        @Param("createdBy") String createdBy
		);




}
