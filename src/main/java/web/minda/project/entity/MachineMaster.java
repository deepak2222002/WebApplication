package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "machine_master")
public class MachineMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long machineId;

	@Column(name = "machine_name")
	private String machineName;

	@Column(name = "description")
	private String description;

	@Column(name = "barcode")
	private String barcode;

	@Column(name = "tonnage")
	private String tonnage;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "image")
	private String image;
	
	@Column(name = "make")
	private String make;
	
	@Column(name = "data_record")
	private String dataRecord;
	
	@Column(name = "ip_address")
	private String ipAddress;
	
	@Column(name = "port")
	private String port;

	public Long getMachineId() {
		return machineId;
	}

	public void setMachineId(Long machineId) {
		this.machineId = machineId;
	}

	public String getMachineName() {
		return machineName;
	}

	public void setMachineName(String machineName) {
		this.machineName = machineName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getTonnage() {
		return tonnage;
	}

	public void setTonnage(String tonnage) {
		this.tonnage = tonnage;
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

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getMake() {
		return make;
	}

	public void setMake(String make) {
		this.make = make;
	}

	public String getDataRecord() {
		return dataRecord;
	}

	public void setDataRecord(String dataRecord) {
		this.dataRecord = dataRecord;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public MachineMaster(Long machineId, String machineName, String description, String barcode, String tonnage,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified, String image,
			String make, String dataRecord, String ipAddress, String port) {
		super();
		this.machineId = machineId;
		this.machineName = machineName;
		this.description = description;
		this.barcode = barcode;
		this.tonnage = tonnage;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.make = make;
		this.dataRecord = dataRecord;
		this.ipAddress = ipAddress;
		this.port = port;
	}

	public MachineMaster() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	

	
}
