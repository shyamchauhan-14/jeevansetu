import { SymptomInput, AssessmentResult, EmergencyProtocol } from '../types/health';
import { evaluateDeterministicTriage, CLINICAL_RULES_METADATA } from '../data/symptoms';
import { EMERGENCY_PROTOCOLS } from '../data/emergencies';

export class AIService {
  /**
   * Deterministic clinical triage evaluator.
   * Model generation is constrained and cannot override deterministic red flags.
   */
  public static async analyzeSymptoms(input: SymptomInput, delayMs = 600): Promise<AssessmentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = evaluateDeterministicTriage(input);
        resolve(result);
      }, delayMs);
    });
  }

  /**
   * Returns audited clinical rules metadata
   */
  public static getClinicalRulesMetadata() {
    return CLINICAL_RULES_METADATA;
  }

  /**
   * Fast emergency protocol lookup
   */
  public static getEmergencyProtocol(slugOrId: string): EmergencyProtocol | undefined {
    return EMERGENCY_PROTOCOLS.find(
      (p) => p.slug.toLowerCase() === slugOrId.toLowerCase() || p.id.toLowerCase() === slugOrId.toLowerCase()
    );
  }

  /**
   * All protocols list
   */
  public static getAllEmergencyProtocols(): EmergencyProtocol[] {
    return EMERGENCY_PROTOCOLS;
  }
}
