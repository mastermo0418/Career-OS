package com.careeros.backend.controller;

import com.careeros.backend.model.JobApplication;
import com.careeros.backend.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return service.getAllApplications();
    }

    @GetMapping("/{id}")
    public JobApplication getApplicationById(@PathVariable Long id) {
        return service.getApplicationById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication createApplication(
            @Valid @RequestBody JobApplication application) {

        return service.createApplication(application);
    }

    @PutMapping("/{id}")
    public JobApplication updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplication application) {

        return service.updateApplication(id, application);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
    }
}