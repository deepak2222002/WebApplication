package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProductionCompoundMaster;

public interface ProductionCompoundRepository extends JpaRepository<ProductionCompoundMaster, Long> {
	
	
    boolean existsByCompoundAndBatchWeight(String compound, String batchWeight);

    @Query("SELECT p FROM ProductionCompoundMaster p " +
           "WHERE (:compound IS NULL OR LOWER(p.compound) LIKE LOWER(CONCAT('%', :compound, '%'))) " +
           "AND (:masterBatch IS NULL OR LOWER(p.masterBatch) LIKE LOWER(CONCAT('%', :masterBatch, '%')))")
    Page<ProductionCompoundMaster> search(
            @Param("compound") String compound,
            @Param("masterBatch") String masterBatch,
            Pageable pageable
    );

	boolean existsByCompoundAndMasterBatchAndFormulaNoAndBatchWeightAndExpiry(String compound, String masterBatch,
			String formulaNo, String batchWeight, String expiry);

	Optional<ProductionCompoundMaster> findByCompound(String compoundName);

	boolean existsByCompound(String compound);

}
