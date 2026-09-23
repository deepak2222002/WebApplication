package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionArticleCategoryMaster;

public interface ProductionArticleCategoryRepository extends JpaRepository<ProductionArticleCategoryMaster, Long> {
	@Query(value="""
			select article_category from production_article_category_master 
			""",nativeQuery = true)
	public List<String> getAllProductionArticleCategoryMasterList();
	
	
	@Query(value="SELECT * FROM production_article_category_master ",nativeQuery = true)
	List<ProductionArticleCategoryMaster> getAllProductionArticleCategoryMaste();


	Optional<ProductionArticleCategoryMaster> findByArticleCategory(String articleCategory);
	
	Optional<ProductionArticleCategoryMaster> findByProductionArticleCategoryId(Long productionArticleCategoryId);

	boolean existsByArticleCategory(String articleCategory);
	
	boolean existsByProductionArticleCategoryId(Long productionArticleCategoryId);
	
	
	@Query(value = """
				SELECT CONCAT_WS(';',article_category, description,created_by,
			 date_time_modified) FROM production_article_category_master
			""",
		       nativeQuery = true)
		List<ProductionArticleCategoryMaster> getalldata();

	@Query(
			value = """
			SELECT *
			FROM production_article_category_master pacm
			WHERE (:articleCategory IS NULL OR :articleCategory = '' OR pacm.article_category LIKE '%' + :articleCategory + '%')
			AND (:description IS NULL OR :description = '' OR pacm.description LIKE '%' + :description + '%')
			AND (:status IS NULL OR :status = '' OR pacm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR pacm.created_by LIKE '%' + :createdBy + '%')
			""",
			countQuery = """
			SELECT COUNT(*)
			FROM production_article_category_master pacm
			WHERE (:articleCategory IS NULL OR :articleCategory = '' OR pacm.article_category LIKE '%' + :articleCategory + '%')
			AND (:description IS NULL OR :description = '' OR pacm.description LIKE '%' + :description + '%')
			AND (:status IS NULL OR :status = '' OR pacm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR pacm.created_by LIKE '%' + :createdBy + '%')
			""",
			nativeQuery = true
			)
			Page<ProductionArticleCategoryMaster> getLikeProductionArticleCategory(
			        @Param("articleCategory") String articleCategory,
			        @Param("description") String description,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);

//	@Query(value = """
//	   SELECT * FROM Production_article_category_master
//	        WHERE (:articleCategory IS NULL OR :articleCategory = '' OR article_category LIKE CONCAT('%', :articleCategory, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionArticleCategoryMaster> getLikeProductionArticleCategory(
//	        @Param("articleCategory") String articleCategory,
//	        @Param("description") String description,	
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(value = """
		    SELECT *
		    FROM production_article_category_master pacm
		    WHERE (:articleCategory IS NULL OR :articleCategory = '' 
		           OR LOWER(pacm.article_category) LIKE LOWER(CONCAT('%', :articleCategory, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pacm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(pacm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pacm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionArticleCategoryMaster> getAllProductionArticleCategoryMaster(
		        @Param("articleCategory") String articleCategory,
		        @Param("description") String description,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);

}
