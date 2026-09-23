//package web.minda.project.repositories;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.CrudRepository;
//import org.springframework.data.repository.query.Param;
//
//import web.minda.project.entity.BreakdownMaster;
//import web.minda.project.entity.MachineMaster;
//import web.minda.project.entity.SubBreakdownMaster;
//
//public interface SubBreakdownMasterRepository extends CrudRepository<SubBreakdownMaster, Long> {
//
//	@Query("select s_b_m.subBreakdownId, s_b_m.subBreakdown from SubBreakdownMaster s_b_m where s_b_m.breakdown= :breakdown")
//	public List<String> findByBreakdowns(@Param("breakdown") BreakdownMaster breakdown);
//
//	@Query("select CONCAT_WS(';', s_b_m.breakdown.breakdownCategory, s_b_m.subBreakdown, s_b_m.createdBy, s_b_m.dateTime ) from SubBreakdownMaster s_b_m")
//	List<String> getalldata();
//
//	@Query(value = "Select * FROM sub_breakdown_master", nativeQuery = true)
//	Page<SubBreakdownMaster> getalldata1(Pageable pageable);
//
//	boolean existsByBreakdown(BreakdownMaster breakdown);
//
//	boolean existsBySubBreakdown(String subBreakdown);
//
//	@Query("SELECT x FROM SubBreakdownMaster x JOIN x.breakdown y WHERE (x.subBreakdown IS NULL OR x.subBreakdown LIKE %:subBreakdown%) AND (x.description IS NULL OR x.description LIKE %:description%) AND (y.breakdownCategory IS NULL OR y.breakdownCategory LIKE %:breakdownCategory%)")
//	public Page<SubBreakdownMaster> getLikeSubBreakdown(@Param("breakdownCategory") String breakdownCategory,
//			@Param("description") String description, @Param("subBreakdown") String subBreakdown, Pageable pageable);
//
//	@Query("select p_m from SubBreakdownMaster p_m WHERE p_m.subBreakdownId= :subBreakdownId")
//	public SubBreakdownMaster findSubBreakdownMasterId(@Param("subBreakdownId") Long subBreakdownId);
//}

package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.BreakdownMaster;
import web.minda.project.entity.SubBreakdownMaster;

public interface SubBreakdownMasterRepository extends CrudRepository<SubBreakdownMaster, Long> {

	@Query("select s_b_m.subBreakdown from SubBreakdownMaster s_b_m where s_b_m.breakdown= :breakdown")
	public List<String> findByBreakdowns(@Param("breakdown") BreakdownMaster breakdown);

	boolean existsByBreakdown(BreakdownMaster breakdown);

	boolean existsBySubBreakdown(String subBreakdown);

	@Query("SELECT x FROM SubBreakdownMaster x JOIN x.breakdown y WHERE (x.subBreakdown IS NULL OR x.subBreakdown LIKE %:subBreakdown%) AND (x.description IS NULL OR x.description LIKE %:description%) AND (y.breakdownCategory IS NULL OR y.breakdownCategory LIKE %:breakdownCategory%)")
	public Page<SubBreakdownMaster> getLikeSubBreakdown(@Param("breakdownCategory") String breakdownCategory,
			@Param("description") String description, @Param("subBreakdown") String subBreakdown, Pageable pageable);

	@Query("select p_m from SubBreakdownMaster p_m WHERE p_m.subBreakdownId= :subBreakdownId")
	public SubBreakdownMaster findSubBreakdownMasterId(@Param("subBreakdownId") Long subBreakdownId);

	@Query("SELECT s.subBreakdownId ,s.subBreakdown FROM SubBreakdownMaster s JOIN s.breakdown b WHERE b IN (SELECT sb.breakdown FROM SubBreakdownMaster sb WHERE sb.subBreakdown = :subBreakdown)")
	public List<List<String>> getAllSubBreakdownsOfSameBreakdown(@Param("subBreakdown") String subBreakdown);
}
