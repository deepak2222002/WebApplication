package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "store_material_location")
public class StoreMaterialLocation {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id")
	    private Long storeMaterialLocationId;
	    
	    @Column(name = "material_barcode")
	    private String materialBarcode;
	    
	    @Column(name = "qa_barcode")
	    private String qaBarcode;
	    
	    @Column(name = "location_barcode")
	    private String locationBarcode;
	    
	    @Column(name = "location_name")
	    private String locationName;

		@Column(name = "created_by")
		private String createdBy;

		@Column(name = "status")
		private String status;
		
		
		@Column(name = "part_name")
		private String partName;
		
		@Column(name = "category")
		private String category;
		
		@Column(name = "date_time_creation")
		private String dateTimeCreation;

		@Column(name = "date_time_modified")
		private String dateTimeModified;

		public Long getStoreMaterialLocationId() {
			return storeMaterialLocationId;
		}

		public void setStoreMaterialLocationId(Long storeMaterialLocationId) {
			this.storeMaterialLocationId = storeMaterialLocationId;
		}

		public String getMaterialBarcode() {
			return materialBarcode;
		}

		public void setMaterialBarcode(String materialBarcode) {
			this.materialBarcode = materialBarcode;
		}

		public String getQaBarcode() {
			return qaBarcode;
		}

		public void setQaBarcode(String qaBarcode) {
			this.qaBarcode = qaBarcode;
		}

		public String getLocationBarcode() {
			return locationBarcode;
		}

		public void setLocationBarcode(String locationBarcode) {
			this.locationBarcode = locationBarcode;
		}

		public String getLocationName() {
			return locationName;
		}

		public void setLocationName(String locationName) {
			this.locationName = locationName;
		}

		public String getCreatedBy() {
			return createdBy;
		}

		public void setCreatedBy(String createdBy) {
			this.createdBy = createdBy;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public String getPartName() {
			return partName;
		}

		public void setPartName(String partName) {
			this.partName = partName;
		}

		public String getCategory() {
			return category;
		}

		public void setCategory(String category) {
			this.category = category;
		}

		public String getDateTimeCreation() {
			return dateTimeCreation;
		}

		public void setDateTimeCreation(String dateTimeCreation) {
			this.dateTimeCreation = dateTimeCreation;
		}

		public String getDateTimeModified() {
			return dateTimeModified;
		}

		public void setDateTimeModified(String dateTimeModified) {
			this.dateTimeModified = dateTimeModified;
		}

		public StoreMaterialLocation(Long storeMaterialLocationId, String materialBarcode, String qaBarcode,
				String locationBarcode, String locationName, String createdBy, String status, String partName,
				String category, String dateTimeCreation, String dateTimeModified) {
			super();
			this.storeMaterialLocationId = storeMaterialLocationId;
			this.materialBarcode = materialBarcode;
			this.qaBarcode = qaBarcode;
			this.locationBarcode = locationBarcode;
			this.locationName = locationName;
			this.createdBy = createdBy;
			this.status = status;
			this.partName = partName;
			this.category = category;
			this.dateTimeCreation = dateTimeCreation;
			this.dateTimeModified = dateTimeModified;
		}

		public StoreMaterialLocation() {
			super();
			// TODO Auto-generated constructor stub
		}

	
	
}
