package web.minda.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "store_quarantine_expiredate_extend")
public class StoreQuarantineExpireDateExtend {
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name="id")
	    private Long storeQuarantineExpireDateExtendId;
	    
		@Column(name = "expire_date")
		private String expireDate;
		
		   @ManyToOne
			@JoinColumn(name="In_material")
			@JsonIgnoreProperties("storeQuarantineExpireDateExtend")
			private IncomingMaterial inMaterial;
		   
			@Column(name = "created_by")
			private String createdBy;
			
			@Column(name = "status")
			private String status;
			
			@Column(name = "date_time_creation")
			private String dateTimeCreation;

			@Column(name = "date_time_modified")
			private String dateTimeModified;

			public Long getStoreQuarantineExpireDateExtendId() {
				return storeQuarantineExpireDateExtendId;
			}

			public void setStoreQuarantineExpireDateExtendId(Long storeQuarantineExpireDateExtendId) {
				this.storeQuarantineExpireDateExtendId = storeQuarantineExpireDateExtendId;
			}

			public String getExpireDate() {
				return expireDate;
			}

			public void setExpireDate(String expireDate) {
				this.expireDate = expireDate;
			}

			public IncomingMaterial getInMaterial() {
				return inMaterial;
			}

			public void setInMaterial(IncomingMaterial inMaterial) {
				this.inMaterial = inMaterial;
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



			public StoreQuarantineExpireDateExtend(Long storeQuarantineExpireDateExtendId, String expireDate,
					IncomingMaterial inMaterial, String createdBy, String status, String dateTimeCreation,
					String dateTimeModified) {
				super();
				this.storeQuarantineExpireDateExtendId = storeQuarantineExpireDateExtendId;
				this.expireDate = expireDate;
				this.inMaterial = inMaterial;
				this.createdBy = createdBy;
				this.status = status;
				this.dateTimeCreation = dateTimeCreation;
				this.dateTimeModified = dateTimeModified;
			}

			public StoreQuarantineExpireDateExtend() {
				super();
				// TODO Auto-generated constructor stub
			}
			
			
			
}
