package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import web.minda.project.entity.StoreQuarantineExpireDateExtend;

public interface StoreQuarantineExpireDateExtendRepository extends JpaRepository<StoreQuarantineExpireDateExtend, Long>{
	
	@Query("""
		    SELECT e FROM StoreQuarantineExpireDateExtend e
		    WHERE e.inMaterial.incomingMaterialId = :incomingId
		    ORDER BY e.dateTimeCreation DESC
		""")
		List<StoreQuarantineExpireDateExtend> findLatestByIncomingId(Long incomingId);

}
