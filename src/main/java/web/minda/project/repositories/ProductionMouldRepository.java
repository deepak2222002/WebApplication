package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.ProductionMouldMaster;

public interface ProductionMouldRepository extends JpaRepository<ProductionMouldMaster, Long>{


	@Query(value="""
			select mould from production_mould_master 
			""",nativeQuery = true)
	public List<String> getAllMouldNameInList();
	
	boolean existsByMould(String mould);

	@Query("""
			SELECT m FROM ProductionMouldMaster m
			WHERE (:mould IS NULL OR :mould = '' OR m.mould LIKE %:mould%)
			AND (:description IS NULL OR :description = '' OR m.description LIKE %:description%)
			AND (:status IS NULL OR :status = '' OR m.status = :status)
			AND (:createdBy IS NULL OR :createdBy = '' OR m.createdBy = :createdBy)
			""")
	Page<ProductionMouldMaster> getLikeMould(
	        String mould,
	        String description,
	        String status,
	        String createdBy,
	        Pageable pageable
	);

	@Query("""
	SELECT m FROM ProductionMouldMaster m
	WHERE (:mould IS NULL OR m.mould LIKE %:mould%)
	AND (:description IS NULL OR m.description LIKE %:description%)
	AND (:status IS NULL OR m.status = :status)
	AND (:createdBy IS NULL OR m.createdBy = :createdBy)
	""")
	List<ProductionMouldMaster> getAllMoulds(
	        String mould,
	        String description,
	        String status,
	        String createdBy
	);

	Optional<ProductionMouldMaster> findByMould(String mouldName);

	public ProductionMouldMaster findByMouldIgnoreCase(String trim);

	List<ProductionMouldMaster> findByMouldIn(List<String> mouldList);

}
