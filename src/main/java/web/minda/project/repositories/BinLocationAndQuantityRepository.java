package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.BinLocationAndQuantityMaster;

public interface BinLocationAndQuantityRepository extends JpaRepository<BinLocationAndQuantityMaster, Long> {

	Optional<BinLocationAndQuantityMaster> findByArticleName(String articleName);

	@Query(value = """
		    SELECT
		        article_name,
		        bin_name,
		        bin_connected_point,
		        quantity,
		        plc_ip
		    FROM bin_location_quantity_master
		    WHERE article_name = :articleName
		      AND bin_connected_point IS NOT NULL
		      AND quantity IS NOT NULL
		    ORDER BY bin_name
		    """, nativeQuery = true)
		List<Object[]> getBinDetails(@Param("articleName") String articleName);
		
		
		@Modifying(clearAutomatically = true)
		@Transactional
		@Query(value = """
		    UPDATE bin_location_quantity_master
		    SET bin_status = :binStatus,
		        quantity = :quantity
		    WHERE bin_name = :binName
		    """, nativeQuery = true)
		int updateBinStatusAndQuantity(
		        @Param("binName") String binName,
		        @Param("binStatus") String binStatus,
		        @Param("quantity") String quantity);

}
