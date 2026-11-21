# JeevanSetu 2.0 — Test Plan & Quality Assurance

## 1. Automated Testing Strategy (Vitest)

All core security, clinical triage, emergency workflows, and offline synchronization engines are verified by an automated test suite running with Vitest.

### Test Command
```bash
npm test
```

### Passing Test Suites (9 Suites, 49 Tests)
1. **Security & RLS Access Boundaries (`src/__tests__/security.test.ts` - 5 tests)**:
   - Derives session identity strictly from authenticated JWT, rejecting arbitrary client-injected query params.
   - Enforces valid RBAC role assignments (`patient`, `community_worker`, `administrator`, `clinician_reviewer`).
   - Prevents unauthorized role escalation by patients.
   - Restricts community worker data queries exclusively to consented patient IDs.
   - Sanitizes and audits security events without persisting raw tokens.

2. **Multilingual & Clinical i18n (`src/__tests__/i18n.test.ts` - 4 tests)**:
   - Returns verified translations for English, Hindi, and Gujarati.
   - Critical emergency keys (`emergency.title`, `emergency.call108`) have verified non-empty regional text.
   - Graceful fallback to English when keys are missing in requested locale.
   - Text fallback availability for browsers without native Web Speech API.

3. **Smart SOS Emergency State Machine (`src/__tests__/sos.test.ts` - 5 tests)**:
   - Progression through truthful lifecycle (`preparing` -> `alert_queued` -> `call_opened` -> `sent` / `resolved` / `cancelled`).
   - Trusted emergency contact management and consent status.
   - Graceful fallback to regional/manual locality picker when GPS permission is denied.
   - True cancellation handling without false external dispatch claims.
   - Resolution timestamp capture on emergency conclusion.

4. **Deterministic Clinical Symptom Triage (`src/__tests__/symptoms.test.ts` - 8 tests)**:
   - Versioned ruleset identifier verification (`2.0.0-clinical-core`).
   - Immediate red-flag interruption for chest pain, snakebite, and respiratory arrest.
   - Multi-symptom risk score accumulation for moderate-risk illness.
   - Safe supportive home care guidelines for low-risk self-limiting symptoms.
   - Missing-answer safety escalation preventing false negative reassurance.
   - Explicit mandatory medical disclaimers on every triage result.
   - Generative AI prompt constraints preventing LLM tampering with deterministic red flags.

5. **Healthcare Facility Verification & Locality Search (`src/__tests__/facilities.test.ts` - 5 tests)**:
   - Facility search by name, type, and medical services (e.g. anti-snake venom, 24/7 emergency).
   - Provenance attribution and verification source tags.
   - Recently viewed facility offline caching with visible timestamps.
   - Crowdsourced facility correction report submission for outdated numbers or hours.
   - Accurate distance-based sorting for GPS-located requests.

6. **Digital Health Record & Reminders (`src/__tests__/healthRecord.test.ts` - 4 tests)**:
   - Provenance metadata tracking (`patient_entered`, `worker_entered`, `clinician_verified`).
   - Medication reminder dose tracking across statuses (`taken`, `skipped`, `snoozed`, `pending`).
   - Portable health summary export generation for clinical visits.
   - Right to erasure (wipe all local data) for shared rural device privacy.

7. **Community Worker, Blood Donors & Trends (`src/__tests__/community.test.ts` - 6 tests)**:
   - Assigned patient roster access restricted to consented patients.
   - Patient consent revocation immediately severing worker record access.
   - Home visit notes and clinical vitals recording.
   - Voluntary blood donor directory with masked contact and zero address/phone exposure.
   - Donor availability toggle and listing withdrawal.
   - Anonymized public health trends with small-cell count suppression (`< 5 cases (Suppressed)`).

8. **Offline-First Synchronization Engine (`src/__tests__/offlineSync.test.ts` - 6 tests)**:
   - Enqueues local transactions with `pending_sync`, client versioning, and zero retry count.
   - Updates existing queued items idempotently on subsequent local edits.
   - Executes idempotent background synchronization, updating last sync timestamp.
   - Handles network uplink failure by incrementing retry counters and marking `sync_failed`.
   - Conflict detection: flags `conflict_detected` when server record is newer than client edit.
   - Complete local queue and sync timestamp purge on shared kiosk cache wipe.

9. **Role-Protected Admin Governance Console (`src/__tests__/admin.test.ts` - 6 tests)**:
   - Denies admin access to `patient` and `community_worker` roles.
   - Grants governance console access to `administrator` and `clinician_reviewer` roles.
   - Allows clinicians/administrators to toggle healthcare facility verification credentials.
   - Resolves crowdsourced facility correction reports.
   - Maintains emergency incident audit trail with strict privacy protection (redacted precise GPS).
   - Updates community syndromic cluster statuses (`unverified_signal`, `validated`, `closed`).

---

## 2. Manual Verification Checklist

1. **Smart SOS**:
   - Hold SOS button for 2 seconds -> verify timer indicator and pre-flight data dialog.
   - Deny GPS -> verify prompt defaults safely to manual locality selector.
   - Open dialer -> verify `tel:108` launches native phone app; verify screen shows "Call option opened".
2. **Symptom Triage**:
   - Select "Snakebite" -> verify instant red-flag protocol interruption.
   - Select "Fever" without severe signs -> verify recommended PHC visit timeframe.
3. **Offline Continuity**:
   - Disconnect Wi-Fi/cellular in DevTools -> verify offline banner appears with quick link to `#/offline`.
   - Verify all 13 first-aid protocols remain accessible.
   - Create a medication reminder -> check `#/offline` sync queue shows `PENDING SYNC`.
   - Click "Sync Now" -> verify status updates to `SYNCED`.
4. **ASHA Workspace & Consent**:
   - Visit `#/worker` -> verify patient list.
   - Click "Revoke Consent" -> verify patient status becomes `REVOKED`.
5. **Admin Console**:
   - Navigate to `#/admin` as patient -> verify barrier screen displays RBAC restriction.
   - Click "Switch to Administrator" -> verify facility verification toggle and incident audit trail.
