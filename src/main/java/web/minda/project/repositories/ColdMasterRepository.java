package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ColdMaster;

public interface ColdMasterRepository extends JpaRepository<ColdMaster, Long>{

	boolean existsByColdName(String coldName);

	@Query(value = """
	        SELECT cm.*
	        FROM cold_master cm
	        LEFT JOIN mould_master mm ON mm.id = cm.mould_id

	        WHERE (:coldName IS NULL OR :coldName = '' 
	        OR cm.cold_name LIKE %:coldName%)

	        AND (:mouldName IS NULL OR :mouldName = '' 
	        OR mm.mould_name LIKE %:mouldName%)

	        """,

	        countQuery = """
	        SELECT COUNT(*)
	        FROM cold_master cm
	        LEFT JOIN mould_master mm ON mm.id = cm.mould_id

	        WHERE (:coldName IS NULL OR :coldName = '' 
	        OR cm.cold_name LIKE %:coldName%)

	        AND (:mouldName IS NULL OR :mouldName = '' 
	        OR mm.mould_name LIKE %:mouldName%)

	        """,

	        nativeQuery = true)
	Page<ColdMaster> getLikecold(
	        @Param("coldName") String coldName,
	        @Param("mouldName") String mouldName,
	        Pageable pageable);
	
	
	boolean existsByColdNameAndColdIdNot(
	        String coldName,
	        Long coldId
	);

	@Query(value = """
	        SELECT cm.*
	        FROM cold_master cm
	        LEFT JOIN mould_master mm ON mm.id = cm.mould_id

	        WHERE (:coldName IS NULL OR :coldName = ''
	        OR cm.cold_name LIKE %:coldName%)

	        AND (:mouldName IS NULL OR :mouldName = ''
	        OR mm.mould_name LIKE %:mouldName%)

	        """,
	        nativeQuery = true)
	List<ColdMaster> getAllColdMaster(
	        @Param("coldName") String coldName,
	        @Param("mouldName") String mouldName
	);
	
	
	
	@Query(value = """
          SELECT pam.cold_name
		    FROM cold_master pam
		   left JOIN mould_master pamst 
		        ON pam.mould_id = pamst.id	
		    WHERE pamst.mould_name = :mould
		""", nativeQuery = true)
		List<String> getColdRunnerByMould(@Param("mould") String mould);

}
