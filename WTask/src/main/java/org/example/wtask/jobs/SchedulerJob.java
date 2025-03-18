package org.example.wtask.jobs;

import org.example.wtask.jobs.jobService.ScheduleServiceJob;
import org.example.wtask.models.Schedule;
import org.example.wtask.repository.ScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
public class SchedulerJob {
    private static final Logger logger = LoggerFactory.getLogger(SchedulerJob.class);

    @Autowired
    private ScheduleServiceJob scheduleServiceJob;

    @Scheduled(cron = "*/20 * * * * ?")
    public void executeJob() {
        logger.info("Daily Scheduled Job started");
//        scheduleServiceJob.executeJob();
        logger.info("Daily Scheduled Job completed");

    }


}
