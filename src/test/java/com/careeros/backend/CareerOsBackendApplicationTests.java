package com.careeros.backend;

import com.careeros.backend.model.JobApplication;
import com.careeros.backend.repository.JobApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CareerOsBackendApplicationTests {

    @Autowired
    private JobApplicationRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldCreateAndRetrieveJobApplication() {

        JobApplication application = new JobApplication(
                "Microsoft",
                "Software Engineer Intern",
                "Charlotte, NC",
                "APPLIED",
                LocalDate.of(2026, 8, 12),
                "https://careers.microsoft.com",
                "Automated test"
        );

        JobApplication savedApplication = repository.save(application);

        assertNotNull(savedApplication.getId());

        JobApplication retrievedApplication =
                repository.findById(savedApplication.getId()).orElseThrow();

        assertEquals("Microsoft", retrievedApplication.getCompany());
        assertEquals("Software Engineer Intern", retrievedApplication.getPosition());
        assertEquals("APPLIED", retrievedApplication.getStatus());
    }
}