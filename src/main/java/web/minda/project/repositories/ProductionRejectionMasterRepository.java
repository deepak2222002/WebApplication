package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionRejection;

public interface ProductionRejectionMasterRepository extends JpaRepository<ProductionRejection, Long>{

	@Query(value="SELECT * FROM Production_rejection ",nativeQuery = true)
	List<ProductionRejection> getAllProductionRejectionMasters();

//	@Query(value="select * from Production_rejection  WHERE id = :productionRejectionId",nativeQuery = true)
//	public ProductionRejection findByproductionRejectionIds(@Param("productionRejectionId") Long productionRejectionId);

	

	
	@Query(value = """
			SELECT * FROM Production_rejection pr left join Production_article_master pam on pam.id=pr.production_article_id where pam.article =:article
			""",nativeQuery = true)
	List<ProductionRejection> getAllProductionRejectionFromArticle(@Param("article") String article);
	
	Optional<ProductionRejection> findByProductionRejectionId(Long productionRejectionId);
	
	boolean existsByProductionRejectionId(Long Id);
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pr.description,pr.rejection,pr.status,pr.created_by,
			 pr.date_time_modified) FROM Production_rejection pr left join Production_article_master pam on pam.id=pr.production_article_id
			""",
		       nativeQuery = true)
	List<ProductionRejection> getalldata();



//	@Query(value = """
//	        SELECT * FROM  Production_rejection pr left join Production_article_master pam on pam.id=pr.production_article_id
//	        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//	        AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
//	        AND (:rejection IS NULL OR :rejection = '' OR pr.rejection LIKE CONCAT('%', :rejection, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionRejection> getLikeProductionRejection(
//	        @Param("article") String article,
//	        @Param("description") String description,	
//	        @Param("rejection") String rejection,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(
		    value = """
		    SELECT pr.* FROM Production_rejection pr
		    LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
		    AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
		    AND (:rejection IS NULL OR :rejection = '' OR pr.rejection LIKE CONCAT('%', :rejection, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,
		    
		    countQuery = """
		    SELECT COUNT(*) FROM Production_rejection pr
		    LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
		    AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
		    AND (:rejection IS NULL OR :rejection = '' OR pr.rejection LIKE CONCAT('%', :rejection, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,
		    
		    nativeQuery = true
		)
		Page<ProductionRejection> getLikeProductionRejection(
		    @Param("article") String article,
		    @Param("rejection") String rejection,
		    @Param("description") String description,
		    @Param("createdBy") String createdBy,
		    Pageable pageable
		);
	
	@Query(value = """
		    SELECT pr.*
		    FROM production_rejection pr
		    LEFT JOIN production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pr.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:rejection IS NULL OR :rejection = '' 
		         OR LOWER(pr.rejection) LIKE LOWER(CONCAT('%', :rejection, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pr.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionRejection> getAllProductionRejectionMaster(
		        @Param("article") String article,
		        @Param("rejection") String rejection,
		        @Param("description") String description,
		        @Param("createdBy") String createdBy
		);

}
