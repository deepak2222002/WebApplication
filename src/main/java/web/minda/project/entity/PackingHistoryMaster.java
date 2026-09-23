package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "packing_history_master")
public class PackingHistoryMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long packingId;
	
	@Column(name = "internalArticleName")
	private String internalArticleName;
	
	@Column(name = "customerArticleName")
	private String customerArticleName;
	
	@Column(name = "customer_name")
	private String customerName;
	
	@Column(name = "customer_no")
	private String customerNo;
	
    @Column(name = "pieces_per_box")
    private Integer piecesPerBox;
	
	@Column(name = "box_no")
	private String boxNo;
	
	@Column(name = "lot_number")
	private String lotNumber;
	
	@Column(name = "total_peices")
	private String totalPeices;
	
    @Column(name = "destination")
    private String destination;
	
	@Column(name = "package_type")
	private String packageType;
	
	@Column(name = "handover_status")
	private String handoverStatus;
	
	@Column(name = "dispatch_status")
	private String dispatchStatus;

    @Column(name = "supplier_number")
    private String supplierNumber;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time")
	private String dateTime;

	@Column(name = "status")
	private String status;

	public Long getPackingId() {
		return packingId;
	}

	public void setPackingId(Long packingId) {
		this.packingId = packingId;
	}

	public String getInternalArticleName() {
		return internalArticleName;
	}

	public void setInternalArticleName(String internalArticleName) {
		this.internalArticleName = internalArticleName;
	}

	public String getCustomerArticleName() {
		return customerArticleName;
	}

	public void setCustomerArticleName(String customerArticleName) {
		this.customerArticleName = customerArticleName;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerNo() {
		return customerNo;
	}

	public void setCustomerNo(String customerNo) {
		this.customerNo = customerNo;
	}

	public Integer getPiecesPerBox() {
		return piecesPerBox;
	}

	public void setPiecesPerBox(Integer piecesPerBox) {
		this.piecesPerBox = piecesPerBox;
	}

	public String getBoxNo() {
		return boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getLotNumber() {
		return lotNumber;
	}

	public void setLotNumber(String lotNumber) {
		this.lotNumber = lotNumber;
	}

	public String getTotalPeices() {
		return totalPeices;
	}

	public void setTotalPeices(String totalPeices) {
		this.totalPeices = totalPeices;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getPackageType() {
		return packageType;
	}

	public void setPackageType(String packageType) {
		this.packageType = packageType;
	}

	public String getHandoverStatus() {
		return handoverStatus;
	}

	public void setHandoverStatus(String handoverStatus) {
		this.handoverStatus = handoverStatus;
	}

	public String getDispatchStatus() {
		return dispatchStatus;
	}

	public void setDispatchStatus(String dispatchStatus) {
		this.dispatchStatus = dispatchStatus;
	}

	public String getSupplierNumber() {
		return supplierNumber;
	}

	public void setSupplierNumber(String supplierNumber) {
		this.supplierNumber = supplierNumber;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getDateTime() {
		return dateTime;
	}

	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public PackingHistoryMaster(Long packingId, String internalArticleName, String customerArticleName,
			String customerName, String customerNo, Integer piecesPerBox, String boxNo, String lotNumber,
			String totalPeices, String destination, String packageType, String handoverStatus, String dispatchStatus,
			String supplierNumber, String createdBy, String dateTime, String status) {
		super();
		this.packingId = packingId;
		this.internalArticleName = internalArticleName;
		this.customerArticleName = customerArticleName;
		this.customerName = customerName;
		this.customerNo = customerNo;
		this.piecesPerBox = piecesPerBox;
		this.boxNo = boxNo;
		this.lotNumber = lotNumber;
		this.totalPeices = totalPeices;
		this.destination = destination;
		this.packageType = packageType;
		this.handoverStatus = handoverStatus;
		this.dispatchStatus = dispatchStatus;
		this.supplierNumber = supplierNumber;
		this.createdBy = createdBy;
		this.dateTime = dateTime;
		this.status = status;
	}

	public PackingHistoryMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	

}
