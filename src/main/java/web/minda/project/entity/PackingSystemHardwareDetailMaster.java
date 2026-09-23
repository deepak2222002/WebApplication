package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "packing_system_hardware_detail")
public class PackingSystemHardwareDetailMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long systemId;

	@Column(name = "system_name")
	private String systemName;
	
	@Column(name = "system_address")
	private String systemAddress;
	
	@Column(name = "hardware")
	private String hardware;
	
	@Column(name = "hardware_name")
	private String hardwareName;
	
	@Column(name = "connection_ip")
	private String connectionIp;
	
	@Column(name = "communication_port")
	private String communicationport;
	
	@Column(name = "label_type")
	private String labelType;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time")
	private String dateTime;

	@Column(name = "status")
	private String status;

	public Long getSystemId() {
		return systemId;
	}

	public void setSystemId(Long systemId) {
		this.systemId = systemId;
	}

	public String getSystemName() {
		return systemName;
	}

	public void setSystemName(String systemName) {
		this.systemName = systemName;
	}

	public String getSystemAddress() {
		return systemAddress;
	}

	public void setSystemAddress(String systemAddress) {
		this.systemAddress = systemAddress;
	}

	public String getHardware() {
		return hardware;
	}

	public void setHardware(String hardware) {
		this.hardware = hardware;
	}

	public String getHardwareName() {
		return hardwareName;
	}

	public void setHardwareName(String hardwareName) {
		this.hardwareName = hardwareName;
	}

	public String getConnectionIp() {
		return connectionIp;
	}

	public void setConnectionIp(String connectionIp) {
		this.connectionIp = connectionIp;
	}

	public String getCommunicationport() {
		return communicationport;
	}

	public void setCommunicationport(String communicationport) {
		this.communicationport = communicationport;
	}

	public String getLabelType() {
		return labelType;
	}

	public void setLabelType(String labelType) {
		this.labelType = labelType;
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

	public PackingSystemHardwareDetailMaster(Long systemId, String systemName, String systemAddress, String hardware,
			String hardwareName, String connectionIp, String communicationport, String labelType, String createdBy,
			String dateTime, String status) {
		super();
		this.systemId = systemId;
		this.systemName = systemName;
		this.systemAddress = systemAddress;
		this.hardware = hardware;
		this.hardwareName = hardwareName;
		this.connectionIp = connectionIp;
		this.communicationport = communicationport;
		this.labelType = labelType;
		this.createdBy = createdBy;
		this.dateTime = dateTime;
		this.status = status;
	}

	public PackingSystemHardwareDetailMaster() {
		super();
		// TODO Auto-generated constructor stub
	}



}
