package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.SupplierClaimReportDTO;
import web.minda.project.entity.SupplierClaim;

public interface SupplierClaimRepository extends JpaRepository<SupplierClaim, Long>{
	
	  List<SupplierClaim> findByIncomingMaterialId(
	            Long incomingMaterialId);

	  

		@Query(value = """

				SELECT

				    sc.id AS supplierClaimId,
				    sc.inmaterial_id AS incomingMaterialId,

				    sc.claim_date AS claimDate,
				    sc.claimed_by AS claimedBy,
				    sc.supplier_name AS supplierName,
				    sc.receiving_date AS receivingDate,

				    sc.yes_no AS yesNo,
				    sc.responsible AS responsible,

				    sc.target_date AS targetDate,
				    sc.actual_date AS actualDate,

				    sc.quality_head AS qualityHead,
				    sc.department_head AS departmentHead,
				    sc.plant_manager AS plantManager,
				    sc.stores_head AS storesHead,

				    sc.photo_path AS photoPath,
				    sc.attachment_path AS attachmentPath,

				    sc.created_by AS createdBy,
				    sc.created_date AS createdDate

				FROM supplier_claim sc

				WHERE

				(:supplierName IS NULL OR :supplierName = ''
				 OR sc.supplier_name LIKE '%' + :supplierName + '%')

				AND

				(:claimedBy IS NULL OR :claimedBy = ''
				 OR sc.claimed_by LIKE '%' + :claimedBy + '%')

				AND

				(:responsible IS NULL OR :responsible = ''
				 OR sc.responsible LIKE '%' + :responsible + '%')

				AND

				(:yesNo IS NULL OR :yesNo = ''
				 OR sc.yes_no = :yesNo)

				AND (

				(:startDate IS NULL OR :startDate = '')
				OR
				(:endDate IS NULL OR :endDate = '')

				OR

				TRY_CONVERT(datetime, sc.claim_date, 120)
				BETWEEN
				TRY_CONVERT(datetime, :startDate, 120)
				AND
				TRY_CONVERT(datetime, :endDate, 120)

				)

				ORDER BY sc.id DESC

				""",

				countQuery = """

				SELECT COUNT(*)

				FROM supplier_claim sc

				WHERE

				(:supplierName IS NULL OR :supplierName = ''
				 OR sc.supplier_name LIKE '%' + :supplierName + '%')

				AND

				(:claimedBy IS NULL OR :claimedBy = ''
				 OR sc.claimed_by LIKE '%' + :claimedBy + '%')

				AND

				(:responsible IS NULL OR :responsible = ''
				 OR sc.responsible LIKE '%' + :responsible + '%')

				AND

				(:yesNo IS NULL OR :yesNo = ''
				 OR sc.yes_no = :yesNo)

				AND (

				(:startDate IS NULL OR :startDate = '')
				OR
				(:endDate IS NULL OR :endDate = '')

				OR

				TRY_CONVERT(datetime, sc.claim_date, 120)
				BETWEEN
				TRY_CONVERT(datetime, :startDate, 120)
				AND
				TRY_CONVERT(datetime, :endDate, 120)

				)

				""",

				nativeQuery = true)
				Page<SupplierClaimReportDTO> getSupplierClaimReport(

				        @Param("supplierName") String supplierName,

				        @Param("claimedBy") String claimedBy,

				        @Param("responsible") String responsible,

				        @Param("yesNo") String yesNo,

				        @Param("startDate") String startDate,

				        @Param("endDate") String endDate,

				        Pageable pageable
				);
	  
}
