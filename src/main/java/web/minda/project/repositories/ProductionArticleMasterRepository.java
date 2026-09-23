package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionArticleMaster;


public interface ProductionArticleMasterRepository extends JpaRepository<ProductionArticleMaster, Long> {

	@Query(value="""
			select article from Production_article_master 
			""",nativeQuery = true)
	public List<String> getAllProductionArticle();
	
	
	@Query(value="SELECT * FROM Production_article_master ",nativeQuery = true)
	List<ProductionArticleMaster> getAllProductionArticleMasters();

//	@Query(value="select * from Production_article_master  WHERE id = :productionArticleId",nativeQuery = true)
//	public ProductionArticleMaster findByproductionArticleIds(@Param("productionArticleId") Long productionArticleId);
//	
//	@Query(value="select * from Production_article_master  WHERE article = :article",nativeQuery = true)
//	public ProductionArticleMaster findByarticles(@Param("article") Long article);

	
	@Query(value = """
			SELECT * FROM Production_article_master pam left join Production_article_category_master pacm on pacm.id=pam.production_article_category_id where pam.article =:article
			""",nativeQuery = true)
	List<ProductionArticleMaster> getAllProductionArticleFromArticle(@Param("article") String article);
	
	@Query(value = """
			SELECT * FROM Production_article_master pam left join Production_article_category_master pacm on pacm.id=pam.production_article_category_id where pacm.article_category =:articleCategory
			""",nativeQuery = true)
	List<ProductionArticleMaster> getAllProductionArticleFromCategory(@Param("articleCategory") String articleCategory);
	
	
	Optional<ProductionArticleMaster> findByProductionArticleId(Long productionArticleId);
	Optional<ProductionArticleMaster> findByProductionArticleCategory_ArticleCategory(String articleCategory);
	Optional<ProductionArticleMaster> findByArticle(String article);
	Optional<ProductionArticleMaster>  findByArticleAndProductionArticleCategory_ArticleCategory(String article,String articleCategory);
	


	boolean existsByProductionArticleId(Long Id);
	boolean existsByProductionArticleCategory_ArticleCategory(String articleCategory);
	boolean existsByArticle(String article);
	boolean existsByArticleAndProductionArticleCategory_ArticleCategory(String article,String articleCategory);
	
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pam.description,pacm.article_category ,pam.status,pam.created_by,
			 pam.date_time_modified) FROM Production_article_master pam left join Production_article_category_master pacm on pacm.id=pam.production_article_category_id
			""",
		       nativeQuery = true)
		List<ProductionArticleMaster> getalldata();


	@Query(
			value = """
			SELECT pam.*
			FROM production_article_master pam
			LEFT JOIN production_article_category_master pacm
			       ON pacm.id = pam.production_article_category_id
			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE '%' + :article + '%')
			AND (:description IS NULL OR :description = '' OR pam.description LIKE '%' + :description + '%')
			AND (:article_category IS NULL OR :article_category = '' OR pacm.article_category LIKE '%' + :article_category + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR pam.created_by LIKE '%' + :createdBy + '%')
			""",

			countQuery = """
			SELECT COUNT(*)
			FROM production_article_master pam
			LEFT JOIN production_article_category_master pacm
			       ON pacm.id = pam.production_article_category_id
			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE '%' + :article + '%')
			AND (:description IS NULL OR :description = '' OR pam.description LIKE '%' + :description + '%')
			AND (:article_category IS NULL OR :article_category = '' OR pacm.article_category LIKE '%' + :article_category + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR pam.created_by LIKE '%' + :createdBy + '%')
			""",

			nativeQuery = true
			)
			Page<ProductionArticleMaster> getLikeProductionArticle(
			        @Param("article") String article,
			        @Param("description") String description,
			        @Param("article_category") String article_category,
			        @Param("createdBy") String createdBy,
			        Pageable pageable
			);
//	@Query(value = """
//	        SELECT * FROM  Production_article_master pam left join Production_article_category_master pacm on pacm.id=pam.production_article_category_id
//	        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//	        AND (:description IS NULL OR :description = '' OR pam.description LIKE CONCAT('%', :description, '%'))
//	        AND (:article_category IS NULL OR :article_category = '' OR pacm.article_category LIKE CONCAT('%', :article_category, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR pam.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionArticleMaster> getLikeProductionArticle(
//	        @Param("article") String article,
//	        @Param("description") String description,	
//	        @Param("article_category") String article_category,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
//	

	@Query(value="""
			select article from production_article_master 
			""",nativeQuery = true)
	public List<String> getAllProductionArticleMasterList();


	public boolean existsByArticleAndProductionArticleCategory_ArticleCategoryAndProductionArticleIdNot(String article,
			String articleCategory, Long productionArticleId);
	
	
	@Query(value = """
		    SELECT pam.*
		    FROM production_article_master pam
		    LEFT JOIN production_article_category_master pacm
		           ON pacm.id = pam.production_article_category_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pam.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:article_category IS NULL OR :article_category = '' 
		         OR LOWER(pacm.article_category) LIKE LOWER(CONCAT('%', :article_category, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionArticleMaster> getAllProductionArticleMaster(
		        @Param("article") String article,
		        @Param("description") String description,
		        @Param("article_category") String article_category,
		        @Param("createdBy") String createdBy
		);


	public boolean existsByArticleAndStatus(String article, String status);


	public boolean existsByArticleAndStatusAndProductionArticleIdNot(String article, String status,
			Long productionArticleId);


	public Optional<ProductionArticleMaster> findByArticleIgnoreCase(String trim);
	
}
