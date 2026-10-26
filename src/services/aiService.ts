import { SymptomInput, AssessmentResult, EmergencyProtocol } from '../types/health';
import { generateMockAssessment } from '../data/symptoms';
import { EMERGENCY_PROTOCOLS } from '../data/emergencies';

export class AIService {
  /**
   * Evaluates symptoms asynchronously to simulate realistic AI inference pipeline
   */
  public static async analyzeSymptoms(input: SymptomInput, delayMs = 1800): Promise<AssessmentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = generateMockAssessment(input);
        resolve(result);
      }, delayMs);
    });
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
