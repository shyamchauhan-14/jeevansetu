# JeevanSetu 2.0 — Known Limitations & Scope Boundaries

## 1. Clinical & Diagnostic Limitations
- **Not a Diagnostic Device**: JeevanSetu is an educational and supportive symptom triage tool. It does not provide medical diagnoses or prescribe medications.
- **Rule Review Status**: Triage decision matrices are based on published public health protocols (WHO, ICMR, MoHFW), but require formal review by qualified clinical officers prior to real-world clinical deployment.

## 2. Emergency Services Limitations
- **No Automated Dispatch**: JeevanSetu does not directly dispatch government 108/102 ambulances or reserve hospital beds. All emergency actions open native device dialers (`tel:108`) or forward alerts through configured external adapters.
- **Telecom Dependency**: Phone calling requires active cellular coverage even if mobile data/internet is unavailable.

## 3. Offline & Hardware Limitations
- **Browser Storage Quotas**: Offline caching relies on IndexedDB and Cache Storage subject to browser-controlled storage eviction policies on low-memory mobile devices.
- **Speech Recognition**: Speech-to-text requires modern browser Web Speech API support. A text keyboard fallback is provided for browsers lacking speech recognition.
