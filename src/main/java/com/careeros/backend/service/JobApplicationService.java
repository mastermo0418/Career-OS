package com.careeros.backend.service;

import com.careeros.backend.exception.ResourceNotFoundException;
import com.careeros.backend.model.JobApplication;
import com.careeros.backend.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    public JobApplication getApplicationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Job application not found with id: " + id
                ));
    }

    public JobApplication createApplication(JobApplication application) {
        return repository.save(application);
    }

    public JobApplication updateApplication(Long id, JobApplication updatedApplication) {

        JobApplication existingApplication = getApplicationById(id);

        existingApplication.setCompany(updatedApplication.getCompany());
        existingApplication.setPosition(updatedApplication.getPosition());
        existingApplication.setLocation(updatedApplication.getLocation());
        existingApplication.setStatus(updatedApplication.getStatus());
        existingApplication.setDateApplied(updatedApplication.getDateApplied());
        existingApplication.setJobUrl(updatedApplication.getJobUrl());
        existingApplication.setNotes(updatedApplication.getNotes());

        return repository.save(existingApplication);
    }

    public void deleteApplication(Long id) {
        JobApplication application = getApplicationById(id);
        repository.delete(application);
    }
}