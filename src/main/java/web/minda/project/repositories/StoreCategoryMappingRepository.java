package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import web.minda.project.entity.StoreCategoryMapping;

public interface StoreCategoryMappingRepository  extends JpaRepository<StoreCategoryMapping, Long>{
	

	
	@Query(value="SELECT * FROM store_category_Mapping_master ",nativeQuery = true)
	List<StoreCategoryMapping> getAllStoreCategoryMappingMasters();

//	@Query(value="select * from store_category_Mapping_master  WHERE id = :storeCategoryMappingId",nativeQuery = true)
//	public StoreCategoryMapping findByStoreCategoryMappingIds(@Param("storeCategoryMappingId") Long storeCategoryMappingId);
//	


	
	@Query(value="""
			SELECT * FROM store_category_Mapping_master scmm left join store_material_category_master smcm on smcm.id=scmm.category_id
			left join process_Master pm on pm.id=scmm.process_id
			 where pm.process_name =:process_name
			""",nativeQuery = true)
	List<StoreCategoryMapping> getAllCategoryFromProcess(@Param("process_name") String process_name);
	
	
	@Query(value="""
			SELECT * FROM store_category_Mapping_master scmm left join store_material_category_master smcm on smcm.id=scmm.category_id
			left join process_Master pm on pm.id=scmm.process_id
			 where smcm.category =:category
			""",nativeQuery = true)
	List<StoreCategoryMapping> getAllProcessFromCategory(@Param("category") String category);
	
	
	Optional<StoreCategoryMapping> findByStoreCategoryMappingId(Long storeCategoryMappingId);
	Optional<StoreCategoryMapping> findByProcess_ProcessName(String processName);
	Optional<StoreCategoryMapping> findByCategory_Category(String category);
	Optional<StoreCategoryMapping>  findByProcess_ProcessNameAndCategory_Category(String processName,String category);


	boolean existsByStoreCategoryMappingId(Long Id);
	boolean existsByProcess_ProcessName(String processName);
	boolean existsByCategory_Category(String category);
	boolean existsByProcess_ProcessNameAndCategory_Category(String processName,String category);
	
	
	@Query(value = """
			SELECT CONCAT_WS(';',pm.process_name,smcm.category,scmm.status,scmm.created_by,
			 scmm.date_time_modified) FROM store_category_Mapping_master scmm left join store_material_category_master smcm on smcm.id=scmm.category_id
			left join process_Master pm on pm.id=scmm.process_id
			""",
		       nativeQuery = true)
		List<StoreCategoryMapping> getalldata();

	@Query(
		    value = """
		    SELECT scmm.* FROM store_category_Mapping_master scmm
		    LEFT JOIN store_material_category_master smcm ON smcm.id = scmm.category_id
		    LEFT JOIN process_master pm ON pm.id = scmm.process_id
		    WHERE (:category IS NULL OR :category = '' OR LOWER(smcm.category) LIKE LOWER(CONCAT('%', :category, '%')))
		    AND (:processName IS NULL OR :processName = '' OR LOWER(pm.process_name) LIKE LOWER(CONCAT('%', :processName, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(scmm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(scmm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    countQuery = """
		    SELECT COUNT(*) FROM store_category_Mapping_master scmm
		    LEFT JOIN store_material_category_master smcm ON smcm.id = scmm.category_id
		    LEFT JOIN process_master pm ON pm.id = scmm.process_id
		    WHERE (:category IS NULL OR :category = '' OR LOWER(smcm.category) LIKE LOWER(CONCAT('%', :category, '%')))
		    AND (:processName IS NULL OR :processName = '' OR LOWER(pm.process_name) LIKE LOWER(CONCAT('%', :processName, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(scmm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(scmm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    nativeQuery = true
		)
			Page<StoreCategoryMapping> getLikeStoreMaterialMapping(
			        @Param("category") String category,
			        @Param("processName") String processName,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);

	boolean existsByProcess_ProcessNameAndCategory_CategoryAndStoreCategoryMappingIdNot(String processName,
			String category, Long storeCategoryMappingId);

//	@Query(value = """
//	        SELECT * FROM store_category_Mapping_master scmm left join store_material_category_master smcm on smcm.id=scmm.category_id
//			left join process_Master pm on pm.id=scmm.process_id
//	        WHERE (:category IS NULL OR :category = '' OR smcm.category LIKE CONCAT('%', :category, '%'))
//	        AND (:processName IS NULL OR :processName = '' OR pm.process_name LIKE CONCAT('%', :processName, '%'))
//	        AND (:status IS NULL OR :status = '' OR scmm.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR scmm.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<StoreCategoryMapping> getLikeStoreMaterialMapping(
//	        @Param("category") String category,
//	        @Param("processName") String processName,	
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);



}
