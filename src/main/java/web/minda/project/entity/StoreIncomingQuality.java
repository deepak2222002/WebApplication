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
@Table(name = "store_incoming_quality")
public class StoreIncomingQuality{
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long storeIncomingQualityId;
    
	@Column(name = "qa_barcode")
	private String qaBarcode;
	
	@Column(name = "qa_status")
	private String qaStatus;
	
	@Column(name="qa_doc_path")
	private String qaDocPath;

	@Column(name = "remark")
	private String remark;

	@Column(name = "part_type")
	private String part_type;
	
	@Column(name = "qa_label_paste_status")
	private String qaLabelPasteStatus;
	
	@Column(name = "created_by")
	private String createdBy;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;
	
	
    @ManyToOne
	@JoinColumn(name="In_material")
	@JsonIgnoreProperties("storeIncomingQuality")
	private IncomingMaterial inMaterial;


	public Long getStoreIncomingQualityId() {
		return storeIncomingQualityId;
	}


	public void setStoreIncomingQualityId(Long storeIncomingQualityId) {
		this.storeIncomingQualityId = storeIncomingQualityId;
	}


	public String getQaBarcode() {
		return qaBarcode;
	}


	public void setQaBarcode(String qaBarcode) {
		this.qaBarcode = qaBarcode;
	}


	public String getQaStatus() {
		return qaStatus;
	}


	public void setQaStatus(String qaStatus) {
		this.qaStatus = qaStatus;
	}


	public String getQaDocPath() {
		return qaDocPath;
	}


	public void setQaDocPath(String qaDocPath) {
		this.qaDocPath = qaDocPath;
	}


	public String getRemark() {
		return remark;
	}


	public void setRemark(String remark) {
		this.remark = remark;
	}


	public String getPart_type() {
		return part_type;
	}


	public void setPart_type(String part_type) {
		this.part_type = part_type;
	}


	public String getQaLabelPasteStatus() {
		return qaLabelPasteStatus;
	}


	public void setQaLabelPasteStatus(String qaLabelPasteStatus) {
		this.qaLabelPasteStatus = qaLabelPasteStatus;
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


	public IncomingMaterial getInMaterial() {
		return inMaterial;
	}


	public void setInMaterial(IncomingMaterial inMaterial) {
		this.inMaterial = inMaterial;
	}




	public StoreIncomingQuality(Long storeIncomingQualityId, String qaBarcode, String qaStatus, String qaDocPath,
			String remark, String part_type, String qaLabelPasteStatus, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, IncomingMaterial inMaterial) {
		super();
		this.storeIncomingQualityId = storeIncomingQualityId;
		this.qaBarcode = qaBarcode;
		this.qaStatus = qaStatus;
		this.qaDocPath = qaDocPath;
		this.remark = remark;
		this.part_type = part_type;
		this.qaLabelPasteStatus = qaLabelPasteStatus;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.inMaterial = inMaterial;
	}


	public StoreIncomingQuality() {
		super();
		// TODO Auto-generated constructor stub
	}


	
}
