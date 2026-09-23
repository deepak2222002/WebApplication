package web.minda.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import web.minda.project.service.DateTimeService;


// @Service classes are meant only for business logic (e.g., formatting, calculations, database interactions, etc.).
// @Controller / @RestController classes are meant for exposing APIs (HTTP endpoints).
// ❌  cannot put @GetMapping("/server-date") api inside the @Service.
// Spring will ignore it, because only controller ( rest api controller) beans handle web requests.
@RestController
@RequestMapping("/Controllers")
public class CurrentDateTimeController {

    @Autowired
    private DateTimeService dateTimeService; // using this service

    @GetMapping("/server-date")
    public ResponseEntity<String> getServerDate() {
        return ResponseEntity.ok(dateTimeService.getCurrentDate());
    }

    @GetMapping("/server-datetime")
    public ResponseEntity<String> getServerDateTime() {
        return ResponseEntity.ok(dateTimeService.getCurrentDateAndTime());
    }
}
