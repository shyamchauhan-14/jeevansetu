# JeevanSetu 2.0 — Test Plan & Quality Assurance

## 1. Automated Testing Strategy
We test all critical workflows using Vitest:
- **Unit Tests**:
  - Triage rule evaluation: red-flag interruption, moderate cases, self-care cases, missing answer handling.
  - Storage service & sync queue: offline queuing, state transitions (`Local only`, `Pending sync`, `Synced`, `Sync failed`), conflict resolution.
  - SOS state machine: state progression, fallback transitions, false-alarm cancellations.
  - Provenance & input validation.
- **Negative Security Tests**:
  - RLS logic: verifying User A cannot read, edit, or delete User B's reminders, health records, or emergency contacts.
  - Role escalation prevention: verifying ordinary patients cannot grant admin roles or access worker workspaces.
  - Input sanitization: script injection prevention in form inputs.

## 2. Manual Testing Scenarios (Evaluation Checklist)
1. **SOS Emergency**:
   - Tap and hold SOS button; test location denial fallback.
   - Verify phone call dialer opens via `tel:108`.
   - Verify state displays "Call option opened" rather than "Ambulance dispatched".
2. **Symptom Triage**:
   - Select "Snakebite" or "Chest Pain" -> verify immediate red-flag emergency pathway.
   - Select "Mild Fever" -> verify moderate/low pathway with supportive care guidelines.
3. **Offline Resilience**:
   - Turn off Wi-Fi/data in browser dev tools.
   - Verify 13 emergency protocols remain instantly readable.
   - Add a medicine reminder while offline -> verify marked as "Pending sync".
   - Turn network back on -> verify sync queue updates to "Synced".
4. **Multilingual Support**:
   - Switch language between English, Hindi, and Gujarati.
   - Verify emergency actions and critical warnings render in selected language.
