package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ShiftMaster;
import web.minda.project.entity.StoreMaterialCategoryMaster;

public interface StoreMaterialCategoryRepository extends JpaRepository<StoreMaterialCategoryMaster, Long>{
	
	@Query(value="""
			select category from store_material_category_master 
			""",nativeQuery = true)
	public List<String> getAllStoreMaterialCategoryMasterList();
	
	
	@Query(value="SELECT * FROM store_material_category_master ",nativeQuery = true)
	List<StoreMaterialCategoryMaster> getAllStoreMaterialCategoryMasters();


	Optional<StoreMaterialCategoryMaster> findByCategory(String category);
	
	Optional<StoreMaterialCategoryMaster> findByStoreMaterialCategoryId(Long storeMaterialCategoryId);

	boolean existsByCategory(String category);
	
	boolean existsByStoreMaterialCategoryId(Long storeMaterialCategoryId);
	
	
	@Query(value = """
				SELECT CONCAT_WS(';',category, description,created_by,
			 date_time_modified) FROM store_material_category_master
			""",
		       nativeQuery = true)
		List<StoreMaterialCategoryMaster> getalldata();

	@Query(
			value = """
			SELECT * FROM store_material_category_master
			WHERE (:category IS NULL OR :category = '' OR category LIKE CONCAT('%', :category, '%'))
			AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			countQuery = """
			SELECT COUNT(*) FROM store_material_category_master
			WHERE (:category IS NULL OR :category = '' OR category LIKE CONCAT('%', :category, '%'))
			AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			nativeQuery = true
			)
			Page<StoreMaterialCategoryMaster> getLikeStoreMaterialCategory(
			        @Param("category") String category,
			        @Param("description") String description,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);

//	@Query(value = """
//	   SELECT * FROM store_material_category_master
//	        WHERE (:category IS NULL OR :category = '' OR category LIKE CONCAT('%', :category, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<StoreMaterialCategoryMaster> getLikeStoreMaterialCategory(
//	        @Param("category") String category,
//	        @Param("description") String description,	
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(value = """
		    SELECT *
		    FROM store_material_category_master smcm
		    WHERE (:category IS NULL OR :category = '' 
		           OR LOWER(smcm.category) LIKE LOWER(CONCAT('%', :category, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(smcm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(smcm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(smcm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<StoreMaterialCategoryMaster> getAllStoreMaterialCategoryMaster(
		        @Param("category") String category,
		        @Param("description") String description,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);


}
