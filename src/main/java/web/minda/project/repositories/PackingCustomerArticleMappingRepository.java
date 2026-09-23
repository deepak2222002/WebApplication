package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.PackingCustomerArticleMapping;

public interface PackingCustomerArticleMappingRepository extends JpaRepository<PackingCustomerArticleMapping, Long>{
	
	
	@Query(value="SELECT * FROM Packing_customer_article_mapping ",nativeQuery = true)
	List<PackingCustomerArticleMapping> getAllStoreCategoryMappingMasters();

	@Query(value="""
			SELECT * FROM Packing_customer_article_mapping pcam left join Production_article_master pam on pam.id=pcam.production_article_id
			left join packing_customer_details pcd on pcd.id=pcam.production_customer_details_id
			 where pcd.customer_name =:customer_name
			""",nativeQuery = true)
	List<PackingCustomerArticleMapping> getAllPackingCustomerDetailFromCustomerName(@Param("customer_name") String customer_name);
	
	
	@Query(value="""
			SELECT * FROM Packing_customer_article_mapping pcam left join Production_article_master pam on pam.id=pcam.production_article_id
			left join packing_customer_details pcd on pcd.id=pcam.production_customer_details_id
			 where pam.article =:article
			""",nativeQuery = true)
	List<PackingCustomerArticleMapping> getAllPackingCustomerDetailFromArticle(@Param("article") String article);
	
	
	Optional<PackingCustomerArticleMapping> findByPackingCustomerArticleMappingId(Long packingCustomerArticleMappingId);
	Optional<PackingCustomerArticleMapping> findByProductionArticle_Article(String article);
	Optional<PackingCustomerArticleMapping> findByPackingCustomerDetails_CustomerName(String customerName);
	Optional<PackingCustomerArticleMapping>  findByProductionArticle_ArticleAndPackingCustomerDetails_CustomerName(String article,String customerName);
	Optional<PackingCustomerArticleMapping>  findByProductionArticle_ArticleAndPackingCustomerDetails_CustomerNameAndDestinationCode(String article,String customerName,String destinationCode);


	boolean existsByPackingCustomerArticleMappingId(Long Id);
	boolean existsByProductionArticle_Article(String article);
	boolean existsByPackingCustomerDetails_CustomerName(String customerName);
	boolean existsByProductionArticle_ArticleAndPackingCustomerDetails_CustomerName(String article,String customerName);
	boolean existsByProductionArticle_ArticleAndPackingCustomerDetails_CustomerNameAndDestinationCode(String article,String customerName,String destinationCode);
	
	@Query(value = """
			SELECT CONCAT_WS(';',pam.article,pcd.customer_name,pcam.status,pcam.created_by,
			 pcam.date_time_modified) FROM Packing_customer_article_mapping pcam left join Production_article_master pam on pam.id=pcam.production_article_id
			left join packing_customer_details pcd on pcd.id=pcam.production_customer_details_id
			""",
		       nativeQuery = true)
		List<PackingCustomerArticleMapping> getalldata();
	
	@Query(
		    value = """
		    SELECT pcam.* FROM Packing_customer_article_mapping pcam
		    LEFT JOIN Production_article_master pam ON pam.id = pcam.production_article_id
		    LEFT JOIN packing_customer_details pcd ON pcd.id = pcam.production_customer_details_id
		    WHERE (:article IS NULL OR :article = '' OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:customer_name IS NULL OR :customer_name = '' OR LOWER(pcd.customer_name) LIKE LOWER(CONCAT('%', :customer_name, '%')))
		    AND (:destination_code IS NULL OR :destination_code = '' OR LOWER(pcam.destination_code) LIKE LOWER(CONCAT('%', :destination_code, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(pcam.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pcam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    countQuery = """
		    SELECT COUNT(*) FROM Packing_customer_article_mapping pcam
		    LEFT JOIN Production_article_master pam ON pam.id = pcam.production_article_id
		    LEFT JOIN packing_customer_details pcd ON pcd.id = pcam.production_customer_details_id
		    WHERE (:article IS NULL OR :article = '' OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:customer_name IS NULL OR :customer_name = '' OR LOWER(pcd.customer_name) LIKE LOWER(CONCAT('%', :customer_name, '%')))
		    AND (:destination_code IS NULL OR :destination_code = '' OR LOWER(pcam.destination_code) LIKE LOWER(CONCAT('%', :destination_code, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(pcam.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pcam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    nativeQuery = true
		)
		Page<PackingCustomerArticleMapping> getLikePackingCustomerArticleMapping(
		        @Param("article") String article,
		        @Param("customer_name") String customer_name,
		        @Param("destination_code") String destination_code,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy,
		        Pageable pageable);
	
	@Query(value = """
		    SELECT pcam.*
		    FROM packing_customer_article_mapping pcam
		    LEFT JOIN production_article_master pam ON pam.id = pcam.production_article_id
		    LEFT JOIN packing_customer_details pcd ON pcd.id = pcam.production_customer_details_id
		    WHERE (:article IS NULL OR :article = '' 
		           OR LOWER(pam.article) LIKE LOWER(CONCAT('%', :article, '%')))
		    AND (:customer_name IS NULL OR :customer_name = '' 
		         OR LOWER(pcd.customer_name) LIKE LOWER(CONCAT('%', :customer_name, '%')))
		    AND (:destination_code IS NULL OR :destination_code = '' 
		         OR LOWER(pcam.destination_code) LIKE LOWER(CONCAT('%', :destination_code, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(pcam.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pcam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<PackingCustomerArticleMapping> getAllPackingCustomerArticleMappingMaster(
		        @Param("article") String article,
		        @Param("customer_name") String customer_name,
		        @Param("destination_code") String destination_code,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);

	boolean existsByProductionArticle_ArticleAndPackingCustomerDetails_CustomerNameAndDestinationCodeAndPackingCustomerArticleMappingIdNot(
			String article, String customerName, String destinationCode, Long packingCustomerArticleMappingId);


}
