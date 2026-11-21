# JeevanSetu 2.0 — Known Limitations & Scope Boundaries

## 1. Clinical & Diagnostic Limitations
- **Educational Decision Support Only**: JeevanSetu is an educational and supportive symptom triage tool. It does NOT provide definitive clinical diagnoses or prescribe prescription pharmaceuticals.
- **Rule Review Status**: The deterministic triage decision matrices are based on established clinical guidance (ICMR, WHO, MoHFW emergency first-response guidelines), but must undergo institutional review by qualified medical officers prior to deployment as clinical diagnostic software.
- **Generative AI Safety Gate**: Generative AI suggestions are auxiliary. Deterministic red-flag triggers cannot be overridden or downranked by AI responses.

## 2. Emergency Services & Telecom Limitations
- **No Automated Government Dispatch**: JeevanSetu does NOT claim or simulate direct API dispatch of government 108/102 ambulances or automated emergency ward bed booking. All emergency actions open device telecom dialers (`tel:108`, `tel:102`, `tel:112`) or dispatch pre-formatted SMS alerts through native SMS clients.
- **Cellular Voice Dependency**: Emergency dialers rely on local telecom voice signals. If voice towers are completely unavailable, physical transport to the nearest PHC is advised.

## 3. Offline & Device Hardware Limitations
- **Browser Storage Quotas**: Offline persistence uses browser `localStorage` and Cache Storage. Devices with severe storage constraints or aggressive OS battery savers may evict cached assets if unmanaged.
- **Speech Recognition Hardware**: Speech-to-text requires device microphone access and browser Web Speech API capability. In browsers lacking Web Speech support (e.g. older Android WebViews), an accessible manual text typing fallback is provided.

## 4. Surveillance & Trend Signals
- **Surveillance Indicators, Not Outbreak Diagnoses**: Community health trend signals represent aggregated clinical presentations reported at local PHCs and ASHA logs. They are labeled as surveillance indicators rather than confirmed epidemiological outbreaks.
- **Small-Cell Suppression**: Counts under 5 cases are systematically masked (`< 5 cases (Suppressed)`) to prevent deanonymization of rural patients in small hamlets.
