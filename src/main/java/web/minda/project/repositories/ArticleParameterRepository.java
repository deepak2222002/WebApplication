package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ArticleParameterMaster;
import web.minda.project.entity.DepartmentMaster;

public interface ArticleParameterRepository extends JpaRepository<ArticleParameterMaster,Long> {
	boolean existsByInternalArticleNameAndCustomerArticleName(String internalArticleName,String customerArticleName);

	boolean existsByInternalArticleName(String upperCase);

	@Query(
			value = """
			SELECT *
			FROM article_parameter_master apm
			WHERE
			(:internalArticleName IS NULL
			OR :internalArticleName = ''
			OR UPPER(apm.internal_article_name)
			LIKE CONCAT('%',UPPER(:internalArticleName),'%'))

			AND
			(:customerArticleName IS NULL
			OR :customerArticleName = ''
			OR UPPER(apm.customer_article_name)
			LIKE CONCAT('%',UPPER(:customerArticleName),'%'))

			AND
			(:supplierCode IS NULL
			OR :supplierCode = ''
			OR UPPER(apm.supplier_code)
			LIKE CONCAT('%',UPPER(:supplierCode),'%'))
			""",

			countQuery = """
			SELECT COUNT(*)
			FROM article_parameter_master apm
			WHERE
			(:internalArticleName IS NULL
			OR :internalArticleName = ''
			OR UPPER(apm.internal_article_name)
			LIKE CONCAT('%',UPPER(:internalArticleName),'%'))

			AND
			(:customerArticleName IS NULL
			OR :customerArticleName = ''
			OR UPPER(apm.customer_article_name)
			LIKE CONCAT('%',UPPER(:customerArticleName),'%'))

			AND
			(:supplierCode IS NULL
			OR :supplierCode = ''
			OR UPPER(apm.supplier_code)
			LIKE CONCAT('%',UPPER(:supplierCode),'%'))
			""",
			nativeQuery = true
			)
			Page<ArticleParameterMaster> getLikeArticleParameter(

			        @Param("internalArticleName") String internalArticleName,

			        @Param("customerArticleName") String customerArticleName,

			        @Param("supplierCode") String supplierCode,

			        Pageable pageable
			);

	boolean existsByInternalArticleNameAndCustomerArticleNameAndArticleParameterIdNot(
	        String internalArticleName,
	        String customerArticleName,
	        Long articleParameterId);
	
	
	Optional<ArticleParameterMaster> findByCustomerNameAndInternalArticleName(String customerName, String internalArticleName);
	

}
