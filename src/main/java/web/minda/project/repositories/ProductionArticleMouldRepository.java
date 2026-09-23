package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionArticleMaster;
import web.minda.project.entity.ProductionArticleMouldMaster;
import web.minda.project.entity.ProductionMouldMaster;

public interface ProductionArticleMouldRepository extends JpaRepository<ProductionArticleMouldMaster,Long>{

	@Query("""
			SELECT p FROM ProductionArticleMouldMaster p
			WHERE (:articleId IS NULL OR p.productionArticle.productionArticleId = :articleId)
			AND (:mouldId IS NULL OR p.productionMouldMaster.productionMouldId = :mouldId)
			AND (:status IS NULL OR p.status = :status)
			""")
			List<ProductionArticleMouldMaster> getAllData(
			        Long articleId,
			        Long mouldId,
			        String status
			);
	
	@Query("""
		    SELECT p FROM ProductionArticleMouldMaster p
		    WHERE (:article IS NULL OR p.productionArticle.article = :article)
		    AND (:mould IS NULL OR p.productionMouldMaster.mould = :mould)
		    AND (:status IS NULL OR p.status = :status)
		""")
		Page<ProductionArticleMouldMaster> search(
		    @Param("article") String article,
		    @Param("mould") String mould,
		    @Param("status") String status,
		    Pageable pageable
		);
	
	
	
	@Query("SELECT p FROM ProductionArticleMaster p")
	List<ProductionArticleMaster> findAllArticles();
	
	
	@Query("SELECT m FROM ProductionMouldMaster m")
	List<ProductionMouldMaster> findAllMoulds();
	
	
	
	@Query(value = """

  		    SELECT pmm.mould
		    FROM production_article_mould pam
		   left JOIN production_article_master pamst 
		        ON pam.production_article_id = pamst.id
				left join production_mould_master pmm on pmm.id = pam.production_mould_id
				
		    WHERE pamst.article = :article
		""", nativeQuery = true)
		List<String> getMouldsByArticle(@Param("article") String article);

	boolean existsByProductionArticleAndProductionMouldMaster(ProductionArticleMaster productionArticleMaster,
			ProductionMouldMaster mould);
	
	@Query("""
		    SELECT pa.article, pm.mould, pam.shotsPerDay
		    FROM ProductionArticleMouldMaster pam
		    LEFT JOIN pam.productionArticle pa
		    LEFT JOIN pam.productionMouldMaster pm
		    WHERE pa.article IN :articleList
		    AND pm.mould IN :mouldList
		""")
		List<Object[]> getShotsByArticleAndMould(@Param("articleList") List<String> articleList,
		                                        @Param("mouldList") List<String> mouldList);
	
}
