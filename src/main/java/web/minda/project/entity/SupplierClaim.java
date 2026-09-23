package web.minda.project.entity;

import java.util.jar.Attributes.Name;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "supplier_claim")
public class SupplierClaim {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "id")
	    private Long supplierClaimId;
	    
	    @Column(name = "inmaterial_id")
	    private Long incomingMaterialId;
	    
	    @Column(name = "claim_date")
	    private String claimDate;

	    @Column(name = "claimed_by")
	    private String claimedBy;

	    @Column(name = "supplier_name")
	    private String supplierName;

	    @Column(name = "receiving_date")
	    private String receivingDate;

	    @Column(name = "yes_no")
	    private String yesNo;

	    @Column(name = "responsible")
	    private String responsible;

	    @Column(name = "target_date")
	    private String targetDate;

	    @Column(name = "actual_date")
	    private String actualDate;

	    @Column(name = "quality_head")
	    private String qualityHead;

	    @Column(name = "department_head")
	    private String departmentHead;

	    @Column(name = "plant_manager")
	    private String plantManager;

	    @Column(name = "stores_head")
	    private String storesHead;

	    @Column(name = "photo_path")
	    private String photoPath;

	    @Column(name = "attachment_path")
	    private String attachmentPath;

	    @Column(name = "created_by")
	    private String createdBy;

	    @Column(name = "created_date")
	    private String createdDate;

		public Long getSupplierClaimId() {
			return supplierClaimId;
		}

		public void setSupplierClaimId(Long supplierClaimId) {
			this.supplierClaimId = supplierClaimId;
		}

		public Long getIncomingMaterialId() {
			return incomingMaterialId;
		}

		public void setIncomingMaterialId(Long incomingMaterialId) {
			this.incomingMaterialId = incomingMaterialId;
		}

		public String getClaimDate() {
			return claimDate;
		}

		public void setClaimDate(String claimDate) {
			this.claimDate = claimDate;
		}

		public String getClaimedBy() {
			return claimedBy;
		}

		public void setClaimedBy(String claimedBy) {
			this.claimedBy = claimedBy;
		}

		public String getSupplierName() {
			return supplierName;
		}

		public void setSupplierName(String supplierName) {
			this.supplierName = supplierName;
		}

		public String getReceivingDate() {
			return receivingDate;
		}

		public void setReceivingDate(String receivingDate) {
			this.receivingDate = receivingDate;
		}

		public String getYesNo() {
			return yesNo;
		}

		public void setYesNo(String yesNo) {
			this.yesNo = yesNo;
		}

		public String getResponsible() {
			return responsible;
		}

		public void setResponsible(String responsible) {
			this.responsible = responsible;
		}

		public String getTargetDate() {
			return targetDate;
		}

		public void setTargetDate(String targetDate) {
			this.targetDate = targetDate;
		}

		public String getActualDate() {
			return actualDate;
		}

		public void setActualDate(String actualDate) {
			this.actualDate = actualDate;
		}

		public String getQualityHead() {
			return qualityHead;
		}

		public void setQualityHead(String qualityHead) {
			this.qualityHead = qualityHead;
		}

		public String getDepartmentHead() {
			return departmentHead;
		}

		public void setDepartmentHead(String departmentHead) {
			this.departmentHead = departmentHead;
		}

		public String getPlantManager() {
			return plantManager;
		}

		public void setPlantManager(String plantManager) {
			this.plantManager = plantManager;
		}

		public String getStoresHead() {
			return storesHead;
		}

		public void setStoresHead(String storesHead) {
			this.storesHead = storesHead;
		}

		public String getPhotoPath() {
			return photoPath;
		}

		public void setPhotoPath(String photoPath) {
			this.photoPath = photoPath;
		}

		public String getAttachmentPath() {
			return attachmentPath;
		}

		public void setAttachmentPath(String attachmentPath) {
			this.attachmentPath = attachmentPath;
		}

		public String getCreatedBy() {
			return createdBy;
		}

		public void setCreatedBy(String createdBy) {
			this.createdBy = createdBy;
		}

		public String getCreatedDate() {
			return createdDate;
		}

		public void setCreatedDate(String createdDate) {
			this.createdDate = createdDate;
		}


		public SupplierClaim(Long supplierClaimId, Long incomingMaterialId, String claimDate, String claimedBy,
				String supplierName, String receivingDate, String yesNo, String responsible, String targetDate,
				String actualDate, String qualityHead, String departmentHead, String plantManager, String storesHead,
				String photoPath, String attachmentPath, String createdBy, String createdDate) {
			super();
			this.supplierClaimId = supplierClaimId;
			this.incomingMaterialId = incomingMaterialId;
			this.claimDate = claimDate;
			this.claimedBy = claimedBy;
			this.supplierName = supplierName;
			this.receivingDate = receivingDate;
			this.yesNo = yesNo;
			this.responsible = responsible;
			this.targetDate = targetDate;
			this.actualDate = actualDate;
			this.qualityHead = qualityHead;
			this.departmentHead = departmentHead;
			this.plantManager = plantManager;
			this.storesHead = storesHead;
			this.photoPath = photoPath;
			this.attachmentPath = attachmentPath;
			this.createdBy = createdBy;
			this.createdDate = createdDate;
		}

		public SupplierClaim() {
			super();
			// TODO Auto-generated constructor stub
		}
	    
	    

}
