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
@Table(name = "store_incoming_quarantine")
public class StoreIncomingQuarantine {
	
	
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name="id")
	    private Long storeIncomingQuarantineId;
	  
	    @ManyToOne
		@JoinColumn(name="In_material")
		@JsonIgnoreProperties("storeIncomingQuarantine")
		private IncomingMaterial inMaterial;
	
		@Column(name = "quarantine_document")
		private String quarantineDocument;
		
		@Column(name = "quarantine_remark")
		private String quarentineRemark;
		
		@Column(name = "qa_barcode")
		private String qaBarcode;
		
		@Column(name = "location")
		private String location;
		
		@Column(name = "part_type")
		private String part_type;
		
		@Column(name = "qa_status")
		private String qaStatus;
		
		@Column(name = "quarantine_label_paste_status")
		private String quarantineLabelPasteStatus;
		
		@Column(name = "created_by")
		private String createdBy;
		
		@Column(name = "status")
		private String status;
		
		@Column(name = "date_time_creation")
		private String dateTimeCreation;

		@Column(name = "date_time_modified")
		private String dateTimeModified;

		public Long getStoreIncomingQuarantineId() {
			return storeIncomingQuarantineId;
		}

		public void setStoreIncomingQuarantineId(Long storeIncomingQuarantineId) {
			this.storeIncomingQuarantineId = storeIncomingQuarantineId;
		}

		public IncomingMaterial getInMaterial() {
			return inMaterial;
		}

		public void setInMaterial(IncomingMaterial inMaterial) {
			this.inMaterial = inMaterial;
		}

		public String getQuarantineDocument() {
			return quarantineDocument;
		}

		public void setQuarantineDocument(String quarantineDocument) {
			this.quarantineDocument = quarantineDocument;
		}

		public String getQuarentineRemark() {
			return quarentineRemark;
		}

		public void setQuarentineRemark(String quarentineRemark) {
			this.quarentineRemark = quarentineRemark;
		}

		public String getQaBarcode() {
			return qaBarcode;
		}

		public void setQaBarcode(String qaBarcode) {
			this.qaBarcode = qaBarcode;
		}

		public String getLocation() {
			return location;
		}

		public void setLocation(String location) {
			this.location = location;
		}

		public String getPart_type() {
			return part_type;
		}

		public void setPart_type(String part_type) {
			this.part_type = part_type;
		}

		public String getQaStatus() {
			return qaStatus;
		}

		public void setQaStatus(String qaStatus) {
			this.qaStatus = qaStatus;
		}

		public String getQuarantineLabelPasteStatus() {
			return quarantineLabelPasteStatus;
		}

		public void setQuarantineLabelPasteStatus(String quarantineLabelPasteStatus) {
			this.quarantineLabelPasteStatus = quarantineLabelPasteStatus;
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


		public StoreIncomingQuarantine(Long storeIncomingQuarantineId, IncomingMaterial inMaterial,
				String quarantineDocument, String quarentineRemark, String qaBarcode, String location, String part_type,
				String qaStatus, String quarantineLabelPasteStatus, String createdBy, String status,
				String dateTimeCreation, String dateTimeModified) {
			super();
			this.storeIncomingQuarantineId = storeIncomingQuarantineId;
			this.inMaterial = inMaterial;
			this.quarantineDocument = quarantineDocument;
			this.quarentineRemark = quarentineRemark;
			this.qaBarcode = qaBarcode;
			this.location = location;
			this.part_type = part_type;
			this.qaStatus = qaStatus;
			this.quarantineLabelPasteStatus = quarantineLabelPasteStatus;
			this.createdBy = createdBy;
			this.status = status;
			this.dateTimeCreation = dateTimeCreation;
			this.dateTimeModified = dateTimeModified;
		}

		public StoreIncomingQuarantine() {
			super();
			// TODO Auto-generated constructor stub
		}

	
}
