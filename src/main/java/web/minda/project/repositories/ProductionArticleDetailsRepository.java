package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionArticleDetails;
import web.minda.project.entity.ProductionArticleMaster;

public interface ProductionArticleDetailsRepository extends JpaRepository<ProductionArticleDetails, Long> {
	
	@Query(value="""
			select customer_article from Production_article_details 
			""",nativeQuery = true)
	public List<String> getAllProductionArticleDetails();
	
	
	@Query(value="SELECT * FROM Production_article_details ",nativeQuery = true)
	List<ProductionArticleDetails> getAllProductionArticleDetailsMasters();

//	@Query(value="select * from Production_article_details  WHERE id = :productionArticleId",nativeQuery = true)
//	public ProductionArticleMaster findByproductionArticleIds(@Param("productionArticleId") Long productionArticleId);
//	
//	@Query(value="select * from Production_article_details  WHERE customer_article = :article",nativeQuery = true)
//	public ProductionArticleMaster findByCustomerArticles(@Param("article") Long article);

	
	@Query(value = """
			SELECT * FROM Production_article_details pad left join Production_article_master pam on pam.id=pad.production_article_id where pam.article =:article
			""",nativeQuery = true)
	List<ProductionArticleDetails> getAllProductionArticleDetailsFromArticle(@Param("article") String article);
	
	@Query(value = """
			SELECT * FROM Production_article_details pad left join Production_article_master pam on pam.id=pad.production_article_id where pad.customer_article =:customerArticle
			""",nativeQuery = true)
	List<ProductionArticleMaster> getAllProductionArticleFromCustomerArticle(@Param("customerArticle") String customerArticle);
	
	
	Optional<ProductionArticleDetails> findByProductionArticleDetailId(Long productionArticleId);
	Optional<ProductionArticleDetails> findByProductionArticle_Article(String article);
	Optional<ProductionArticleDetails> findByCustomerArticle(String customerArticle );
	Optional<ProductionArticleDetails> findByProductionArticle_ArticleAndCustomerArticle(String article,String customerArticle);
	Optional<ProductionArticleDetails> findByProductionArticle_ArticleAndCustomerArticleAndMouldAndColdRunnerAndWeightAndImagePathAndSimilarLooking(String productionArticle_Article, String customerArticle, String mould, String coldRunner, String weight, String imagePath, String similarLooking);
	


