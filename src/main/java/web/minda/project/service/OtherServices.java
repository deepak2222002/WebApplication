package web.minda.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
//import web.minda.project.repositories.FinalInspectionReadingJpaRepository;

@Service
@Transactional
public class OtherServices {

	@PersistenceContext
	private EntityManager entityManager;

//	@Autowired
//	private FinalInspectionReadingJpaRepository fiaFinalInspectionReadingJpaRepository;

	public List<Object> performDynamicQuery(String columnName, String partNumber, int qualityreadingId) {
		return entityManager
				.createNativeQuery("SELECT status," + columnName
						+ " FROM quality_reading WHERE part_number = :part_number AND id = :id")
				.setParameter("part_number", partNumber).setParameter("id", qualityreadingId).getResultList();
	}
	
	public List<Object> performDynamicQuery2(String partNumber, int qualityreadingId) {
	    return entityManager
	        .createNativeQuery("SELECT status, saving_reading FROM quality_reading WHERE part_number = :part_number AND id = :id")
	        .setParameter("part_number", partNumber)
	        .setParameter("id", qualityreadingId)
	        .getResultList();
	}


	public List<Object> dynamicNativeQuery(String sampling_plan, String partNumber, int qualityreadingId) {
		// TODO Auto-generated method stub
		return null;
	}

//	public List<Object> performDynamicQuery2(String columnName, String partNumber, int finalControlReadingId) {
//		return entityManager
//				.createNativeQuery("SELECT status," + columnName
//						+ " FROM final_control_reading WHERE part_number = :part_number AND id = :id")
//				.setParameter("part_number", partNumber).setParameter("id", finalControlReadingId).getResultList();
//	}

//	public List<Object> performDynamicQueryUsingRepository2(String columnName, String partNumber,
//			int finalControlReadingId) {
//		return fiaFinalInspectionReadingJpaRepository.dynamicNativeQuery2(columnName, partNumber,
//				finalControlReadingId);
//	}

//	public List<Object> dynamicNativeQuery2(String sampling_plan, String partNumber, int finalControlReadingId) {
//		// TODO Auto-generated method stub
//		return null;
//	}
}
