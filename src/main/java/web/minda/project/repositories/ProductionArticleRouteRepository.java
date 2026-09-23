package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionArticleRoute;
import web.minda.project.entity.StoreCategoryMapping;

public interface ProductionArticleRouteRepository extends JpaRepository<ProductionArticleRoute, Long>{
	

	
	@Query(value="SELECT * FROM Production_article_process ",nativeQuery = true)
	List<ProductionArticleRoute> getAllProductionArticleRouteMasters();

//	@Query(value="select * from Production_article_process  WHERE id = :productionArticleRouteId",nativeQuery = true)
//	public ProductionArticleRoute findByProductionArticleRouteIds(@Param("productionArticleRouteId") Long productionArticleRouteId);
//	


	
	@Query(value="""
			SELECT * FROM Production_article_process par left join Production_article_master pam on pam.id=par.production_article_id
			left join process_Master pm on pm.id=scmm.process_id
			 where pm.process_name =:process_name
			""",nativeQuery = true)
	List<ProductionArticleRoute> getAllCategoryFromProcess(@Param("process_name") String process_name);
	
	
	@Query(value="""
			SELECT * FROM Production_article_process par left join Production_article_master pam on pam.id=par.production_article_id
			left join process_Master pm on pm.id=par.process_id
			 where pam.article =:article
			""",nativeQuery = true)
	List<ProductionArticleRoute> getAllProcessFromarticle(@Param("article") String article);
	
	
	Optional<ProductionArticleRoute> findByProductionArticleRouteId(Long productionArticleRouteId);
	Optional<ProductionArticleRoute> findByProcess_ProcessName(String processName);
	Optional<ProductionArticleRoute> findByProductionArticle_Article(String article);
	Optional<ProductionArticleRoute>  findByProcess_ProcessNameAndProductionArticle_Article(String processName,String article);
	Optional<ProductionArticleRoute>  findByProcess_ProcessNameAndProductionArticle_ArticleAndScan(String processName,String article ,String scan);


