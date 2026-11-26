import { ManagedProtocol, ProtocolVersion, ProtocolReview } from '../types/health';
import { AuthService } from './authService';
import { AdminNotificationService } from './adminNotificationService';

const STORAGE_KEYS = {
  PROTOCOLS: 'jeevansetu_managed_protocols',
  VERSIONS: 'jeevansetu_protocol_versions',
  REVIEWS: 'jeevansetu_protocol_reviews'
};

const DEFAULT_PROTOCOLS: ManagedProtocol[] = [
  {
    id: 'proto-cardiac-1',
    title: 'Acute Myocardial Infarction (Heart Attack) First Response',
    slug: 'heart-attack',
    category: 'Heart Attack',
    shortDescription: 'Emergency protocol for suspected heart attack in rural, low-resource settings with immediate 112/108 notification.',
    symptoms: [
      'Crushing central chest heaviness or tightness lasting > 5 minutes',
      'Pain radiating to left shoulder, arm, neck, or jaw',
      'Cold profuse sweating with unexplained breathlessness and nausea'
    ],
    warningSigns: [
      'Sudden collapse or loss of consciousness',
      'Cyanosis (bluish lips or fingernails)',
      'Extreme hypotension (faint pulse, dizziness)'
    ],
    immediateSafetyMeasures: 'Stop all physical activity immediately. Sit patient down with back supported and knees bent (half-sitting W-position). Loosen all tight clothing.',
    responseSteps: [
      {
        number: '1',
        title: 'Activate Emergency Dispatch 112 / 108',
        detail: 'Immediately dial 112 or 108 for paramedic ambulance. Inform them of suspected cardiac distress and your village sector location.'
      },
      {
        number: '2',
        title: 'Comfortable Half-Sitting Position',
        detail: 'Sit the patient on floor with back propped up against a wall or pillow. Keep knees bent to reduce cardiac workload and facilitate lung expansion.'
      },
      {
        number: '3',
        title: 'Aspirin Administration (If Conscious & Non-Allergic)',
        detail: 'If the patient is alert and has NO allergy to aspirin or active stomach bleeding, give 300mg Soluble Aspirin to chew slowly for rapid anti-platelet absorption.'
      },
      {
        number: '4',
        title: 'Continuous Vitals & AED / CPR Readiness',
        detail: 'Monitor breathing every 2 minutes. If the patient becomes unresponsive and stops normal breathing, lay flat and begin chest compressions (100–120/min).'
      }
    ],
    whatNotToDo: [
      'DO NOT allow the patient to walk, exert themselves, or drive.',
      'DO NOT give heavy meals, water in large gulps, or hot tea/coffee.',
      'DO NOT leave the patient unattended.',
      'DO NOT administer random painkillers or unprescribed nitrates without blood pressure check.'
    ],
    whenToCallEmergency: 'Call 112 / 108 IMMEDIATELY upon first onset of severe chest pain. Do not wait for symptoms to resolve on their own.',
    requiredEquipment: ['Soluble Aspirin 300mg', 'Blood Pressure Monitor', 'Pulse Oximeter', 'AED (if available at CHC)'],
    specialPrecautions: 'Ensure patient airway remains clear if vomiting occurs. Turn to lateral recovery position if drowsy.',
    targetAudience: 'General Public, ASHA Workers & Primary Health Responders',
    medicalReferences: [
      'Indian Council of Medical Research (ICMR) Acute Coronary Syndrome Guidelines 2024',
      'World Health Organization (WHO) Rural Emergency Triage Protocols'
    ],
    authorId: 'user-doc-1',
    authorName: 'Dr. Rajesh Kulkarni (MD, Emergency Medicine)',
    authorRegistrationNo: 'MMC-2008-041289',
    reviewerId: 'admin-1',
    reviewerName: 'Medical Authority Board / Super Admin',
    status: 'PUBLISHED',
    version: 2,
    isPublic: true,
    lastReviewedAt: '2026-10-15T11:00:00.000Z',
    reviewDueAt: '2027-10-15T11:00:00.000Z',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-10-15T11:00:00.000Z'
  },
  {
    id: 'proto-snakebite-1',
    title: 'Venomous Snakebite Field Management & Antivenom Triage',
    slug: 'snakebite',
    category: 'Poisoning',
    shortDescription: 'Evidence-based first aid protocol for snake envenomation preventing harmful folk remedies and expediting antivenom administration.',
    symptoms: [
      'Visible paired fang puncture marks with bleeding or burning pain',
      'Rapid progressive swelling, blistering, or blackening around bite site',
      'Ptosis (drooping eyelids), slurred speech, or difficulty swallowing (neurotoxic)'
    ],
    warningSigns: [
      'Spontaneous bleeding from gums or old cuts (vasculotoxic)',
      'Paralysis of neck muscles or respiratory arrest',
      'Severe dark or red urine'
    ],
    immediateSafetyMeasures: 'Reassure the victim to keep heart rate low. Immobilize the bitten limb with a broad splint just like a fractured bone. Keep limb at or slightly below heart level.',
    responseSteps: [
      {
        number: '1',
        title: 'Immobilize Bitten Limb (Right Away)',
        detail: 'Apply a broad splint and crepe bandage to completely immobilize the arm or leg. Do not tie a tight arterial tourniquet.'
      },
      {
        number: '2',
        title: 'Remove Constricting Jewelry or Rings',
        detail: 'Quickly remove rings, bangles, anklets, or tight shoes before swelling progresses to prevent gangrene from tissue constriction.'
      },
      {
        number: '3',
        title: 'Rapid Transport to Nearest Anti-Snake Venom (ASV) Centre',
        detail: 'Transport victim immediately in a lying position. Call 108 / 112 or local PHC to ensure polyvalent anti-snake venom vials are ready.'
      }
    ],
    whatNotToDo: [
      'DO NOT cut, incise, or slash the bite wound with razors.',
      'DO NOT attempt to suck venom by mouth or mechanical suction devices.',
      'DO NOT tie tight rope, wire, or rubber tourniquets.',
      'DO NOT apply herbal pastes, lime, cow dung, or electrical shocks.'
    ],
    whenToCallEmergency: 'Call 112 / 108 immediately. Every venomous snakebite is a medical emergency requiring hospital observation.',
    requiredEquipment: ['Crepe Bandages (10cm/15cm)', 'Rigid Wooden Splint', 'Polyvalent Snake Antivenom (at hospital)'],
    specialPrecautions: 'Do not kill or chase the snake; safety of responders is paramount. Take a photo of the snake from safe distance if possible.',
    targetAudience: 'Farmers, Rural Residents, ASHA Workers',
    medicalReferences: [
      'National Health Mission (NHM) Standard Treatment Guidelines on Snakebite 2023',
      'WHO Guidelines for the Management of Snakebites in Southeast Asia'
    ],
    authorId: 'user-doc-1',
    authorName: 'Dr. Rajesh Kulkarni (MD, Emergency Medicine)',
    authorRegistrationNo: 'MMC-2008-041289',
    reviewerId: 'admin-1',
    reviewerName: 'Super Admin',
    status: 'PUBLISHED',
    version: 1,
    isPublic: true,
    lastReviewedAt: '2026-10-18T14:30:00.000Z',
    reviewDueAt: '2027-10-18T14:30:00.000Z',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-18T14:30:00.000Z'
  },
  {
    id: 'proto-bleeding-1',
    title: 'Severe Traumatic Bleeding & Hemorrhage Control',
    slug: 'severe-bleeding',
    category: 'Severe Bleeding',
    shortDescription: 'Field protocol for controlling arterial and catastrophic hemorrhage using direct pressure and pressure dressings.',
    symptoms: [
      'Pulsatile, spurting bright red blood from deep wound',
      'Rapid pooling of blood through clothing or dressings',
      'Signs of hypovolemic shock (pale cold clammy skin, rapid weak pulse)'
    ],
    warningSigns: [
      'Confusion or altered mental status',
      'Unconsciousness from extreme blood loss',
      'Weak or impalpable radial pulse'
    ],
    immediateSafetyMeasures: 'Ensure personal safety with barrier precautions if available. Expose wound and apply continuous direct manual pressure with clean cloth or sterile gauze.',
    responseSteps: [
      {
        number: '1',
        title: 'Firm Continuous Direct Pressure',
        detail: 'Place sterile gauze or cleanest cloth available over bleeding point. Press down firmly with both hands for at least 5 unbroken minutes.'
      },
      {
        number: '2',
        title: 'Apply Tight Pressure Dressing',
        detail: 'Wrap a roller or elastic bandage firmly over dressing to maintain pressure. If blood soaks through, add more layers without removing original dressing.'
      },
      {
        number: '3',
        title: 'Elevate & Treat for Shock',
        detail: 'Elevate bleeding extremity above heart level if no fracture is suspected. Lay victim flat and keep warm with blanket.'
      }
    ],
    whatNotToDo: [
      'DO NOT remove soaked bandages; always layer additional dressings on top.',
      'DO NOT apply makeshift wire tourniquets that sever nerves or tissue.',
      'DO NOT wash deep wounds with copious water; focus on direct pressure.'
    ],
    whenToCallEmergency: 'Call 112 / 108 immediately if bleeding does not stop after 5 minutes of firm direct pressure.',
    requiredEquipment: ['Sterile Gauze Pads (4x4)', 'Roller Bandages', 'Tactical Hemostatic Gauze', 'Clean Blanket'],
    specialPrecautions: 'If an impaled object is present, DO NOT remove it; stabilize it in place with bulky dressings.',
    targetAudience: 'First Responders, Rural Drivers, General Public',
    medicalReferences: [
      'International First Aid and Resuscitation Guidelines',
      'Directorate General of Health Services (DGHS) Trauma Care Guidelines'
    ],
    authorId: 'user-doc-2',
    authorName: 'Dr. Suresh Deshmukh (MS, General Surgery)',
    authorRegistrationNo: 'MMC-2014-098231',
    reviewerId: 'admin-1',
    reviewerName: 'Super Admin',
    status: 'PUBLISHED',
    version: 1,
    isPublic: true,
    lastReviewedAt: '2026-10-20T16:00:00.000Z',
    reviewDueAt: '2027-10-20T16:00:00.000Z',
    createdAt: '2026-10-05T12:00:00.000Z',
    updatedAt: '2026-10-20T16:00:00.000Z'
  },
  {
    id: 'proto-choking-1',
    title: 'Acute Choking & Airway Foreign Body Obstruction (Adult/Child)',
    slug: 'choking',
    category: 'Choking',
    shortDescription: 'Heimlich maneuver and back blows for complete upper airway obstruction in conscious and unconscious casualties.',
    symptoms: [
      'Universal choking sign: Casualty clutching neck with both hands',
      'Inability to speak, cry, or cough forcefully',
      'Stridor or silent high-pitched wheezing during inhalation'
    ],
    warningSigns: [
      'Inability to breathe or cough',
      'Facial congestion turning to cyanosis (blue face/lips)',
      'Loss of consciousness within 1 to 2 minutes'
    ],
    immediateSafetyMeasures: 'Encourage coughing if casualty can speak. If silent and unable to breathe, stand behind them and administer 5 sharp back blows between shoulder blades.',
    responseSteps: [
      {
        number: '1',
        title: '5 Sharp Back Blows',
        detail: 'Support casualty chest with one hand and lean them forward. Give 5 firm blows with heel of other hand between shoulder blades.'
      },
      {
        number: '2',
        title: '5 Abdominal Thrusts (Heimlich Maneuver)',
        detail: 'Stand behind, place fist thumb-side against upper abdomen above navel. Grasp fist with other hand and thrust sharply inward and upward 5 times.'
      },
      {
        number: '3',
        title: 'Alternate until Dislodged or Casualty Collapses',
        detail: 'Repeat cycles of 5 back blows and 5 abdominal thrusts. If casualty becomes unresponsive, lower to ground and begin CPR compressions.'
      }
    ],
    whatNotToDo: [
      'DO NOT perform blind finger sweeps in mouth; only remove visible objects.',
      'DO NOT perform abdominal thrusts on infants under 1 year (use back blows and chest thrusts only).',
      'DO NOT slap back when casualty is coughing effectively.'
    ],
    whenToCallEmergency: 'Call 112 / 108 immediately if obstruction does not dislodge after first cycle or casualty collapses.',
    requiredEquipment: ['No specialized equipment needed in field', 'Suction apparatus (at clinic)'],
    specialPrecautions: 'For pregnant women or severely obese casualties, use chest thrusts instead of abdominal thrusts.',
    targetAudience: 'Parents, Teachers, Restaurant Workers, General Public',
    medicalReferences: [
      'American Heart Association / ERC Guidelines for Resuscitation 2023',
      'Indian Academy of Pediatrics (IAP) Choking Management Algorithm'
    ],
    authorId: 'user-doc-3',
    authorName: 'Dr. Anita Joshi (DNB Cardiology)',
    authorRegistrationNo: 'MCI-2016-114092',
    status: 'PENDING_APPROVAL',
    version: 1,
    isPublic: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export class EmergencyProtocolService {
  public static getAll(): ManagedProtocol[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
      return data ? JSON.parse(data) : DEFAULT_PROTOCOLS;
    } catch {
      return DEFAULT_PROTOCOLS;
    }
  }

  public static getPublishedProtocols(): ManagedProtocol[] {
    return this.getAll().filter((p) => p.isPublic && p.status === 'PUBLISHED');
  }

  public static getById(id: string): ManagedProtocol | undefined {
    return this.getAll().find((p) => p.id === id);
  }

  public static getBySlug(slug: string): ManagedProtocol | undefined {
    return this.getAll().find((p) => p.slug === slug);
  }

  public static getByAuthor(authorId: string): ManagedProtocol[] {
    return this.getAll().filter((p) => p.authorId === authorId);
  }

  public static getPendingApprovals(): ManagedProtocol[] {
    return this.getAll().filter((p) => p.status === 'PENDING_APPROVAL' || p.status === 'UNDER_REVIEW');
  }

  public static createProtocol(protocolData: Omit<ManagedProtocol, 'id' | 'version' | 'createdAt' | 'updatedAt'>): ManagedProtocol {
    // Server-side RBAC enforcement: Only verified doctors or super admins can author emergency protocols
    const isDoctor = AuthService.isVerifiedDoctor();
    const isSuperAdmin = AuthService.isSuperAdmin();
    if (!isDoctor && !isSuperAdmin) {
      throw new Error('Unauthorized: Only verified doctors and administrators can create protocols.');
    }

    // Medical Safety Rule: Direct publication requires Super Admin review
    const finalStatus = (isSuperAdmin && protocolData.status === 'PUBLISHED') ? 'PUBLISHED' : (protocolData.status === 'PENDING_APPROVAL' ? 'PENDING_APPROVAL' : 'DRAFT');
    const finalIsPublic = isSuperAdmin ? Boolean(protocolData.isPublic) : false;

    const list = this.getAll();
    const newProtocol: ManagedProtocol = {
      ...protocolData,
      id: 'proto-' + Date.now().toString(36),
      version: 1,
      isPublic: finalIsPublic,
      status: finalStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newProtocol, ...list];
    this.saveList(updated);

    // Save initial version snapshot
    this.saveVersionSnapshot(newProtocol, 'Initial draft created');

    if (newProtocol.status === 'PENDING_APPROVAL') {
      AdminNotificationService.addNotification({
        recipientUserId: 'admin-broadcast',
        recipientRole: 'super_admin',
        title: 'New Emergency Protocol Submitted for Review',
        message: `"${newProtocol.title}" was submitted by ${newProtocol.authorName}. Awaiting clinical approval.`,
        category: 'PROTOCOL',
        referenceId: newProtocol.id,
        referenceType: 'emergency_protocol'
      });
    }

    return newProtocol;
  }

  public static updateProtocol(
    id: string,
    updates: Partial<ManagedProtocol>,
    changeSummary = 'Protocol updated'
  ): ManagedProtocol | null {
    const list = this.getAll();
    const target = list.find((p) => p.id === id);
    if (!target) return null;

    const previousVersion = target.version;
    const isNewVersion = updates.status === 'PUBLISHED' || (updates.version && updates.version > target.version);

    Object.assign(target, updates);
    target.updatedAt = new Date().toISOString();
    if (isNewVersion) {
      target.version = previousVersion + 1;
    }

    this.saveList(list);

    if (isNewVersion || changeSummary !== 'Protocol updated') {
      this.saveVersionSnapshot(target, changeSummary);
    }

    return target;
  }

  public static submitForApproval(id: string): ManagedProtocol | null {
    return this.updateProtocol(id, { status: 'PENDING_APPROVAL' }, 'Submitted for administrative approval');
  }

  public static publishProtocol(id: string): ManagedProtocol | null {
    return this.approveProtocol(id);
  }

  public static approveProtocol(
    id: string,
    reviewerId?: string,
    reviewerName?: string,
    comments = 'Approved by Medical Board'
  ): ManagedProtocol | null {
    const list = this.getAll();
    const protocol = list.find((p) => p.id === id);
    if (!protocol) return null;

    const rId = reviewerId || AuthService.getCurrentUser().id;
    const rName = reviewerName || AuthService.getCurrentUser().displayName || 'Super Admin';

    protocol.status = 'PUBLISHED';
    protocol.isPublic = true;
    protocol.reviewerId = rId;
    protocol.reviewerName = rName;
    protocol.lastReviewedAt = new Date().toISOString();
    protocol.reviewDueAt = new Date(Date.now() + 365 * 86400000).toISOString(); // 1 year review cycle
    protocol.updatedAt = new Date().toISOString();
    protocol.version += 1;

    this.saveList(list);
    this.saveVersionSnapshot(protocol, `Approved & Published by ${rName}`);
    this.saveReviewRecord(protocol.id, rId, rName, 'APPROVED', comments);

    if (protocol.authorId) {
      AdminNotificationService.addNotification({
        recipientUserId: protocol.authorId,
        recipientRole: 'verified_doctor',
        title: 'Protocol Approved & Published ✓',
        message: `Your medical protocol "${protocol.title}" has been approved and published to the live JeevanSetu directory.`,
        category: 'PROTOCOL',
        referenceId: protocol.id,
        referenceType: 'emergency_protocol'
      });
    }

    return protocol;
  }

  public static rejectProtocol(
    id: string,
    rejectionReason: string,
    reviewerId?: string,
    reviewerName?: string
  ): ManagedProtocol | null {
    const list = this.getAll();
    const protocol = list.find((p) => p.id === id);
    if (!protocol) return null;

    const rId = reviewerId || AuthService.getCurrentUser().id;
    const rName = reviewerName || AuthService.getCurrentUser().displayName || 'Super Admin';

    protocol.status = 'REJECTED';
    protocol.isPublic = false;
    protocol.rejectionReason = rejectionReason;
    protocol.reviewerId = rId;
    protocol.reviewerName = rName;
    protocol.updatedAt = new Date().toISOString();

    this.saveList(list);
    this.saveReviewRecord(protocol.id, rId, rName, 'REJECTED', rejectionReason);

    if (protocol.authorId) {
      AdminNotificationService.addNotification({
        recipientUserId: protocol.authorId,
        recipientRole: 'verified_doctor',
        title: 'Protocol Rejected by Medical Reviewer',
        message: `Your protocol "${protocol.title}" was rejected. Reason: ${rejectionReason}`,
        category: 'PROTOCOL',
        referenceId: protocol.id,
        referenceType: 'emergency_protocol'
      });
    }

    return protocol;
  }

  public static requestChanges(
    id: string,
    changeRequestNotes: string,
    reviewerId?: string,
    reviewerName?: string
  ): ManagedProtocol | null {
    const list = this.getAll();
    const protocol = list.find((p) => p.id === id);
    if (!protocol) return null;

    const rId = reviewerId || AuthService.getCurrentUser().id;
    const rName = reviewerName || AuthService.getCurrentUser().displayName || 'Super Admin';

    protocol.status = 'CHANGES_REQUESTED';
    protocol.isPublic = false;
    protocol.changeRequestNotes = changeRequestNotes;
    protocol.reviewerId = rId;
    protocol.reviewerName = rName;
    protocol.updatedAt = new Date().toISOString();

    this.saveList(list);
    this.saveReviewRecord(protocol.id, rId, rName, 'CHANGES_REQUESTED', changeRequestNotes);

    if (protocol.authorId) {
      AdminNotificationService.addNotification({
        recipientUserId: protocol.authorId,
        recipientRole: 'verified_doctor',
        title: 'Changes Requested on Protocol',
        message: `Medical reviewer requested revisions for "${protocol.title}": ${changeRequestNotes}`,
        category: 'PROTOCOL',
        referenceId: protocol.id,
        referenceType: 'emergency_protocol'
      });
    }

    return protocol;
  }

  public static archiveProtocol(id: string): boolean {
    const list = this.getAll();
    const protocol = list.find((p) => p.id === id);
    if (!protocol) return false;

    protocol.status = 'ARCHIVED';
    protocol.isPublic = false;
    protocol.updatedAt = new Date().toISOString();
    this.saveList(list);
    return true;
  }

  public static deleteProtocol(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    this.saveList(filtered);
    return true;
  }

  public static getVersions(protocolId: string): ProtocolVersion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      const all: ProtocolVersion[] = data ? JSON.parse(data) : [];
      return all.filter((v) => v.protocolId === protocolId).sort((a, b) => b.version - a.version);
    } catch {
      return [];
    }
  }

  public static getReviews(protocolId: string): ProtocolReview[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const all: ProtocolReview[] = data ? JSON.parse(data) : [];
      return all.filter((r) => r.protocolId === protocolId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  public static filterProtocols(
    category?: string,
    status?: string,
    searchQuery?: string
  ): ManagedProtocol[] {
    let list = this.getAll();

    if (category && category !== 'ALL') {
      list = list.filter((p) => p.category === category);
    }

    if (status && status !== 'ALL') {
      list = list.filter((p) => p.status === status);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  private static saveList(list: ManagedProtocol[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  private static saveVersionSnapshot(protocol: ManagedProtocol, changeSummary: string): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      const versions: ProtocolVersion[] = data ? JSON.parse(data) : [];
      const entry: ProtocolVersion = {
        id: 'ver-' + Date.now().toString(36),
        protocolId: protocol.id,
        version: protocol.version,
        title: protocol.title,
        category: protocol.category,
        contentSnapshot: JSON.parse(JSON.stringify(protocol)),
        changedBy: protocol.authorId || AuthService.getCurrentUser().id,
        changeSummary,
        createdAt: new Date().toISOString()
      };
      versions.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions));
    } catch {
      // ignore
    }
  }

  private static saveReviewRecord(
    protocolId: string,
    reviewerId: string,
    reviewerName: string,
    action: ProtocolReview['action'],
    comments: string
  ): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const reviews: ProtocolReview[] = data ? JSON.parse(data) : [];
      const entry: ProtocolReview = {
        id: 'rev-' + Date.now().toString(36),
        protocolId,
        reviewerId,
        reviewerName,
        action,
        comments,
        createdAt: new Date().toISOString()
      };
      reviews.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }
}
