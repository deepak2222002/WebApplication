package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.CompoundDTO;
import web.minda.project.entity.ProductionArticleBom;
import web.minda.project.entity.ProductionArticleMaster;

public interface ProductionArticleBomRepository extends JpaRepository<ProductionArticleBom, Long> {
	
	@Query(value="SELECT * FROM Production_article_child_part ",nativeQuery = true)
	List<ProductionArticleBom> getAllProductionArticleBomMasters();
	
	@Query(value="SELECT child_part FROM Production_article_child_part ",nativeQuery = true)
	List<ProductionArticleBom> getAllChildPart();

//	@Query(value="select * from Production_article_child_part  WHERE id = :productionArticleBomId",nativeQuery = true)
//	public ProductionArticleBom findByProductionArticleBomIds(@Param("productionArticleBomId") Long productionArticleBomId);

	

	
	@Query(value = """
			SELECT * FROM Production_article_child_part pr left join Production_article_master pam on pam.id=pr.production_article_id where pam.article =:article
			""",nativeQuery = true)
	List<ProductionArticleBom> getAllProdcutionArticleBomFromArticle(@Param("article") String article);
	
	Optional<ProductionArticleBom> findByProductionArticleBomId(Long productionArticleBomId);
	Optional<ProductionArticleBom>  findByProductionArticle_ArticleAndChildPart(String article,String childpart);
	
	boolean existsByProductionArticleBomId(Long Id);
	
	boolean existsByProductionArticle_ArticleAndChildPart(String article,String childpart);
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pr.description,pr.child_part,pr.status,pr.created_by,
			 pr.date_time_modified) FROM Production_article_child_part pr left join Production_article_master pam on pam.id=pr.production_article_id
			""",
		       nativeQuery = true)
	List<ProductionArticleBom> getalldata();


//	@Query(
//			value = """
//			SELECT * FROM Production_article_child_part pr
//			LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
//			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//			AND (:child_part IS NULL OR :child_part = '' OR pr.child_part LIKE CONCAT('%', :child_part, '%'))
//			AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//			""",
//			countQuery = """
//			SELECT COUNT(*) FROM Production_article_child_part pr
//			LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
//			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//			AND (:child_part IS NULL OR :child_part = '' OR pr.child_part LIKE CONCAT('%', :child_part, '%'))
//			AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//			""",
//			nativeQuery = true
//			)
//			Page<ProductionArticleBom> getLikeProductionArticleBom(
//			        @Param("article") String article,
//			        @Param("child_part") String child_part,
//			        @Param("createdBy") String createdBy,
//			        Pageable pageable);
//	@Query(value = """
//	        SELECT * FROM  Production_article_child_part pr left join Production_article_master pam on pam.id=pr.production_article_id
//	        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//	        AND (:child_part IS NULL OR :childPart = '' OR pr.child_part LIKE CONCAT('%', :child_part, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionArticleBom> getLikeProductionArticleBom(
//	        @Param("article") String article,
//	        @Param("child_part") String child_part,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(
		    value = """
		    SELECT pr.* FROM Production_article_child_part pr
		    LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
		    AND (:child_part IS NULL OR :child_part = '' OR pr.child_part LIKE CONCAT('%', :child_part, '%'))
		    AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,

		    countQuery = """
		    SELECT COUNT(*) FROM Production_article_child_part pr
		    LEFT JOIN Production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
		    AND (:child_part IS NULL OR :child_part = '' OR pr.child_part LIKE CONCAT('%', :child_part, '%'))
		    AND (:description IS NULL OR :description = '' OR pr.description LIKE CONCAT('%', :description, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR pr.created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,

		    nativeQuery = true
		)
		Page<ProductionArticleBom> getLikeProductionArticleBom(
		        @Param("article") String article,
		        @Param("child_part") String child_part,
		        @Param("description") String description,
		        @Param("createdBy") String createdBy,
		        Pageable pageable);
	
	@Query(value = """
		    SELECT pr.*
		    FROM Production_article_child_part pr
		    LEFT JOIN production_article_master pam ON pam.id = pr.production_article_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:child_part IS NULL OR :child_part = '' 
		         OR LOWER(pr.child_part) LIKE LOWER(CONCAT('%', :child_part, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pr.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pr.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionArticleBom> getAllProductionArticleBomMaster(
		        @Param("article") String article,
		        @Param("child_part") String child_part,
		        @Param("description") String description,
		        @Param("createdBy") String createdBy
		);

	@Query("SELECT m.material, m.description FROM StoreMaterial m")
	List<Object[]> findAllMaterialWithDescription();

	boolean existsByChildPartAndProductionArticle_ArticleAndProductionArticleBomIdNot(String childPart, String article,
			Long productionArticleBomId);

	boolean existsByChildPartAndProductionArticle_Article(String childPart, String article);
	
	
	
//	@Query("""
//		    SELECT cp 
//		    FROM ProductionArticleBom cp
//		    JOIN cp.productionArticle pa
//		    WHERE pa.article IN :articleList
//		""")
//		List<ProductionArticleBom> findCompoundByArticleList(@Param("articleList") List<String> articleList);

	
	@Query("""
		    SELECT new web.minda.project.dto.CompoundDTO(
		        pa.article,
		        cp.childPart,
		        pcm.batchWeight,
		        pcm.batchCutting,
		        pcm.rmsWeight,
		        cp.status,
		        sm.category.category,
		        cp.issuenceCategory
		    )
		    FROM ProductionArticleBom cp
		    JOIN cp.productionArticle pa
		    LEFT JOIN ProductionCompoundMaster pcm
		         ON pcm.compound = cp.childPart
		    LEFT JOIN StoreMaterial sm
		         ON sm.material = cp.childPart
		    WHERE pa.article IN :articleList
		""")
		List<CompoundDTO> findCompoundByArticleList(@Param("articleList") List<String> articleList);

	List<ProductionArticleBom> findByProductionArticleProductionArticleId(Long articleId);


	
//	@Query("""
//		    SELECT new web.minda.project.dto.CompoundDTO(
//		        pa.article,
//		        cp.childPart,
//		        pcm.batchWeight
//		    )
//		    FROM ProductionArticleBom cp
//		    JOIN cp.productionArticle pa
//		    LEFT JOIN ProductionCompoundMaster pcm
//		         ON pcm.compound = cp.childPart
//		    WHERE pa.article IN :articleList
//		""")
//		List<CompoundDTO> findCompoundByArticleList(@Param("articleList") List<String> articleList);

}
