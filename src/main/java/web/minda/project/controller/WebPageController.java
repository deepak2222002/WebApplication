package web.minda.project.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.MasterDetails;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.MasterDetailsRepository;

import web.minda.project.security.JwtHelper;

@Controller
public class WebPageController {

	@RequestMapping("/loginpage")
	public String forwardToReact() {
		return "forward:/projectLoginpage/index.html";
	}

	@RequestMapping(value = { "/moduleDashboard" })
	public String forwardToDashboard() {
		return "forward:/projectModuleDashboard/index.html";
	}

	@RequestMapping(value = { "/masterDashboard" })
	public String forwardToMasterDashboard() {
		return "forward:/projectModuleMasters/index.html";
	}

	@RequestMapping(value = { "/masterDashboard/**" })
	public String forwardToMasterDashboardAll() {
		return "forward:/projectModuleMasters/index.html";
	}

	@RequestMapping(value = { "/reportDashboard" })
	public String forwardToReportDashboard() {
		return "forward:/projectModuleReports/index.html";
	}

	@RequestMapping(value = { "/reportDashboard/**" })
	public String reportDashboardAll() {
		return "forward:/projectModuleReports/index.html";
	}

	@RequestMapping(value = { "/maintenanceDashboard" })
	public String forwardToMaintenanceDashboard() {
		return "forward:/projectModuleMaintenance/index.html";
	}

	@RequestMapping(value = { "/maintenanceDashboard/**" })
	public String forwardToMaintenanceDashboardAll() {
		return "forward:/projectModuleMaintenance/index.html";
	}
	
	
	@RequestMapping("/qualityIncoming")
    public String forwardToIncoming() {
        return "forward:/projectIncomingModule/index.html";
    }
    
    
    @RequestMapping("/quality")
    public String forwardToquality() {
        return "forward:/projectIncomingModule/index.html";
    }
    
    @RequestMapping("/quality/**")
    public String forwardToqualityAll() {
        return "forward:/projectIncomingModule/index.html";
    }
    
    
    @RequestMapping("/quarantineDashboard")
    public String quarantineWindow() {
        return "forward:/projectQuarantineModule/index.html";
    }
    
    @RequestMapping("/quarantineDashboard/*")
    public String quarantineAllWindow() {
        return "forward:/projectQuarantineModule/index.html";
    }
    
    @RequestMapping("/reprint")
    public String reprintWindow() {
        return "forward:/projectIncomingModule/index.html";
    }
    
    @RequestMapping("/reprint/**")
    public String reprintAllString() {
        return "forward:/projectIncomingModule/index.html";
    }
    
    @RequestMapping("/quarantineDashboard/reprint/*")
    public String quarantineAllWindowreprint() {
        return "forward:/projectQuarantineModule/index.html";
    }
    
    
    
    @RequestMapping("/store")
    public String forwardTostore() {
        return "forward:/projectMainStoreModule/index.html";
    }
    
    @RequestMapping("/store/**")
    public String forwardTostoreAll() {
        return "forward:/projectMainStoreModule/index.html";
    }
    
    
    @RequestMapping("/productionDashboard")
    public String forwardToProductionDashboard() {
        return "forward:/projectModuleProduction/index.html";
    }
    
    @RequestMapping("/productionDashboard/**")
    public String forwardToProductionDashboardAll() {
        return "forward:/projectModuleProduction/index.html";
    }
    

}
