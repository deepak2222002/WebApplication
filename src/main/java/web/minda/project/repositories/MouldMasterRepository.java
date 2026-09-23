package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.ProductionMouldMaster;
import web.minda.project.entity.MouldMaster;

public interface MouldMasterRepository extends JpaRepository<MouldMaster, Long> {
	
	@Query(value="""
			select mould_name from mould_master 
			""",nativeQuery = true)
	public List<String> getAllMouldNameInList();

	@Query(value = """
			SELECT mm.*
			FROM mould_master mm
			LEFT JOIN supplier_master sm ON sm.id = mm.supplier_id
			WHERE (:supplierName IS NULL OR :supplierName = '' OR mm.supplier_name LIKE '%' + :supplierName + '%')
			AND (:mouldName IS NULL OR :mouldName = '' OR mm.mould_name LIKE '%' + :mouldName + '%')
			AND (:description IS NULL OR :description = '' OR mm.description LIKE '%' + :description + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mm.created_by LIKE '%' + :createdBy + '%')

			""", countQuery = """
			SELECT COUNT(*)
			FROM mould_master mm
			LEFT JOIN supplier_master sm ON sm.id = mm.supplier_id
			WHERE (:supplierName IS NULL OR :supplierName = '' OR mm.supplier_name LIKE '%' + :supplierName + '%')
			AND (:mouldName IS NULL OR :mouldName = '' OR mm.mould_name LIKE '%' + :mouldName + '%')
			AND (:description IS NULL OR :description = '' OR mm.description LIKE '%' + :description + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mm.created_by LIKE '%' + :createdBy + '%')

			""", nativeQuery = true)
	Page<MouldMaster> getLikeMould(@Param("supplierName") String supplierName,
			@Param("mouldName") String mouldName, @Param("description") String description, 
			@Param("createdBy") String createdBy, Pageable pageable);

//	@Query(value = """
//	        SELECT * FROM mould_master mm left join supplier_master sm on sm.id = mm.supplier_id
//	        WHERE (:mouldName IS NULL OR :mouldName = '' OR sm.location_name LIKE CONCAT('%', :mouldName, '%'))
//	        AND (:binName IS NULL OR :binName = '' OR mm.bin_name LIKE CONCAT('%', :binName, '%'))
//	        AND (:status IS NULL OR :status = '' OR mm.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR mm.created_by LIKE CONCAT('%', :createdBy, '%'))
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
//		    SELECT mm.*
//		    FROM mould_master mm
//		    LEFT JOIN supplier_master sm ON sm.id = mm.supplier_id
//		    WHERE (:mouldName IS NULL OR :mouldName = '' 
//		           OR LOWER(sm.location_name) LIKE LOWER(CONCAT('%', :mouldName, '%')))
//		    AND (:binName IS NULL OR :binName = '' 
//		         OR LOWER(mm.bin_name) LIKE LOWER(CONCAT('%', :binName, '%')))
//		    AND (:status IS NULL OR :status = '' 
//		         OR LOWER(mm.status) LIKE LOWER(CONCAT('%', :status, '%')))
//		    AND (:createdBy IS NULL OR :createdBy = '' 
//		         OR LOWER(mm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
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
			SELECT mm.*
			FROM mould_master mm
			LEFT JOIN supplier_master sm ON sm.id = mm.supplier_id
			WHERE (:supplierName IS NULL OR :supplierName = '' OR mm.supplier_name LIKE '%' + :supplierName + '%')
			AND (:mouldName IS NULL OR :mouldName = '' OR mm.mould_name LIKE '%' + :mouldName + '%')
			AND (:description IS NULL OR :description = '' OR mm.description LIKE '%' + :description + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mm.created_by LIKE '%' + :createdBy + '%')
			""", nativeQuery = true)
	List<MouldMaster> getAllMouldMaster(@Param("supplierName") String supplierName,
			@Param("mouldName") String mouldName, @Param("description") String description,
			@Param("createdBy") String createdBy);

	public Optional<MouldMaster> findByMouldName(String mouldName);

	public Optional<MouldMaster> findBySupplierName(String supplierName);

	public boolean existsByMouldName(String mouldName);

	public boolean existsByMouldNameAndMouldIdNot(String mouldName, Long mouldId);
	
	
	List<MouldMaster> findByMouldNameIn(List<String> mouldList);

}