	boolean existsByProductionArticleRouteId(Long Id);
	boolean existsByProcess_ProcessName(String processName);
	boolean existsByProductionArticle_Article(String article);
	boolean existsByProcess_ProcessNameAndProductionArticle_Article(String processName,String article);
	boolean existsByProcess_ProcessNameAndProductionArticle_ArticleAndScan(String processName,String article ,String scan);
	
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pm.process_name,par.status,par.created_by,
			 par.date_time_modified) FROM Production_article_process par left join Production_article_master pam on pam.id=par.production_article_id
			left join process_Master pm on pm.id=par.process_id
			""",
		       nativeQuery = true)
		List<ProductionArticleRoute> getalldata();


//	@Query(
//		    value = """
//		        SELECT * 
//		        FROM Production_article_process par 
//		        LEFT JOIN Production_article_master pam ON pam.id = par.production_article_id
//		        LEFT JOIN process_master pm ON pm.id = par.process_id
//		        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//		        AND (:processName IS NULL OR :processName = '' OR pm.process_name LIKE CONCAT('%', :processName, '%'))
//		        AND (:scan IS NULL OR :scan = '' OR par.scan LIKE CONCAT('%', :scan, '%'))
//		        AND (:status IS NULL OR :status = '' OR par.status LIKE CONCAT('%', :status, '%'))
//		        AND (:createdBy IS NULL OR :createdBy = '' OR par.created_by LIKE CONCAT('%', :createdBy, '%'))
//		        """,
//		        
//		    countQuery = """
//		        SELECT COUNT(*) 
//		        FROM Production_article_process par 
//		        LEFT JOIN Production_article_master pam ON pam.id = par.production_article_id
//		        LEFT JOIN process_master pm ON pm.id = par.process_id
//		        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//		        AND (:processName IS NULL OR :processName = '' OR pm.process_name LIKE CONCAT('%', :processName, '%'))
//		        AND (:scan IS NULL OR :scan = '' OR par.scan LIKE CONCAT('%', :scan, '%'))
//		        AND (:status IS NULL OR :status = '' OR par.status LIKE CONCAT('%', :status, '%'))
//		        AND (:createdBy IS NULL OR :createdBy = '' OR par.created_by LIKE CONCAT('%', :createdBy, '%'))
//		        """,
//		        
//		    nativeQuery = true
//		)
//		Page<ProductionArticleRoute> getLikeProductionArticleRoute(
//		        @Param("article") String article,
//		        @Param("processName") String processName,
//		        @Param("scan") String scan,
//		        @Param("status") String status,
//		        @Param("createdBy") String createdBy,
//		        Pageable pageable
//		);
//	@Query(value = """
//	        SELECT * FROM Production_article_process par left join Production_article_master pam on pam.id=par.production_article_id
//			left join process_Master pm on pm.id=par.process_id
//	        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//	        AND (:processName IS NULL OR :processName = '' OR pm.process_name LIKE CONCAT('%', :processName, '%'))
//	         AND (:scan IS NULL OR :scan = '' OR par.scan LIKE CONCAT('%', :scan, '%'))
//	        AND (:status IS NULL OR :status = '' OR par.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR par.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionArticleRoute> getLikeProductionArticleRoute(
//	        @Param("article") String article,
//	        @Param("processName") String processName,	
//	        @Param("scan") String scan,
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	
	@Query(
		    value = """
		        SELECT par.* 
		        FROM Production_article_process par 
		        LEFT JOIN Production_article_master pam ON pam.id = par.production_article_id
		        LEFT JOIN process_master pm ON pm.id = par.process_id
		        WHERE (:article IS NULL OR :article = '' OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		        AND (:processName IS NULL OR :processName = '' OR LOWER(pm.process_name) LIKE LOWER(CONCAT('%', :processName, '%')))
		        AND (:scan IS NULL OR :scan = '' OR LOWER(par.scan) LIKE LOWER(CONCAT('%', :scan, '%')))
		        AND (:status IS NULL OR :status = '' OR LOWER(par.status) LIKE LOWER(CONCAT('%', :status, '%')))
		        AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(par.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		        """,

		    countQuery = """
		        SELECT COUNT(*) 
		        FROM Production_article_process par 
		        LEFT JOIN Production_article_master pam ON pam.id = par.production_article_id
		        LEFT JOIN process_master pm ON pm.id = par.process_id
		        WHERE (:article IS NULL OR :article = '' OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		        AND (:processName IS NULL OR :processName = '' OR LOWER(pm.process_name) LIKE LOWER(CONCAT('%', :processName, '%')))
		        AND (:scan IS NULL OR :scan = '' OR LOWER(par.scan) LIKE LOWER(CONCAT('%', :scan, '%')))
		        AND (:status IS NULL OR :status = '' OR LOWER(par.status) LIKE LOWER(CONCAT('%', :status, '%')))
		        AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(par.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		        """,

		    nativeQuery = true
		)
		Page<ProductionArticleRoute> getLikeProductionArticleRoute(
		        @Param("article") String article,
		        @Param("processName") String processName,
		        @Param("scan") String scan,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy,
		        Pageable pageable
		);
	
	@Query(value = """
		    SELECT par.* 
		    FROM Production_article_process par 
		    LEFT JOIN production_article_master pam ON pam.id = par.production_article_id
		    LEFT JOIN process_master pm ON pm.id = par.process_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:processName IS NULL OR :processName = '' 
		         OR LOWER(pm.process_name) LIKE LOWER(CONCAT('%', :processName, '%')))
		    AND (:scan IS NULL OR :scan = '' 
		         OR LOWER(par.scan) LIKE LOWER(CONCAT('%', :scan, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(par.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(par.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionArticleRoute> getAllProductionArticleRouteMaster(
		        @Param("article") String article,
		        @Param("processName") String processName,
		        @Param("scan") String scan,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);

	boolean existsByProcess_ProcessNameAndProductionArticle_ArticleAndProductionArticleRouteIdNot(String processName,
			String article, Long productionArticleRouteId);

	List<ProductionArticleRoute> findByProductionArticleProductionArticleId(Long articleId);



	
	
}
