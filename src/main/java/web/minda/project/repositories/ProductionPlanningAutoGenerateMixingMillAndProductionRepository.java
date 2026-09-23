package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import web.minda.project.entity.ProductionPlanningAutoGenerateMixingMillAndProduction;

public interface ProductionPlanningAutoGenerateMixingMillAndProductionRepository extends JpaRepository<ProductionPlanningAutoGenerateMixingMillAndProduction, Long> {

	Optional<ProductionPlanningAutoGenerateMixingMillAndProduction>
	findByPlanIdAndChangeoverIdAndCompoundCodeAndType(
	        String planId,
	        Long changeoverId,
	        String compoundCode,
	        String type
	);
	
	
	Optional<ProductionPlanningAutoGenerateMixingMillAndProduction>
	findByPlanIdAndChangeoverIdAndCompoundCodeAndMouldNameAndType(
	        String planId,
	        Long changeoverId,
	        String compoundCode,
	        String mouldName,
	        String type
	);
	
	List<ProductionPlanningAutoGenerateMixingMillAndProduction>
	findByPlanIdAndType(String planId,String type);


	Optional<ProductionPlanningAutoGenerateMixingMillAndProduction> findByPlanIdAndChangeoverIdAndCompoundCodeAndMouldNameAndTypeAndShift(
			String planId, Long changeoverId, String compoundCode, String mouldName, String type, String shift);
	
	
	@Modifying
	@Transactional
	void deleteByPlanIdAndChangeoverIdAndCompoundCodeAndMouldNameAndType(
	        String planId,
	        Long changeoverId,
	        String compoundCode,
	        String mouldName,
	        String type
	);
}
