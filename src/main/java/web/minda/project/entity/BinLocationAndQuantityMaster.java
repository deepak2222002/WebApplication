package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "bin_location_quantity_master")
public class BinLocationAndQuantityMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long binLocationId;
	
	@Column(name = "articleName")
	private String articleName;

	@Column(name = "bin_name")
	private String binName;

	@Column(name = "quantity")
	private String quantity;
	
	@Column(name = "bin_status")
	private String binStatus;
	
	@Column(name = "plc_ip")
	private String plcIp;
	
	@Column(name = "bin_connected_point")
	private String binConnectedPoint;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "image")
	private String image;

	public Long getBinLocationId() {
		return binLocationId;
	}

	public void setBinLocationId(Long binLocationId) {
		this.binLocationId = binLocationId;
	}

	public String getArticleName() {
		return articleName;
	}

	public void setArticleName(String articleName) {
		this.articleName = articleName;
	}

	public String getBinName() {
		return binName;
	}

	public void setBinName(String binName) {
		this.binName = binName;
	}

	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}

	public String getBinStatus() {
		return binStatus;
	}

	public void setBinStatus(String binStatus) {
		this.binStatus = binStatus;
	}

	public String getPlcIp() {
		return plcIp;
	}

	public void setPlcIp(String plcIp) {
		this.plcIp = plcIp;
	}

	public String getBinConnectedPoint() {
		return binConnectedPoint;
	}

	public void setBinConnectedPoint(String binConnectedPoint) {
		this.binConnectedPoint = binConnectedPoint;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
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

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public BinLocationAndQuantityMaster(Long binLocationId, String articleName, String binName, String quantity,
			String binStatus, String plcIp, String binConnectedPoint, String createdBy, String dateTimeCreation,
			String dateTimeModified, String image) {
		super();
		this.binLocationId = binLocationId;
		this.articleName = articleName;
		this.binName = binName;
		this.quantity = quantity;
		this.binStatus = binStatus;
		this.plcIp = plcIp;
		this.binConnectedPoint = binConnectedPoint;
		this.createdBy = createdBy;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
	}

	public BinLocationAndQuantityMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	


}
