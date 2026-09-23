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
@Table(name = "quality_incoming_log")
public class Qualityincoming {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name="id")
	    private Long qualityIncomingId;
	    
	    @ManyToOne
		@JoinColumn(name="In_material")
		@JsonIgnoreProperties("qualityincomings")
		private IncomingMaterial inMaterial;

	    @Column(name="qa_status")
	    private String qaStatus;

	    
		@Column(name = "created_by")
		private String createdBy;

		@Column(name = "status")
		private String status;
		
		@Column(name = "remark")
		private String remark;
		
		@Column(name = "date_time_creation")
		private String dateTimeCreation;

		@Column(name = "date_time_modified")
		private String dateTimeModified;


		@Column(name = "operation")
		private String operation;
		
		
		


		public Long getQualityIncomingId() {
			return qualityIncomingId;
		}


		public void setQualityIncomingId(Long qualityIncomingId) {
			this.qualityIncomingId = qualityIncomingId;
		}


		public IncomingMaterial getInMaterial() {
			return inMaterial;
		}


		public void setInMaterial(IncomingMaterial inMaterial) {
			this.inMaterial = inMaterial;
		}


		public String getQaStatus() {
			return qaStatus;
		}


		public void setQaStatus(String qaStatus) {
			this.qaStatus = qaStatus;
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


		public String getRemark() {
			return remark;
		}


		public void setRemark(String remark) {
			this.remark = remark;
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


		public String getOperation() {
			return operation;
		}


		public void setOperation(String operation) {
			this.operation = operation;
		}


		public Qualityincoming(Long qualityIncomingId, IncomingMaterial inMaterial, String qaStatus, String createdBy,
				String status, String remark, String dateTimeCreation, String dateTimeModified, String operation) {
			super();
			this.qualityIncomingId = qualityIncomingId;
			this.inMaterial = inMaterial;
			this.qaStatus = qaStatus;
			this.createdBy = createdBy;
			this.status = status;
			this.remark = remark;
			this.dateTimeCreation = dateTimeCreation;
			this.dateTimeModified = dateTimeModified;
			this.operation = operation;
		}


		public Qualityincoming() {
			super();
			// TODO Auto-generated constructor stub
		}
		
		
		
		

}
