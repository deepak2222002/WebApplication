package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.RackMaster;
import web.minda.project.entity.StoreMaterial;

public interface RackMasterRepository extends JpaRepository<RackMaster, Long> {

	@Query(value="""
			select location_name from rack_master 
			""",nativeQuery = true)
	public List<String> getAllRackMasterList();
	
	
	@Query(value="SELECT * FROM rack_master ",nativeQuery = true)
	List<RackMaster> getAllRackMasters();
	
	@Query(value="""
			select rack_name from rack_master GROUP BY rack_name
			""",nativeQuery = true)
	public List<String> getAllRackCodeInList();
	
	

//	@Query(value="select * from rack_master  WHERE id = :rackId",nativeQuery = true)
//	public LocationMaster findByRackIds(@Param("rackId") Long rackId);
//	
//	@Query(value="select * from rack_master  WHERE binName = :binName",nativeQuery = true)
//	public LocationMaster findByBinNames(@Param("binName") Long binName);

	
	@Query(value="""
			SELECT * FROM rack_master rm left join location_master lm on lm.id=rm.location_id where lm.location_name =:location_name
			""",nativeQuery = true)
	List<RackMaster> getAllBinFromLocation(@Param("location_name") String location_name);
	
	
	Optional<RackMaster> findByRackId(Long rackId);
	Optional<RackMaster> findByBinName(String binName);
	Optional<RackMaster>  findByBinNameAndLocation_LocationName(String binName,String locationName);


	boolean existsByRackId(Long Id);
	boolean existsByBinName(String binName);
	boolean existsByBinNameAndLocation_LocationName(String binName,String locationName);
	
	boolean existsByRackNameAndRackCodeAndLocation_LocationName(String rackName, String rackCode ,String locationName);
	
	boolean existsByRackCode(String rackCode);
	
	
	@Query(value = """
			SELECT CONCAT_WS(';',lm.location_name,rm.bin_name,rm.status,rm.created_by,
			 rm.date_time_modified) FROM rack_master rm left join location_master lm on lm.id = rm.location_id
			""",
		       nativeQuery = true)
		List<RackMaster> getalldata();

	@Query(
			value = """
			SELECT rm.*
			FROM rack_master rm
			LEFT JOIN location_master lm ON lm.id = rm.location_id
			WHERE (:locationName IS NULL OR :locationName = '' OR lm.location_name LIKE '%' + :locationName + '%')
			AND (:rackName IS NULL OR :rackName = '' OR rm.rack_name LIKE '%' + :rackName + '%')
			AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
			AND (:status IS NULL OR :status = '' OR rm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR rm.created_by LIKE '%' + :createdBy + '%')
			""",
			countQuery = """
			SELECT COUNT(*)
			FROM rack_master rm
			LEFT JOIN location_master lm ON lm.id = rm.location_id
			WHERE (:locationName IS NULL OR :locationName = '' OR lm.location_name LIKE '%' + :locationName + '%')
			AND (:rackName IS NULL OR :rackName = '' OR rm.rack_name LIKE '%' + :rackName + '%')
			AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
			AND (:status IS NULL OR :status = '' OR rm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR rm.created_by LIKE '%' + :createdBy + '%')
			""",
			nativeQuery = true
			)
			Page<RackMaster> getLikeRack(
			        @Param("locationName") String locationName,
			        @Param("rackName") String rackName,
			        @Param("rackCode") String rackCode,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);

//	@Query(value = """
//	        SELECT * FROM rack_master rm left join location_master lm on lm.id = rm.location_id
//	        WHERE (:locationName IS NULL OR :locationName = '' OR lm.location_name LIKE CONCAT('%', :locationName, '%'))
//	        AND (:binName IS NULL OR :binName = '' OR rm.bin_name LIKE CONCAT('%', :binName, '%'))
//	        AND (:status IS NULL OR :status = '' OR rm.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR rm.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<RackMaster> getLikeRack(
//	        @Param("locationName") String locationName,
//	        @Param("binName") String binName,	
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);


	public boolean existsByBinNameAndLocation_LocationNameAndRackIdNot(String binName, String locationName,
			Long rackId);
	
	@Query(value = """
		    SELECT rm.*
		    FROM rack_master rm
		    LEFT JOIN location_master lm ON lm.id = rm.location_id
		    WHERE (:locationName IS NULL OR :locationName = '' 
		           OR LOWER(lm.location_name) LIKE LOWER(CONCAT('%', :locationName, '%')))
		    AND (:binName IS NULL OR :binName = '' 
		         OR LOWER(rm.bin_name) LIKE LOWER(CONCAT('%', :binName, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(rm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(rm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<RackMaster> getAllRackMaster(
		        @Param("locationName") String locationName,
		        @Param("binName") String binName,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);
	
	
	public Optional<RackMaster> findByRackName(String barcode);


	public Optional<RackMaster> findByRackCode(String barcode);


	public Optional<RackMaster> findByRackCodeIgnoreCase(String barcode);


	public Optional<RackMaster> findByRackCodeAndLocation_LocationName(String locationBarcode, String string);


}
