import { describe, it, expect } from 'vitest';
import { evaluateDeterministicTriage, CLINICAL_RULES_METADATA } from '../data/symptoms';

describe('Phase 5 — Deterministic Symptom Triage & Safety Rule Tests', () => {
  it('Exposes verified clinical rule metadata with version, reviewer, and guidelines', () => {
    expect(CLINICAL_RULES_METADATA.version).toBe('2.0.0-clinical-core');
    expect(CLINICAL_RULES_METADATA.reviewer).toContain('Advisory Board');
    expect(CLINICAL_RULES_METADATA.guidelineReference).toBeDefined();
  });

  it('Red Flag Rule 1: Snakebite must IMMEDIATELY trigger CRITICAL emergency urgency', () => {
    const result = evaluateDeterministicTriage({
      symptoms: ['snake-bite'],
      duration: 'hours',
      severity: 'mild' // Even if user clicks mild, red flag overrides!
    });

    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.headline).toContain('Emergency Help Now');
    expect(result.immediateSteps[0]).toContain('108');
  });

  it('Red Flag Rule 2: Chest pain or cardiac danger sign triggers CRITICAL emergency urgency', () => {
    const result = evaluateDeterministicTriage({
      symptoms: ['chest-pain'],
      duration: 'today',
      severity: 'moderate'
    });

    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.suggestedCareType).toBe('emergency_hospital');
  });

  it('Red Flag Rule 3: Associated danger signs (blue lips, slurred speech) force emergency urgency', () => {
    const result = evaluateDeterministicTriage({
      symptoms: ['fever'],
      duration: 'today',
      severity: 'mild',
      associatedSigns: ['blue-lips']
    });

    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.headline).toContain('Emergency Help Now');
  });

  it('Missing answers rule: Incomplete answers do not silently default to negative/safe', () => {
    const result = evaluateDeterministicTriage({
      symptoms: ['fever'],
      duration: '', // missing
      severity: '' as any // missing
    });

    // Incomplete answers are not treated as mild safe; elevated to prompt medical advice
    expect(result.riskLevel).toBe('MODERATE');
    expect(result.headline).toContain('Seek Medical Advice Promptly');
  });

  it('Moderate symptoms rule: Multiple symptoms or multi-day persistence advised prompt clinic visit', () => {
    const result = evaluateDeterministicTriage({
      symptoms: ['fever', 'cough'],
      duration: 'few-days',
      severity: 'moderate'
    });

    expect(result.riskLevel).toBe('MODERATE');
    expect(result.suggestedCareType).toBe('clinic_visit');
  });

  it('Low risk rule: Isolated mild discomfort produces supportive self-care guidance', () => {
    const result = evaluateDeterministicTriage({
      symptoms: ['headache'],
      duration: 'today',
      severity: 'mild'
    });

    expect(result.riskLevel).toBe('LOW');
    expect(result.headline).toContain('Self-Care Information May Be Appropriate');
    expect(result.suggestedCareType).toBe('home_support');
  });

  it('Medical disclaimer is mandatory on every evaluation output', () => {
    const lowResult = evaluateDeterministicTriage({ symptoms: ['headache'], duration: 'today', severity: 'mild' });
    const critResult = evaluateDeterministicTriage({ symptoms: ['snake-bite'], duration: 'hours', severity: 'severe' });

    expect(lowResult.disclaimer).toContain('Clinical Safety Disclaimer');
    expect(critResult.disclaimer).toContain('108');
  });
});
