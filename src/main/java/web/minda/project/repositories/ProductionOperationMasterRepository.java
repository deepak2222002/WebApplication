package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionOperation;


public interface ProductionOperationMasterRepository extends JpaRepository<ProductionOperation, Long>{
	
	@Query(value="SELECT * FROM Production_operation ",nativeQuery = true)
	List<ProductionOperation> getAllProductionOperationMasters();

//	@Query(value="select * from Production_operation  WHERE id = :productionOperationId",nativeQuery = true)
//	public ProductionOperation findByProduction_operationIds(@Param("productionOperationId") Long productionOperationId);

	

	
	@Query(value = """
			SELECT * FROM Production_operation pr left join Production_article_master pam on pam.id=pr.production_article_id where pam.article =:article
			""",nativeQuery = true)
	List<ProductionOperation> getAllProductionOperationFromArticle(@Param("article") String article);
	
	Optional<ProductionOperation> findByProductionOperationId(Long productionOperationId);
	Optional<ProductionOperation> findByProductionArticle_ArticleAndAndOperation(String productionArticle_Article, String operation);
	
	boolean existsByProductionOperationId(Long Id);
	boolean existsByProductionArticle_ArticleAndAndOperation(String productionArticle_Article, String operation);
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pr.description,pr.operation,pr.status,pr.created_by,
			 pr.date_time_modified) FROM Production_operation pr left join Production_article_master pam on pam.id=pr.production_article_id
			""",
		       nativeQuery = true)
	List<ProductionOperation> getalldata();


//	@Query(
//			value = """
//			SELECT * FROM Production_operation pr
//			LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
//			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//			AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
//			AND (:operation IS NULL OR :operation = '' OR pr.operation LIKE CONCAT('%', :operation, '%'))
//			AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//			""",
//			countQuery = """
//			SELECT COUNT(*) FROM Production_operation pr
//			LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
//			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//			AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
//			AND (:operation IS NULL OR :operation = '' OR pr.operation LIKE CONCAT('%', :operation, '%'))
//			AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//			""",
//			nativeQuery = true
//			)
//			Page<ProductionOperation> getLikeProductionOperation(
//			        @Param("article") String article,
//			        @Param("description") String description,
//			        @Param("operation") String operation,
//			        @Param("createdBy") String createdBy,
//			        Pageable pageable);
//	@Query(value = """
//	        SELECT * FROM  Production_operation pr left join Production_article_master pam on pam.id=pr.production_article_id
//	        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//	        AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
//	        AND (:operation IS NULL OR :Operation = '' OR pr.operation LIKE CONCAT('%', :operation, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionOperation> getLikeProductionOperation(
//	        @Param("article") String article,
//	        @Param("description") String description,	
//	        @Param("operation") String operation,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(
		    value = """
		    SELECT pr.* FROM Production_operation pr
		    LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
		    AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
		    AND (:operation IS NULL OR :operation = '' OR pr.operation LIKE CONCAT('%', :operation, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,

		    countQuery = """
		    SELECT COUNT(*) FROM Production_operation pr
		    LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
		    AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
		    AND (:operation IS NULL OR :operation = '' OR pr.operation LIKE CONCAT('%', :operation, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,

		    nativeQuery = true
		)
		Page<ProductionOperation> getLikeProductionOperation(
		        @Param("article") String article,
		        @Param("operation") String operation,
		        @Param("description") String description,
		        @Param("createdBy") String createdBy,
		        Pageable pageable);
	
	@Query(value = """
		    SELECT pr.*
		    FROM production_operation pr
		    LEFT JOIN production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pr.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:operation IS NULL OR :operation = '' 
		         OR LOWER(pr.operation) LIKE LOWER(CONCAT('%', :operation, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pr.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionOperation> getAllProductionOperationMaster(
		        @Param("article") String article,
		        @Param("operation") String operation,
		        @Param("description") String description,
		        @Param("createdBy") String createdBy
		);

}