	boolean existsByProductionArticleDetailId(Long productionArticleId);
	boolean existsByProductionArticle_Article(String article);
	boolean existsByCustomerArticle(String customerArticle );
	boolean existsByProductionArticle_ArticleAndCustomerArticle(String article,String customerArticle);
	boolean existsByProductionArticle_ArticleAndCustomerArticleAndMouldAndColdRunnerAndWeightAndImagePathAndSimilarLooking(String productionArticle_Article, String customerArticle, String mould, String coldRunner, String weight, String imagePath, String similarLooking);
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pad.customer_article,pad.mould,pad.cold_runner,pad.weight,pad.image_path,pad.similar_looking ,pad.status,pad.created_by,
			 pad.date_time_modified) FROM Production_article_details pad left join Production_article_master pam on pam.id=pad.production_article_id
			""",
		       nativeQuery = true)
		List<ProductionArticleDetails> getalldata();


//	@Query(
//			value = """
//			SELECT * FROM Production_article_details pad
//			LEFT JOIN Production_article_master pam ON pam.id = pad.production_article_id
//			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//			AND (:customer_article IS NULL OR :customer_article = '' OR pad.customer_article LIKE CONCAT('%', :customer_article, '%'))
//			AND (:mould IS NULL OR :mould = '' OR pad.mould LIKE CONCAT('%', :mould, '%'))
//			AND (:cold_runner IS NULL OR :cold_runner = '' OR pad.cold_runner LIKE CONCAT('%', :cold_runner, '%'))
//			AND (:weight IS NULL OR :weight = '' OR pad.weight LIKE CONCAT('%', :weight, '%'))
//			AND (:image_path IS NULL OR :image_path = '' OR pad.image_path LIKE CONCAT('%', :image_path, '%'))
//			AND (:similar_looking IS NULL OR :similar_looking = '' OR pad.similar_looking LIKE CONCAT('%', :similar_looking, '%'))
//			AND (:createdBy IS NULL OR :createdBy = '' OR pad.created_by LIKE CONCAT('%', :createdBy, '%'))
//			""",
//			countQuery = """
//			SELECT COUNT(*) FROM Production_article_details pad
//			LEFT JOIN Production_article_master pam ON pam.id = pad.production_article_id
//			WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//			AND (:customer_article IS NULL OR :customer_article = '' OR pad.customer_article LIKE CONCAT('%', :customer_article, '%'))
//			AND (:mould IS NULL OR :mould = '' OR pad.mould LIKE CONCAT('%', :mould, '%'))
//			AND (:cold_runner IS NULL OR :cold_runner = '' OR pad.cold_runner LIKE CONCAT('%', :cold_runner, '%'))
//			AND (:weight IS NULL OR :weight = '' OR pad.weight LIKE CONCAT('%', :weight, '%'))
//			AND (:image_path IS NULL OR :image_path = '' OR pad.image_path LIKE CONCAT('%', :image_path, '%'))
//			AND (:similar_looking IS NULL OR :similar_looking = '' OR pad.similar_looking LIKE CONCAT('%', :similar_looking, '%'))
//			AND (:createdBy IS NULL OR :createdBy = '' OR pad.created_by LIKE CONCAT('%', :createdBy, '%'))
//			""",
//			nativeQuery = true
//			)
//			Page<ProductionArticleDetails> getLikeProductionArticleDetails(
//			        @Param("article") String article,
//			        @Param("customer_article") String customer_article,
//			        @Param("mould") String mould,
//			        @Param("cold_runner") String cold_runner,
//			        @Param("weight") String weight,
//			        @Param("image_path") String image_path,
//			        @Param("similar_looking") String similar_looking,
//			        @Param("createdBy") String createdBy,
//			        Pageable pageable);
//	@Query(value = """
//	        SELECT * FROM  Production_article_details pad left join Production_article_master pam on pam.id=pad.production_article_id
//	        WHERE (:article IS NULL OR :article = '' OR pam.article LIKE CONCAT('%', :article, '%'))
//	        AND (:customer_article IS NULL OR :customer_article = '' OR pad.customer_article LIKE CONCAT('%', :customer_article, '%'))
//	        AND (:mould IS NULL OR :mould = '' OR pad.mould LIKE CONCAT('%', :mould, '%'))
//	        AND (:cold_runner IS NULL OR :cold_runner = '' OR pad.cold_runner LIKE CONCAT('%', :cold_runner, '%'))
//	        AND (:weight IS NULL OR :weight = '' OR pad.weight LIKE CONCAT('%', :weight, '%'))
//	        AND (:image_path IS NULL OR :image_path = '' OR pad.image_path LIKE CONCAT('%', :image_path, '%'))
//	        AND (:similar_looking IS NULL OR :similar_looking = '' OR pad.similar_looking LIKE CONCAT('%', :similar_looking, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR pad.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProductionArticleDetails> getLikeProductionArticleDetails(
//	        @Param("article") String article,
//	        @Param("customer_article") String customer_article,	
//	        @Param("mould") String mould,	
//	        @Param("cold_runner") String cold_runner,	
//	        @Param("weight") String weight,	
//	        @Param("image_path") String image_path,	
//	        @Param("similar_looking") String similar_looking,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
//	
	
	@Query(
		    value = """
		    SELECT pad.* FROM Production_article_details pad
		    LEFT JOIN Production_article_master pam ON pam.id = pad.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:customer_article IS NULL OR :customer_article = '' OR LOWER(pad.customer_article) LIKE LOWER(CONCAT('%', :customer_article, '%')))
		    AND (:mould IS NULL OR :mould = '' OR LOWER(pad.mould) LIKE LOWER(CONCAT('%', :mould, '%')))
		    AND (:cold_runner IS NULL OR :cold_runner = '' OR LOWER(pad.cold_runner) LIKE LOWER(CONCAT('%', :cold_runner, '%')))
		    AND (:weight IS NULL OR :weight = '' OR LOWER(pad.weight) LIKE LOWER(CONCAT('%', :weight, '%')))
		    AND (:image_path IS NULL OR :image_path = '' OR LOWER(pad.image_path) LIKE LOWER(CONCAT('%', :image_path, '%')))
		    AND (:similar_looking IS NULL OR :similar_looking = '' OR LOWER(pad.similar_looking) LIKE LOWER(CONCAT('%', :similar_looking, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pad.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    countQuery = """
		    SELECT COUNT(*) FROM Production_article_details pad
		    LEFT JOIN Production_article_master pam ON pam.id = pad.production_article_id
		    WHERE (:article IS NULL OR :article = '' OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:customer_article IS NULL OR :customer_article = '' OR LOWER(pad.customer_article) LIKE LOWER(CONCAT('%', :customer_article, '%')))
		    AND (:mould IS NULL OR :mould = '' OR LOWER(pad.mould) LIKE LOWER(CONCAT('%', :mould, '%')))
		    AND (:cold_runner IS NULL OR :cold_runner = '' OR LOWER(pad.cold_runner) LIKE LOWER(CONCAT('%', :cold_runner, '%')))
		    AND (:weight IS NULL OR :weight = '' OR LOWER(pad.weight) LIKE LOWER(CONCAT('%', :weight, '%')))
		    AND (:image_path IS NULL OR :image_path = '' OR LOWER(pad.image_path) LIKE LOWER(CONCAT('%', :image_path, '%')))
		    AND (:similar_looking IS NULL OR :similar_looking = '' OR LOWER(pad.similar_looking) LIKE LOWER(CONCAT('%', :similar_looking, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pad.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    nativeQuery = true
		)
		Page<ProductionArticleDetails> getLikeProductionArticleDetails(
		        @Param("article") String article,
		        @Param("customer_article") String customer_article,
		        @Param("mould") String mould,
		        @Param("cold_runner") String cold_runner,
		        @Param("weight") String weight,
		        @Param("image_path") String image_path,
		        @Param("similar_looking") String similar_looking,
		        @Param("createdBy") String createdBy,
		        Pageable pageable);


	public boolean existsByProductionArticle_ArticleAndCustomerArticleAndMouldAndColdRunnerAndWeightAndImagePathAndSimilarLookingAndProductionArticleDetailIdNot(
			String article, String customerArticle, String mould, String coldRunner, String weight, String imagePath,
			String similarLooking, Long productionArticleDetailId);
	
	
	@Query(value = """
		    SELECT pad.* 
		    FROM production_article_details pad
		    LEFT JOIN production_article_master pam ON pam.id = pad.production_article_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:customer_article IS NULL OR :customer_article = '' 
		         OR LOWER(pad.customer_article) LIKE LOWER(CONCAT('%', :customer_article, '%')))
		    AND (:mould IS NULL OR :mould = '' 
		         OR LOWER(pad.mould) LIKE LOWER(CONCAT('%', :mould, '%')))
		    AND (:cold_runner IS NULL OR :cold_runner = '' 
		         OR LOWER(pad.cold_runner) LIKE LOWER(CONCAT('%', :cold_runner, '%')))
		    AND (:weight IS NULL OR :weight = '' 
		         OR LOWER(pad.weight) LIKE LOWER(CONCAT('%', :weight, '%')))
		    AND (:image_path IS NULL OR :image_path = '' 
		         OR LOWER(pad.image_path) LIKE LOWER(CONCAT('%', :image_path, '%')))
		    AND (:similar_looking IS NULL OR :similar_looking = '' 
		         OR LOWER(pad.similar_looking) LIKE LOWER(CONCAT('%', :similar_looking, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pad.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProductionArticleDetails> getAllProductionArticleDetailsMaster(
		        @Param("article") String article,
		        @Param("customer_article") String customer_article,
		        @Param("mould") String mould,
		        @Param("cold_runner") String cold_runner,
		        @Param("weight") String weight,
		        @Param("image_path") String image_path,
		        @Param("similar_looking") String similar_looking,
		        @Param("createdBy") String createdBy
		);

}
