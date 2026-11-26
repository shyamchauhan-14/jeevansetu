import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';
import { DoctorVerificationService } from '../services/doctorVerificationService';
import { EmergencyProtocolService } from '../services/emergencyProtocolService';
import { BloodDonorService } from '../services/bloodDonorService';
import { AdminAnalyticsService } from '../services/adminAnalyticsService';
import { renderAdminDashboardPage } from '../pages/AdminDashboard';

describe('JeevanSetu Admin Panel & Medical Authority System (15 Module 12 Scenarios)', () => {
  beforeEach(() => {
    localStorage.clear();
    AuthService.setRoleForTesting('citizen'); // Reset to normal user
  });

  // Scenario 1: Normal user attempts to access admin route → Access blocked
  it('Scenario 1: blocks normal user from accessing admin dashboard with restricted barrier', () => {
    AuthService.setRoleForTesting('citizen');
    expect(AuthService.canAccessAdmin()).toBe(false);
    expect(AuthService.isSuperAdmin()).toBe(false);

    const html = renderAdminDashboardPage('dashboard');
    expect(html).toContain('RESTRICTED ACCESS');
    expect(html).toContain('Super Administrator Role Required');
    expect(html).not.toContain('JEEVANSETU ADMIN'); // Sidebar not rendered
  });

  // Scenario 2: Unverified doctor attempts to publish protocol → Access blocked
  it('Scenario 2: prevents unverified user/doctor from directly publishing protocols without admin review', () => {
    AuthService.setRoleForTesting('citizen');
    const doctorProfile = DoctorVerificationService.submitApplication({
      userId: 'test-user-citizen',
      fullName: 'Mr. Unverified Candidate',
      email: 'candidate@test.com',
      phone: '+91 99999 11111',
      registrationNumber: 'TEST-UNVERIFIED',
      registrationAuthority: 'State Council',
      state: 'Maharashtra',
      qualification: 'MBBS',
      specialization: 'General',
      hospitalName: 'Clinic',
      experienceYears: 2,
      professionalAddress: 'Town Center'
    });

    expect(doctorProfile.status).toBe('PENDING');

    // Attempting to publish without super admin authority fails
    expect(() => {
      EmergencyProtocolService.createProtocol({
        title: 'Unauthorized Clinical Guideline',
        slug: 'unauthorized-guideline',
        status: 'PUBLISHED',
        isPublic: true,
        category: 'Cardiac Emergency',
        shortDescription: 'Unverified protocol',
        symptoms: ['Chest pain'],
        warningSigns: ['Collapse'],
        immediateSafetyMeasures: 'Rest',
        responseSteps: [{ number: '1', title: 'Rest', detail: 'Rest' }],
        whatNotToDo: ['Do not run'],
        whenToCallEmergency: 'Call 112',
        requiredEquipment: [],
        specialPrecautions: 'None',
        targetAudience: 'Public',
        medicalReferences: [],
        authorId: 'test-user-citizen',
        authorName: 'Mr. Unverified Candidate'
      });
    }).toThrow(/Only verified doctors and administrators can create protocols/i);
  });

  // Scenario 3: Doctor submits verification → State becomes PENDING in admin queue
  it('Scenario 3: doctor verification application is marked PENDING and appears in admin queue', () => {
    const docApp = DoctorVerificationService.submitApplication({
      userId: 'doctor-applicant-101',
      fullName: 'Dr. Neha Patwardhan',
      email: 'dr.neha@hospital.org',
      phone: '+91 98221 44332',
      registrationNumber: 'MMC-2019-094182',
      registrationAuthority: 'Maharashtra Medical Council',
      state: 'Maharashtra',
      qualification: 'MBBS, MD (Pediatrics)',
      specialization: 'Pediatric Emergencies',
      hospitalName: 'Taluka Child Hospital',
      experienceYears: 7,
      professionalAddress: 'Hospital Road, Junnar',
      certificateUrl: 'https://jeevansetu.med/certs/MMC-2019-094182.pdf'
    });

    expect(docApp.status).toBe('PENDING');

    // Admin inspects queue
    const allDoctors = DoctorVerificationService.getAll();
    const found = allDoctors.find((d) => d.registrationNumber === 'MMC-2019-094182');
    expect(found).toBeDefined();
    expect(found?.status).toBe('PENDING');
  });

  // Scenario 4: Admin approves doctor → Doctor status becomes VERIFIED and permissions granted
  it('Scenario 4: admin verifies doctor credentials, granting VERIFIED status and medical author permissions', () => {
    AuthService.setRoleForTesting('super_admin');

    const app = DoctorVerificationService.submitApplication({
      userId: 'doc-user-approved',
      fullName: 'Dr. Anand Kulkarni',
      email: 'anand@hospital.org',
      phone: '+91 98222 33445',
      registrationNumber: 'MMC-2012-110022',
      registrationAuthority: 'Maharashtra Medical Council',
      state: 'Maharashtra',
      qualification: 'MBBS, MS (Surgery)',
      specialization: 'Trauma Surgery',
      hospitalName: 'District Hospital',
      experienceYears: 12,
      professionalAddress: 'Main Road'
    });

    const verified = DoctorVerificationService.verifyDoctor(app.id, 'Cross-checked with Maharashtra Council registry');
    expect(verified?.status).toBe('VERIFIED');
    expect(verified?.verifiedBy).toBeDefined();

    // Verify list reflects active verification
    const verifiedList = DoctorVerificationService.getVerifiedDoctors();
    expect(verifiedList.some((d) => d.id === app.id)).toBe(true);
  });

  // Scenario 5: Admin rejects doctor → Status becomes REJECTED with rejection reason
  it('Scenario 5: admin rejects doctor application with mandatory statutory reason', () => {
    AuthService.setRoleForTesting('super_admin');

    const app = DoctorVerificationService.submitApplication({
      userId: 'doc-user-fake',
      fullName: 'Dr. Bogus Applicant',
      email: 'fake@med.org',
      phone: '+91 90000 00000',
      registrationNumber: 'INVALID-999',
      registrationAuthority: 'Maharashtra Medical Council',
      state: 'Maharashtra',
      qualification: 'None',
      specialization: 'None',
      hospitalName: 'None',
      experienceYears: 0,
      professionalAddress: 'Unknown'
    });

    const rejected = DoctorVerificationService.rejectDoctor(app.id, 'Registration number not found in State Medical Council registry');
    expect(rejected?.status).toBe('REJECTED');
    expect(rejected?.rejectionReason).toContain('not found in State Medical Council');
  });

  // Scenario 6: Doctor creates protocol → Protocol saved as DRAFT
  it('Scenario 6: verified doctor creates a new protocol and it is safely saved as DRAFT', () => {
    AuthService.setRoleForTesting('verified_doctor');

    const proto = EmergencyProtocolService.createProtocol({
      title: 'Pediatric Febrile Seizure Triage',
      slug: 'febrile-seizure',
      status: 'DRAFT',
      isPublic: false,
      category: 'Seizures',
      shortDescription: 'First response protocol for high fever seizures in infants and children under 5.',
      symptoms: ['Sudden body stiffening', 'Rhythmic jerking of limbs', 'Fever > 38.5 C'],
      warningSigns: ['Seizure lasting longer than 5 minutes', 'Difficulty breathing or blue lips'],
      immediateSafetyMeasures: 'Lay child on soft flat surface on their side (recovery position). Clear surrounding sharp objects.',
      responseSteps: [
        { number: '1', title: 'Lateral Recovery Position', detail: 'Turn child gently onto their side to keep airway clear of saliva or vomit.' },
        { number: '2', title: 'Time the Seizure', detail: 'Look at watch. If seizure exceeds 5 minutes, call 112 / 108 immediately.' }
      ],
      whatNotToDo: [
        'DO NOT place fingers, spoons, or water inside child mouth.',
        'DO NOT violently restrain twitching limbs.',
        'DO NOT give oral liquids while drowsy.'
      ],
      whenToCallEmergency: 'Call 112 / 108 if seizure lasts > 5 minutes or if child does not wake up after jerking stops.',
      requiredEquipment: ['Digital Thermometer', 'Cool damp cloth (for tepid sponging)'],
      specialPrecautions: 'Tepid sponge forehead only with room temperature water, never iced water.',
      targetAudience: 'Parents, Daycare Providers, ASHA Workers',
      medicalReferences: ['Indian Academy of Pediatrics (IAP) Guidelines on Febrile Seizures 2024'],
      authorId: 'user-doc-pediatrician',
      authorName: 'Dr. Neha Patwardhan (MD Pediatrics)',
      authorRegistrationNo: 'MMC-2019-094182'
    });

    expect(proto.status).toBe('DRAFT');
    expect(proto.isPublic).toBe(false);
    expect(proto.version).toBe(1);

    // Public cannot view unapproved drafts
    const publicList = EmergencyProtocolService.getPublishedProtocols();
    expect(publicList.some((p) => p.id === proto.id)).toBe(false);
  });

  // Scenario 7: Doctor submits protocol → Status becomes PENDING_APPROVAL
  it('Scenario 7: submitting a draft protocol transitions status to PENDING_APPROVAL', () => {
    AuthService.setRoleForTesting('verified_doctor');

    const proto = EmergencyProtocolService.createProtocol({
      title: 'Heatstroke and Severe Hyperthermia',
      slug: 'heatstroke',
      status: 'DRAFT',
      isPublic: false,
      category: 'Other Medical Emergencies',
      shortDescription: 'Emergency cooling protocol for severe agricultural heat exhaustion.',
      symptoms: ['High body temperature > 40 C', 'Altered mental state or confusion'],
      warningSigns: ['Unresponsiveness', 'Lack of sweating with hot dry skin'],
      immediateSafetyMeasures: 'Move victim to deep shade immediately. Remove excess clothing.',
      responseSteps: [{ number: '1', title: 'Aggressive Cooling', detail: 'Mist with cool water and fan continuously.' }],
      whatNotToDo: ['DO NOT give aspirin or paracetamol (ineffective for heatstroke).'],
      whenToCallEmergency: 'Call 112 immediately for any suspected classic or exertional heatstroke.',
      requiredEquipment: ['Water mist bottle', 'Hand fan'],
      specialPrecautions: 'Monitor airway continuously.',
      targetAudience: 'Rural field workers',
      medicalReferences: ['National Center for Disease Control (NCDC) Heat Health Guidelines'],
      authorId: 'doc-user-1',
      authorName: 'Dr. Rajesh Kulkarni'
    });

    expect(proto.status).toBe('DRAFT');

    const submitted = EmergencyProtocolService.submitForApproval(proto.id);
    expect(submitted?.status).toBe('PENDING_APPROVAL');

    const pendingQueue = EmergencyProtocolService.getPendingApprovals();
    expect(pendingQueue.some((p) => p.id === proto.id)).toBe(true);
  });

  // Scenario 8: Admin reviews protocol → Protocol moved to UNDER_REVIEW
  it('Scenario 8: admin initiates review of submitted protocol moving status to UNDER_REVIEW', () => {
    AuthService.setRoleForTesting('super_admin');

    const proto = EmergencyProtocolService.createProtocol({
      title: 'Anaphylaxis Severe Allergic Reaction',
      slug: 'anaphylaxis',
      status: 'PENDING_APPROVAL',
      isPublic: false,
      category: 'Allergic Reactions',
      shortDescription: 'Rapid intramuscular epinephrine delivery and emergency dispatch.',
      symptoms: ['Swollen tongue or throat', 'Severe wheezing', 'Hives and hypotension'],
      warningSigns: ['Stridor', 'Respiratory arrest'],
      immediateSafetyMeasures: 'Lay patient flat with legs elevated unless breathing is very difficult.',
      responseSteps: [{ number: '1', title: 'Auto-Injector / Epinephrine', detail: 'Administer Epinephrine 0.3mg IM into mid-outer thigh.' }],
      whatNotToDo: ['DO NOT allow patient to stand or walk abruptly.'],
      whenToCallEmergency: 'Call 112 immediately after epinephrine injection.',
      requiredEquipment: ['Epinephrine 1:1000 autoinjector'],
      specialPrecautions: 'Second dose may be required after 5-15 minutes if no response.',
      targetAudience: 'General Public and School Staff',
      medicalReferences: ['World Allergy Organization (WAO) Anaphylaxis Guidance 2024'],
      authorId: 'doc-user-1',
      authorName: 'Dr. Rajesh Kulkarni'
    });

    const underReview = EmergencyProtocolService.updateProtocol(proto.id, { status: 'UNDER_REVIEW' }, 'Board clinical review commenced');
    expect(underReview?.status).toBe('UNDER_REVIEW');
  });

  // Scenario 9: Admin approves protocol → Protocol PUBLISHED and visible to users
  it('Scenario 9: admin approves protocol, increments version, and publishes to public directory', () => {
    AuthService.setRoleForTesting('super_admin');

    const proto = EmergencyProtocolService.createProtocol({
      title: 'Accidental Organophosphate Pesticide Poisoning',
      slug: 'pesticide-poisoning',
      status: 'PENDING_APPROVAL',
      isPublic: false,
      category: 'Poisoning',
      shortDescription: 'Decontamination and hospital transfer protocol for agricultural pesticide ingestion or skin absorption.',
      symptoms: ['Pinpoint pupils', 'Excessive salivation and sweating', 'Vomiting and diarrhea'],
      warningSigns: ['Convulsions', 'Severe bronchospasm and cyanosis'],
      immediateSafetyMeasures: 'Remove all contaminated clothing wearing gloves. Wash skin thoroughly with running water and soap.',
      responseSteps: [
        { number: '1', title: 'Dermal Decontamination', detail: 'Strip clothing and flush skin with copius water.' },
        { number: '2', title: 'Emergency Dispatch 112 / 108', detail: 'Transport immediately with pesticide label / bottle for antivenom/atropine dosing.' }
      ],
      whatNotToDo: ['DO NOT induce vomiting with salt water or kerosene (fatal aspiration risk).'],
      whenToCallEmergency: 'Call 112 immediately upon suspected ingestion.',
      requiredEquipment: ['Protective latex/nitrile gloves', 'Copious clean water and soap'],
      specialPrecautions: 'Responders must protect themselves from contact with contaminated vomit or skin.',
      targetAudience: 'Farmers, Primary Responders, ASHA Workers',
      medicalReferences: ['WHO Pesticide Poisoning Guidelines', 'ICMR Toxicology Manual'],
      authorId: 'user-doc-toxicologist',
      authorName: 'Dr. Anita Joshi'
    });

    const approved = EmergencyProtocolService.approveProtocol(
      proto.id,
      'admin-super-1',
      'Super Admin Medical Directorate',
      'ICMR-compliant clinical decontamination steps verified'
    );

    expect(approved?.status).toBe('PUBLISHED');
    expect(approved?.isPublic).toBe(true);
    expect(approved?.version).toBe(2);
    expect(approved?.lastReviewedAt).toBeDefined();

    // Verify public can view approved protocol
    const publicProtocols = EmergencyProtocolService.getPublishedProtocols();
    expect(publicProtocols.some((p) => p.slug === 'pesticide-poisoning')).toBe(true);
  });

  // Scenario 10: Admin rejects protocol → Protocol REJECTED with rejection reason
  it('Scenario 10: admin rejects protocol with explicit clinical reason and notifies author', () => {
    AuthService.setRoleForTesting('super_admin');

    const proto = EmergencyProtocolService.createProtocol({
      title: 'Unverified Herb Ingestion for Snakebite',
      slug: 'herb-snakebite',
      status: 'PENDING_APPROVAL',
      isPublic: false,
      category: 'Poisoning',
      shortDescription: 'Folk remedy concoctions.',
      symptoms: ['Bite pain'],
      warningSigns: ['Bleeding'],
      immediateSafetyMeasures: 'Drink herbal paste.',
      responseSteps: [{ number: '1', title: 'Drink Paste', detail: 'Ingest herbal concoction.' }],
      whatNotToDo: ['None'],
      whenToCallEmergency: 'After 2 hours',
      requiredEquipment: [],
      specialPrecautions: 'None',
      targetAudience: 'Public',
      medicalReferences: [],
      authorId: 'doc-user-1',
      authorName: 'Dr. Test'
    });

    const rejected = EmergencyProtocolService.rejectProtocol(
      proto.id,
      'Folk herbal remedies directly contradict national snakebite protocol; antivenom and hospital splinting are mandatory',
      'admin-super-1',
      'Super Admin'
    );

    expect(rejected?.status).toBe('REJECTED');
    expect(rejected?.isPublic).toBe(false);
    expect(rejected?.rejectionReason).toContain('Folk herbal remedies directly contradict');
  });

  // Scenario 11: Admin requests changes → Protocol marked CHANGES_REQUESTED
  it('Scenario 11: admin requests modifications, transitioning protocol to CHANGES_REQUESTED', () => {
    AuthService.setRoleForTesting('super_admin');

    const proto = EmergencyProtocolService.createProtocol({
      title: 'Adult Choking First Aid',
      slug: 'adult-choking',
      status: 'PENDING_APPROVAL',
      isPublic: false,
      category: 'Choking',
      shortDescription: 'Abdominal thrusts for airway obstruction.',
      symptoms: ['Inability to speak', 'Universal choking sign'],
      warningSigns: ['Loss of consciousness'],
      immediateSafetyMeasures: 'Encourage coughing if responsive.',
      responseSteps: [{ number: '1', title: 'Abdominal Thrusts', detail: 'Heimlich maneuver.' }],
      whatNotToDo: ['DO NOT slap back while coughing.'],
      whenToCallEmergency: 'Call 112.',
      requiredEquipment: [],
      specialPrecautions: 'None',
      targetAudience: 'Public',
      medicalReferences: [],
      authorId: 'doc-user-1',
      authorName: 'Dr. Rajesh Kulkarni'
    });

    const changed = EmergencyProtocolService.requestChanges(
      proto.id,
      'Please add separate sub-steps distinguishing 5 back blows prior to abdominal thrusts as per ERC 2024 guidelines'
    );

    expect(changed?.status).toBe('CHANGES_REQUESTED');
    expect(changed?.changeRequestNotes).toContain('ERC 2024 guidelines');
    expect(changed?.isPublic).toBe(false);
  });

  // Scenario 12: Public donor list masks contact information → Phone and address protected
  it('Scenario 12: public donor directory masks phone number and hides residential street address', () => {
    AuthService.setRoleForTesting('citizen'); // Normal public citizen

    BloodDonorService.addDonor({
      fullName: 'Vikram Mohan Deshmukh',
      phone: '+91 98220 55443',
      email: 'vikram.private@mail.com',
      age: 34,
      bloodGroup: 'B+',
      rhFactor: 'POSITIVE',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Manchar',
      pincode: '410503',
      area: 'Flat 402, Shivneri Residency, MG Road', // Sensitive residential address
      availabilityStatus: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      preferredContactMethod: 'MASKED_PHONE',
      consentToContact: true
    });

    const publicDonors = BloodDonorService.getPublicDonors();
    const vikram = publicDonors.find((d) => d.bloodGroup === 'B+' && d.city === 'Manchar');

    expect(vikram).toBeDefined();
    // Phone must be masked
    expect(vikram?.maskedPhone).toContain('••••');
    expect(vikram?.maskedPhone).not.toBe('+91 98220 55443');
    // Exact street address is excluded from public object
    expect((vikram as any).area).toBeUndefined();
    expect(vikram?.broadLocality).toBe('Manchar, Pune');
  });

  // Scenario 13: Super Admin accesses donor management → Full contact details available
  it('Scenario 13: Super Admin has authorized unmasked access to full donor records', () => {
    AuthService.setRoleForTesting('super_admin');

    const donors = BloodDonorService.getAll();
    expect(donors.length).toBeGreaterThan(0);

    const first = donors[0];
    expect(first.phone).toBeDefined();
    expect(first.phone).not.toContain('••••'); // Full phone accessible to admin
    expect(first.area).toBeDefined(); // Full area accessible to admin
  });

  // Scenario 14: Normal user registers as blood donor → Appears in registry with consent
  it('Scenario 14: citizen registers voluntarily as a blood donor with mandatory consent', () => {
    AuthService.setRoleForTesting('citizen');

    const newDonor = BloodDonorService.addDonor({
      userId: 'citizen-donor-777',
      fullName: 'Aakash Dilip Gaikwad',
      phone: '+91 97651 88990',
      email: 'aakash.g@gmail.com',
      age: 26,
      gender: 'Male',
      bloodGroup: 'O+',
      rhFactor: 'POSITIVE',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Khed',
      pincode: '410501',
      area: 'Rajgurunagar Sector 1',
      availabilityStatus: 'ACTIVE',
      verificationStatus: 'UNVERIFIED',
      preferredContactMethod: 'IN_APP',
      consentToContact: true
    });

    expect(newDonor.id).toBeDefined();
    expect(newDonor.bloodGroup).toBe('O+');
    expect(newDonor.consentToContact).toBe(true);

    const registered = BloodDonorService.getById(newDonor.id);
    expect(registered).toBeDefined();
    expect(registered?.fullName).toBe('Aakash Dilip Gaikwad');
  });

  // Scenario 15: Duplicate donor registration prevented
  it('Scenario 15: prevents duplicate donor registrations using mobile number or user identity', () => {
    AuthService.setRoleForTesting('citizen');

    BloodDonorService.addDonor({
      userId: 'user-unique-123',
      fullName: 'First Donor Record',
      phone: '+91 94220 99887',
      bloodGroup: 'AB+',
      rhFactor: 'POSITIVE',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Junnar',
      pincode: '410502',
      area: 'Near Gram Panchayat',
      availabilityStatus: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      preferredContactMethod: 'IN_APP',
      consentToContact: true
    });

    // Duplicate Phone Check
    expect(() => {
      BloodDonorService.addDonor({
        userId: 'user-different-456',
        fullName: 'Duplicate Mobile Record',
        phone: '+91 94220 99887', // Identical phone
        bloodGroup: 'O-',
        rhFactor: 'NEGATIVE',
        state: 'Maharashtra',
        district: 'Pune',
        city: 'Khed',
        pincode: '410501',
        area: 'Sector 3',
        availabilityStatus: 'ACTIVE',
        verificationStatus: 'UNVERIFIED',
        preferredContactMethod: 'MASKED_PHONE',
        consentToContact: true
      });
    }).toThrow(/already registered in the registry/i);

    // Duplicate User ID Check
    expect(() => {
      BloodDonorService.addDonor({
        userId: 'user-unique-123', // Identical user
        fullName: 'Duplicate User Record',
        phone: '+91 91111 22222',
        bloodGroup: 'A+',
        rhFactor: 'POSITIVE',
        state: 'Maharashtra',
        district: 'Pune',
        city: 'Khed',
        pincode: '410501',
        area: 'Sector 4',
        availabilityStatus: 'ACTIVE',
        verificationStatus: 'UNVERIFIED',
        preferredContactMethod: 'IN_APP',
        consentToContact: true
      });
    }).toThrow(/already have a registered donor profile/i);
  });

  // Additional sanity test for Analytics generation
  it('generates consistent system analytics and exports for CSV/JSON', () => {
    const stats = AdminAnalyticsService.getOverviewStats();
    expect(stats.totalRegisteredDonors).toBeGreaterThan(0);
    expect(stats.publishedProtocols).toBeGreaterThan(0);

    const donorsCsv = AdminAnalyticsService.exportDonorsCsv();
    expect(donorsCsv).toContain('Full Name,Blood Group,Rh Factor,City');

    const protocolsCsv = AdminAnalyticsService.exportProtocolsCsv();
    expect(protocolsCsv).toContain('Title,Category,Status,Version');

    const json = AdminAnalyticsService.exportAnalyticsJson();
    const parsed = JSON.parse(json);
    expect(parsed.overview).toBeDefined();
    expect(parsed.bloodGroupDistribution).toBeInstanceOf(Array);
  });

  // Role-Wise Authentication tests
  it('authenticates Super Admin with dedicated credentials and elevates permissions', async () => {
    AuthService.setRoleForTesting('citizen');
    expect(AuthService.isSuperAdmin()).toBe(false);

    const loginRes = await AuthService.loginAsSuperAdmin('admin@jeevansetu.med', 'Admin@123');
    expect(loginRes.success).toBe(true);
    expect(loginRes.user?.role).toBe('super_admin');
    expect(AuthService.isSuperAdmin()).toBe(true);

    // Negative case: invalid email
    const badLogin = await AuthService.loginAsSuperAdmin('stranger@random.com', 'Admin@123');
    expect(badLogin.success).toBe(false);
    expect(badLogin.error).toContain('Invalid Super Admin email');
  });

  it('authenticates Verified Doctor with Medical Council credentials and elevates permissions', async () => {
    AuthService.setRoleForTesting('citizen');
    expect(AuthService.isVerifiedDoctor()).toBe(false);

    // Login using registration number
    const docLogin = await AuthService.loginAsDoctor('MMC-2008-041289', 'Doctor@123');
    expect(docLogin.success).toBe(true);
    expect(docLogin.user?.role).toBe('verified_doctor');
    expect(AuthService.isVerifiedDoctor()).toBe(true);

    // Sign out
    await AuthService.signOut();
    expect(AuthService.isVerifiedDoctor()).toBe(false);
    expect(AuthService.getCurrentUser().isGuest).toBe(true);
  });
});
