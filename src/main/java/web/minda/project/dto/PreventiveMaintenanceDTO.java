package web.minda.project.dto;

public interface PreventiveMaintenanceDTO {
	
	String getMouldName();
    String getChildPartName();
    String getDescription();
    String getTotalLife();
    String getAlarmLife();
    String getPmDate();
    String getDaysRemaining();
	String getPriority();
	String getLast();
	String getNext();
	String getAlertDays();
	String getCurrentLife();
	String getLifeStatus();

}
