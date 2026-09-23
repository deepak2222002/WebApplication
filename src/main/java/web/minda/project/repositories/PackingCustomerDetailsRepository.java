package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.PackingCustomerDetails;

public interface PackingCustomerDetailsRepository extends JpaRepository<PackingCustomerDetails, Long>{

	@Query(value="""
			select customer_name from packing_customer_details 
			""",nativeQuery = true)
	public List<String> getAllPackingCustomerDetails();
	
	
	@Query(value="SELECT * FROM packing_customer_details ",nativeQuery = true)
	List<PackingCustomerDetails> getAllPackingCustomerMasters();


	
	@Query(value = """
			SELECT * FROM packing_customer_details  where customer_name =:customerName
			""",nativeQuery = true)
	List<PackingCustomerDetails> getAllPackingCustomerDetailFromArticle(@Param("customerName") String customerName);
	
	@Query(value = """
			SELECT * FROM packing_customer_details  where destination_code =:destinationCode
			""",nativeQuery = true)
	List<PackingCustomerDetails> getAllPackingCustomerDetailFromDestinationCode(@Param("destinationCode") String destinationCode);
	
	
	Optional<PackingCustomerDetails> findByPackingCustomerDetailId(Long packingCustomerDetailId);
	Optional<PackingCustomerDetails> findByCustomerName(String customerName );
	Optional<PackingCustomerDetails> findByCustomerNameAndDestinationCode(String customerName,String destinationCode);
	Optional<PackingCustomerDetails> findByCustomerNameAndDescriptionAndDestinationCodeAndAddress1AndAddress2AndAddress3AndAddress4(String customerNameString ,String description,String destinationCode, String address1, String address2,String address3,String address4 );
	


	boolean existsByPackingCustomerDetailId(Long packingCustomerDetailId);
	boolean existsByCustomerName(String customerName );
	boolean existsByCustomerNameAndDestinationCode(String customerName,String destinationCode);
	boolean existsByCustomerNameAndDescriptionAndDestinationCodeAndAddress1AndAddress2AndAddress3AndAddress4(String customerNameString ,String description,String destinationCode, String address1, String address2,String address3,String address4 );
	
	@Query(value = """
			SELECT CONCAT_WS(';',customer_name,description,destination_code,address_1,address_2,address_3,address_4,status,created_by,
			 date_time_modified) FROM packing_customer_details 
			""",
		       nativeQuery = true)
		List<PackingCustomerDetails> getalldata();
	
	@Query(
		    value = """
		    SELECT pcd.* FROM packing_customer_details pcd
		    WHERE (:customer_name IS NULL OR :customer_name = '' OR LOWER(pcd.customer_name) LIKE LOWER(CONCAT('%', :customer_name, '%')))
		    AND (:description IS NULL OR :description = '' OR LOWER(pcd.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:destination_code IS NULL OR :destination_code = '' OR LOWER(pcd.destination_code) LIKE LOWER(CONCAT('%', :destination_code, '%')))
		    AND (:address_1 IS NULL OR :address_1 = '' OR LOWER(pcd.address_1) LIKE LOWER(CONCAT('%', :address_1, '%')))
		    AND (:address_2 IS NULL OR :address_2 = '' OR LOWER(pcd.address_2) LIKE LOWER(CONCAT('%', :address_2, '%')))
		    AND (:address_3 IS NULL OR :address_3 = '' OR LOWER(pcd.address_3) LIKE LOWER(CONCAT('%', :address_3, '%')))
		    AND (:address_4 IS NULL OR :address_4 = '' OR LOWER(pcd.address_4) LIKE LOWER(CONCAT('%', :address_4, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pcd.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    countQuery = """
		    SELECT COUNT(*) FROM packing_customer_details pcd
		    WHERE (:customer_name IS NULL OR :customer_name = '' OR LOWER(pcd.customer_name) LIKE LOWER(CONCAT('%', :customer_name, '%')))
		    AND (:description IS NULL OR :description = '' OR LOWER(pcd.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:destination_code IS NULL OR :destination_code = '' OR LOWER(pcd.destination_code) LIKE LOWER(CONCAT('%', :destination_code, '%')))
		    AND (:address_1 IS NULL OR :address_1 = '' OR LOWER(pcd.address_1) LIKE LOWER(CONCAT('%', :address_1, '%')))
		    AND (:address_2 IS NULL OR :address_2 = '' OR LOWER(pcd.address_2) LIKE LOWER(CONCAT('%', :address_2, '%')))
		    AND (:address_3 IS NULL OR :address_3 = '' OR LOWER(pcd.address_3) LIKE LOWER(CONCAT('%', :address_3, '%')))
		    AND (:address_4 IS NULL OR :address_4 = '' OR LOWER(pcd.address_4) LIKE LOWER(CONCAT('%', :address_4, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pcd.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    nativeQuery = true
		)
		Page<PackingCustomerDetails> getLikePackingCustomerDetails(
		        @Param("customer_name") String customer_name,
		        @Param("description") String description,
		        @Param("destination_code") String destination_code,
		        @Param("address_1") String address_1,
		        @Param("address_2") String address_2,
		        @Param("address_3") String address_3,
		        @Param("address_4") String address_4,
		        @Param("createdBy") String createdBy,
		        Pageable pageable);


	public boolean existsByCustomerNameAndDestinationCodeAndPackingCustomerDetailIdNot(String customerName,
			String destinationCode, Long packingCustomerDetailId);

	@Query(value="""
			select customer_name from packing_customer_details 
			""",nativeQuery = true)
	public List<String> getAllCustomerNameInList();
	
	
	@Query(value = """
		    SELECT pcd.* 
		    FROM packing_customer_details pcd
		    WHERE (:customer_name IS NULL OR :customer_name = '' 
		           OR LOWER(pcd.customer_name) LIKE LOWER(CONCAT('%', :customer_name, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pcd.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:destination_code IS NULL OR :destination_code = '' 
		         OR LOWER(pcd.destination_code) LIKE LOWER(CONCAT('%', :destination_code, '%')))
		    AND (:address_1 IS NULL OR :address_1 = '' 
		         OR LOWER(pcd.address_1) LIKE LOWER(CONCAT('%', :address_1, '%')))
		    AND (:address_2 IS NULL OR :address_2 = '' 
		         OR LOWER(pcd.address_2) LIKE LOWER(CONCAT('%', :address_2, '%')))
		    AND (:address_3 IS NULL OR :address_3 = '' 
		         OR LOWER(pcd.address_3) LIKE LOWER(CONCAT('%', :address_3, '%')))
		    AND (:address_4 IS NULL OR :address_4 = '' 
		         OR LOWER(pcd.address_4) LIKE LOWER(CONCAT('%', :address_4, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pcd.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<PackingCustomerDetails> getAllPackingCustomerDetailsMaster(
		        @Param("customer_name") String customer_name,
		        @Param("description") String description,
		        @Param("destination_code") String destination_code,
		        @Param("address_1") String address_1,
		        @Param("address_2") String address_2,
		        @Param("address_3") String address_3,
		        @Param("address_4") String address_4,
		        @Param("createdBy") String createdBy
		);
	
	
	
}
