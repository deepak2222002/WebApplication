package web.minda.project.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionCompoundChildPartMaster;

public interface ProductionCompoundChildPartRepository extends JpaRepository<ProductionCompoundChildPartMaster, Long>{

	@Query("SELECT c FROM ProductionCompoundChildPartMaster c " +
		       "WHERE (:compound IS NULL OR LOWER(c.productionCompoundMaster.compound) LIKE LOWER(CONCAT('%', :compound, '%'))) " +
		       "AND (:acceleraters IS NULL OR LOWER(c.acceleraters) LIKE LOWER(CONCAT('%', :acceleraters, '%')))")
		Page<ProductionCompoundChildPartMaster> search(
		        @Param("compound") String compound,
		        @Param("acceleraters") String acceleraters,
		        Pageable pageable);
	
	
}
