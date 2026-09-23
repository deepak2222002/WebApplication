package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import web.minda.project.entity.BreakdownMaster;

public interface BreakdownMasterRepository extends CrudRepository<BreakdownMaster, Long> {

	@Query("select b_m.breakdownCategory from BreakdownMaster b_m")
	public List<String> getAllBreakdownInList();

//	@Query("select CONCAT_WS(';', b_m.breakdownCategory, b_m.createdBy, b_m.dateTime ) from BreakdownMaster b_m")
//	List<String> getalldata();

	@Query(value = "Select * FROM breakdown_master", nativeQuery = true)
	Page<BreakdownMaster> getalldata1(Pageable pageable);

	boolean existsByBreakdownCategory(String breakDownCategory);

	Optional<BreakdownMaster> findByBreakdownCategory(String breakdownCategory);

	@Query(value = "SELECT x.* FROM breakdown_master x where (x.breakdown_category is null or x.breakdown_category like %:breakdownCategory%);", nativeQuery = true)
	public Page<BreakdownMaster> getLikeBreakdown(@Param("breakdownCategory") String breakdownCategory,
			Pageable pageable);
}
