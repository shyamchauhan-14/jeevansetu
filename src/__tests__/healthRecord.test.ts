import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';

describe('Phase 7 — Digital Health Records & Medicine Reminders Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Health records track provenance (patient_entered, clinician_verified, worker_entered)', () => {
    const initial = StorageService.getHealthRecords();
    expect(initial.length).toBeGreaterThan(0);
    expect(initial.some((r) => r.provenance === 'clinician_verified')).toBe(true);

    const newRecord = StorageService.addHealthRecord({
      recordType: 'allergy',
      title: 'Sulfa Drugs',
      content: { severity: 'moderate' },
      provenance: 'patient_entered'
    });

    expect(newRecord.id).toBeDefined();
    expect(newRecord.provenance).toBe('patient_entered');

    const updated = StorageService.getHealthRecords();
    expect(updated.some((r) => r.id === newRecord.id)).toBe(true);
  });

  it('Supports taken, skipped, and snoozed reminder statuses without making clinical dosage decisions', () => {
    const reminders = StorageService.getReminders();
    expect(reminders.length).toBeGreaterThan(0);
    const firstMed = reminders[0];

    // Status: taken
    const taken = StorageService.updateReminderStatus(firstMed.id, 'taken');
    expect(taken?.status).toBe('taken');
    expect(taken?.lastTakenDate).toBeDefined();

    // Status: skipped
    const skipped = StorageService.updateReminderStatus(firstMed.id, 'skipped');
    expect(skipped?.status).toBe('skipped');

    // Status: snoozed
    const snoozed = StorageService.updateReminderStatus(firstMed.id, 'snoozed');
    expect(snoozed?.status).toBe('snoozed');
  });

  it('Exports portable health summary with disclaimer, profile, and schedule', () => {
    const summary = StorageService.exportHealthSummary();
    expect(summary.exportedAt).toBeDefined();
    expect(summary.disclaimer).toContain('Notice:');
    expect(summary.disclaimer).toContain('does not replace an official clinical health chart');
    expect(summary.patientProfile).toBeDefined();
    expect(Array.isArray(summary.medicineSchedule)).toBe(true);
    expect(Array.isArray(summary.verifiedHealthRecords)).toBe(true);
  });

  it('Data deletion workflow cleanly wipes user personal health records', () => {
    StorageService.addHealthRecord({
      recordType: 'condition',
      title: 'Temporary Condition',
      content: {},
      provenance: 'patient_entered'
    });

    StorageService.deleteAllUserData();
    const remainingReminders = localStorage.getItem('jeevansetu_medicine_reminders');
    const remainingRecords = localStorage.getItem('jeevansetu_health_records');
    expect(remainingReminders).toBeNull();
    expect(remainingRecords).toBeNull();
  });
});
