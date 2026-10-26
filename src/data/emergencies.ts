import { EmergencyProtocol } from '../types/health';

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'snake-bite',
    slug: 'snake-bite',
    title: 'Snake Bite',
    hindiTitle: 'सांप का काटना',
    icon: '🐍',
    warningText: 'GET MEDICAL HELP IMMEDIATELY. DO NOT DELAY FOR TRADITIONAL REMEDIES.',
    immediateAction: 'Keep the victim calm, immobilize the affected limb below heart level, and arrange rapid transport to the nearest hospital with anti-snake venom (ASV).',
    doList: [
      'Keep the person completely calm and still (movement speeds venom spread).',
      'Immobilize the bitten limb using a splint or firm cloth bandage without cutting circulation.',
      'Remove tight jewellery, rings, or constricting clothing near the bite before swelling occurs.',
      'Note the time of the bite and try to remember the appearance of the snake safely (do not chase it).',
      'Rush to the nearest Community Health Centre (CHC) or District Hospital with Anti-Snake Venom (ASV).'
    ],
    dontList: [
      'DO NOT cut or slash the bite area with blades or knives.',
      'DO NOT attempt to suck out venom with mouth or suction devices.',
      'DO NOT apply a tight tourniquet or tight rope.',
      'DO NOT apply ice, potassium permanganate, or herbal pastes.',
      'DO NOT give alcohol, caffeinated drinks, or painkillers without medical advice.'
    ],
    steps: [
      {
        number: '01',
        title: 'Immobilize and Reassure',
        detail: 'Sit or lay the person down. Ensure they remain motionless. Reassure them that anti-venom treatment is effective.'
      },
      {
        number: '02',
        title: 'Call Ambulance / Transport',
        detail: 'Dial 108 or arrange an immediate vehicle to transfer the person in a lying position.'
      },
      {
        number: '03',
        title: 'Monitor Vitals',
        detail: 'Watch for breathing difficulty, drooping eyelids, excessive salivation, or loss of consciousness.'
      },
      {
        number: '04',
        title: 'Hospital Handover',
        detail: 'Tell the attending doctor the exact time of bite and any symptoms that developed during transit.'
      }
    ],
    whenProfessionalHelpRequired: 'Always required immediately for any suspected snake bite, even if symptoms are not yet visible.',
    emergencyNumber: '108',
    ambulanceHelpline: '102 / 108'
  },
  {
    id: 'heart-attack',
    slug: 'heart-attack',
    title: 'Suspected Heart Attack / Severe Chest Pain',
    hindiTitle: 'दिल का दौरा / सीने में तेज दर्द',
    icon: '❤️',
    warningText: 'POTENTIAL LIFE-THREATENING CARDIAC EMERGENCY. EVERY MINUTE COUNTS.',
    immediateAction: 'Have the person sit in a comfortable W-position (knees bent, back supported), loosen tight clothing, and call emergency services immediately.',
    doList: [
      'Have the patient sit down in a half-sitting position with knees bent and back supported.',
      'Loosen tight clothing around the neck, chest, and waist.',
      'Ask if they have prescribed emergency heart medication (e.g., Sorbitrate/Nitroglycerin) and assist them in taking it.',
      'If not allergic and advised by a health professional, a 300mg chewable Aspirin may be given while waiting.',
      'Keep the room well-ventilated and calm the patient.'
    ],
    dontList: [
      'DO NOT allow the person to walk, drive, or exert themselves physically.',
      'DO NOT ignore pain radiating to left arm, neck, jaw, back, or accompanied by cold sweat.',
      'DO NOT give heavy food or water if the person feels faint or nauseated.',
      'DO NOT wait for hours assuming it is just acidity or gas.'
    ],
    steps: [
      {
        number: '01',
        title: 'Rest in W-Position',
        detail: 'Sit the patient comfortably on the floor or bed, leaning against support with knees slightly bent.'
      },
      {
        number: '02',
        title: 'Call Emergency 108',
        detail: 'Request an Advanced Life Support (ALS) ambulance immediately with ECG and oxygen support.'
      },
      {
        number: '03',
        title: 'Check Responsiveness',
        detail: 'Keep talking to the person. If they become unresponsive and stop normal breathing, begin chest compressions (CPR).'
      },
      {
        number: '04',
        title: 'Continuous Observation',
        detail: 'Do not leave the patient unattended until medical personnel take charge.'
      }
    ],
    whenProfessionalHelpRequired: 'Immediately when chest pressure, tightness, squeezing, or pain radiates to jaw/arm with sweating or shortness of breath.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'stroke',
    slug: 'stroke',
    title: 'Stroke Warning Signs (F.A.S.T.)',
    hindiTitle: 'स्ट्रोक / लकवा के लक्षण',
    icon: '🧠',
    warningText: 'BRAIN ATTACK EMERGENCY. RAPID TREATMENT PREVENTS PERMANENT DISABILITY.',
    immediateAction: 'Perform the FAST check (Face drooping, Arm weakness, Speech slurred, Time to call). Rush to a CT-scan equipped hospital immediately.',
    doList: [
      'Use the FAST test: Face drooping on one side? Arm drifts down? Speech slurred? Time to call!',
      'Note the exact minute and hour when symptoms were first observed.',
      'Keep the person lying on their side with head slightly elevated if conscious.',
      'Ensure the airway is clear and loosen tight neck collars.',
      'Transport directly to a facility capable of emergency brain imaging (CT scan).'
    ],
    dontList: [
      'DO NOT give anything to eat, drink, or swallow (swallowing reflex may be impaired).',
      'DO NOT give blood thinners or home medicines before a hospital CT scan determines the stroke type.',
      'DO NOT let the person sleep or "wait and see" if weakness goes away.',
      'DO NOT perform vigorous massage or oil applications on paralyzed limbs.'
    ],
    steps: [
      {
        number: '01',
        title: 'Identify FAST Signs',
        detail: 'Ask them to smile (look for uneven mouth), raise both arms (look for drift), and repeat a simple sentence.'
      },
      {
        number: '02',
        title: 'Record Symptom Onset Time',
        detail: 'Hospital clot-busting treatments are most effective within the first 3 to 4.5 hours from exact onset.'
      },
      {
        number: '03',
        title: 'Position in Recovery State',
        detail: 'If vomiting occurs, roll them gently onto their side to prevent choking.'
      },
      {
        number: '04',
        title: 'Immediate Transit',
        detail: 'Notify the receiving hospital that a suspected stroke patient is en route.'
      }
    ],
    whenProfessionalHelpRequired: 'Sudden weakness/numbness of face, arm, leg (especially one side of body), sudden confusion, difficulty speaking, or sudden loss of balance.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'severe-bleeding',
    slug: 'severe-bleeding',
    title: 'Severe Bleeding & Hemorrhage',
    hindiTitle: 'गंभीर रक्तस्राव / खून बहना',
    icon: '🩸',
    warningText: 'RAPID BLOOD LOSS CAN CAUSE FATAL SHOCK WITHIN MINUTES.',
    immediateAction: 'Apply firm, continuous direct pressure over the wound using a clean cloth or sterile gauze. Elevate the bleeding area above heart level if no fracture.',
    doList: [
      'Press firmly directly over the bleeding site with a clean cloth, towel, or sterile pad.',
      'Maintain continuous pressure for at least 10–15 minutes without lifting the cloth to check.',
      'If blood soaks through, add another layer of cloth on top without removing the first layer.',
      'Elevate the injured limb above the level of the heart if bones are not fractured.',
      'Keep the person warm with a blanket to prevent shock from blood loss.'
    ],
    dontList: [
      'DO NOT remove deeply embedded objects (like glass or knives) — bandage around them securely.',
      'DO NOT remove the initial blood-soaked cloth as this dislodges forming blood clots.',
      'DO NOT use dirty mud, ash, cow dung, or turmeric paste into deep bleeding wounds.',
      'DO NOT bend or manipulate a limb that appears fractured.'
    ],
    steps: [
      {
        number: '01',
        title: 'Direct Pressure',
        detail: 'Press hard with palms using clean cloth directly on the point of bleeding.'
      },
      {
        number: '02',
        title: 'Secure Pressure Dressing',
        detail: 'Tie a bandage or cloth firmly over the pad to keep continuous pressure.'
      },
      {
        number: '03',
        title: 'Treat for Shock',
        detail: 'Lay the person down, raise legs 12 inches if no head/spinal injury, and keep them warm.'
      },
      {
        number: '04',
        title: 'Emergency Transfer',
        detail: 'Transport immediately to the nearest surgical or emergency care facility.'
      }
    ],
    whenProfessionalHelpRequired: 'Pulsing or spurting blood, bleeding that will not stop after 10 minutes of direct pressure, deep gaping wounds, or signs of shock (paleness, dizziness).',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'severe-breathing-difficulty',
    slug: 'severe-breathing-difficulty',
    title: 'Severe Breathing Difficulty & Choking',
    hindiTitle: 'सांस लेने में भारी तकलीफ / दम घुटना',
    icon: '🫁',
    warningText: 'ACUTE RESPIRATORY DISTRESS. AIRWAY COMPROMISE REQUIRES IMMEDIATE INTERVENTION.',
    immediateAction: 'Keep the person in an upright sitting position leaning slightly forward. Ensure fresh air and assist with prescribed inhaler if available.',
    doList: [
      'Help the person sit upright leaning forward with hands on knees ("tripod position").',
      'Open windows and remove crowds to ensure maximum fresh airflow.',
      'Assist with their prescribed rescue inhaler (e.g., Salbutamol/Asthalin) with spacer if they have asthma.',
      'For choking in a conscious adult: give 5 sharp back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver).',
      'Loosen any tight collars, neckties, or restrictive chest clothing.'
    ],
    dontList: [
      'DO NOT force the person to lie flat on their back (this worsens breathlessness).',
      'DO NOT give solid food or liquids while the person is struggling to breathe.',
      'DO NOT perform blind finger sweeps in a choking child’s mouth.',
      'DO NOT burn incense or spray perfumes near a breathless patient.'
    ],
    steps: [
      {
        number: '01',
        title: 'Upright Positioning',
        detail: 'Sit them up immediately. Never lay a breathless person flat.'
      },
      {
        number: '02',
        title: 'Assess Airway',
        detail: 'Determine if it is an asthma attack, allergic anaphylaxis, or foreign body choking.'
      },
      {
        number: '03',
        title: 'Emergency Inhalation',
        detail: 'Give 2 to 4 puffs of rescue inhaler every 5 minutes if asthma is suspected.'
      },
      {
        number: '04',
        title: 'Oxygen Support Transfer',
        detail: 'Call 108 ambulance with oxygen equipment immediately.'
      }
    ],
    whenProfessionalHelpRequired: 'Bluish lips/nails, inability to speak full sentences, chest retractions (sucking in of ribs), gasping, or stridor (high-pitched breathing).',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'unconsciousness',
    slug: 'unconsciousness',
    title: 'Unconscious / Non-Responsive Person',
    hindiTitle: 'बेहोशी / चेतना खोना',
    icon: '😵',
    warningText: 'UNRESPONSIVE STATE INDICATES SEVERE BRAIN, CARDIAC, OR METABOLIC DYSFUNCTION.',
    immediateAction: 'Check responsiveness and breathing. If breathing normally, place in the Recovery Position (on their side). If NOT breathing, start CPR compressions.',
    doList: [
      'Tap shoulders and shout loudly: "Are you okay?" to assess responsiveness.',
      'Check for normal breathing by watching chest rise for 10 seconds.',
      'If breathing normally: roll gently into the Recovery Position on their side with top leg bent to maintain airway.',
      'If not breathing or only gasping: begin hard and fast chest compressions in center of chest (100–120/min).',
      'Call 108 immediately and put on speakerphone.'
    ],
    dontList: [
      'DO NOT pour water on the face or force water/food into an unconscious mouth.',
      'DO NOT shake vigorously, slap, or move violently if neck injury is possible.',
      'DO NOT leave the person lying flat on their back if they are vomiting (risk of choking).',
      'DO NOT crowd closely around the patient.'
    ],
    steps: [
      {
        number: '01',
        title: 'Check Response & Breathing',
        detail: 'Look, listen, and feel for normal breaths. Gasping sounds are not normal breathing.'
      },
      {
        number: '02',
        title: 'Recovery Position or CPR',
        detail: 'Side recovery position for breathing patients; continuous CPR compressions for non-breathing.'
      },
      {
        number: '03',
        title: 'Dial 108',
        detail: 'State your location clearly and follow the dispatcher guidance.'
      },
      {
        number: '04',
        title: 'Reassess Every Minute',
        detail: 'Continuously check breathing until emergency paramedics arrive.'
      }
    ],
    whenProfessionalHelpRequired: 'Any instance of unexplained unconsciousness, fainting lasting over 1 minute, or fainting with head trauma.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'seizure',
    slug: 'seizure',
    title: 'Seizures & Convulsions (Fits)',
    hindiTitle: 'दौरे / मिर्गी का झटका',
    icon: '🫨',
    warningText: 'ACTIVE SEIZURE. PROTECT FROM PHYSICAL INJURY AND MAINTAIN AIRWAY.',
    immediateAction: 'Gently guide to the ground, clear sharp/hard objects nearby, cushion the head with folded cloth, and time the seizure. Do NOT put objects into the mouth.',
    doList: [
      'Cushion the person’s head with a soft pillow, folded blanket, or jacket.',
      'Clear away sharp furniture, rocks, glass, or hard objects.',
      'Loosen tight clothing around the neck.',
      'Once jerking stops, roll the person onto their side in recovery position to keep airway clear.',
      'Time the seizure from start to finish.'
    ],
    dontList: [
      'DO NOT force any spoons, shoes, onions, metal keys, or fingers into their mouth.',
      'DO NOT restrain or forcibly hold down their limbs during violent jerking.',
      'DO NOT give liquids, pills, or food until fully alert and oriented.',
      'DO NOT shout, splash water, or shake them.'
    ],
    steps: [
      {
        number: '01',
        title: 'Protect from Trauma',
        detail: 'Ensure head is cushioned and dangerous surroundings are cleared.'
      },
      {
        number: '02',
        title: 'Track Duration',
        detail: 'Note time. Seizures lasting over 5 minutes or repeated seizures require urgent ICU care.'
      },
      {
        number: '03',
        title: 'Turn on Side Post-Seizure',
        detail: 'After jerking ends, place in recovery position to allow saliva or vomit to drain.'
      },
      {
        number: '04',
        title: 'Reassure as They Awaken',
        detail: 'Stay with them calmly as confusion is common during the post-ictal phase.'
      }
    ],
    whenProfessionalHelpRequired: 'Seizure lasting longer than 5 minutes, first-time seizure, pregnant woman having a seizure (suspected eclampsia), or slow recovery.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'serious-burns',
    slug: 'serious-burns',
    title: 'Severe Burns & Scalds',
    hindiTitle: 'गंभीर रूप से जलना',
    icon: '🔥',
    warningText: 'EXTENSIVE BURNS REQUIRE STERILE PROTECTION AND RAPID FLUID RESUSCITATION.',
    immediateAction: 'Cool burn immediately with clean, cool running water for 10–20 minutes. Cover loosely with clean non-stick cloth. Do NOT apply ice, butter, or paste.',
    doList: [
      'Cool the burned skin with clean, cool running tap water for 10 to 20 minutes.',
      'Gently remove rings, watches, or loose clothing before swelling begins.',
      'Cover the burn loosely with clean plastic cling wrap or a sterile non-stick cloth.',
      'Keep the rest of the patient warm to prevent hypothermia.',
      'Give small sips of clean water or Oral Rehydration Solution (ORS) if conscious and able to swallow.'
    ],
    dontList: [
      'DO NOT apply ice, icy water, toothpaste, butter, flour, turmeric, or cow dung.',
      'DO NOT burst blisters (blister skin protects against severe infection).',
      'DO NOT forcibly peel off clothing that is melted or stuck to burned flesh.',
      'DO NOT use fluffy cotton wool directly on raw burned flesh.'
    ],
    steps: [
      {
        number: '01',
        title: 'Cool with Water',
        detail: 'Run gentle cool water for 20 minutes. Cooling stops heat progression into deeper tissue.'
      },
      {
        number: '02',
        title: 'Protect Burn Surface',
        detail: 'Cover with clean, sterile, dry dressing without tight adhesive tapes.'
      },
      {
        number: '03',
        title: 'Prevent Hypothermia',
        detail: 'Cover uninjured parts with dry blankets as large burns cause rapid heat loss.'
      },
      {
        number: '04',
        title: 'Urgent Transfer to Burn Unit',
        detail: 'Transport to District Hospital or Specialized Burn Centre immediately.'
      }
    ],
    whenProfessionalHelpRequired: 'Burns larger than the victim’s palm, burns on face, neck, hands, joints, or groin, electrical/chemical burns, or charred white/black skin.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'poisoning',
    slug: 'poisoning',
    title: 'Poisoning & Chemical Ingestion',
    hindiTitle: 'विषाक्तता / जहरीला पदार्थ निगलना',
    icon: '☠️',
    warningText: 'ACUTE TOXIC EXPOSURE (PESTICIDES, CHEMICALS, DRUGS). DO NOT INDUCE VOMITING.',
    immediateAction: 'Identify the chemical container safely. Do NOT induce vomiting if corrosive chemicals or pesticides are suspected. Call emergency medical team immediately.',
    doList: [
      'Safely preserve the pesticide bottle, medicine wrapper, plant sample, or container to show doctors.',
      'If poison was splashed in eyes or on skin, flush with copious water for 15 minutes and remove contaminated clothes.',
      'If inhaled toxic fumes, move the victim into open fresh air immediately.',
      'Position an unconscious victim in the recovery position on their left side.',
      'Rush to CHC or District Hospital with the container sample.'
    ],
    dontList: [
      'DO NOT induce vomiting (especially for kerosene, acids, alkalis, or petroleum products).',
      'DO NOT give salt water, cow urine, raw eggs, or heavy milk unless explicitly directed by a poison center.',
      'DO NOT attempt neutralizing acids with bases or vice versa.',
      'DO NOT smell or taste unknown containers.'
    ],
    steps: [
      {
        number: '01',
        title: 'Stop Further Exposure',
        detail: 'Move away from toxic gas; wash contaminated skin with soap and running water.'
      },
      {
        number: '02',
        title: 'Secure Product Container',
        detail: 'Place the bottle or blister pack safely in a plastic bag to carry to the emergency room.'
      },
      {
        number: '03',
        title: 'Call Poison Helpline / 108',
        detail: 'Inform doctors about approximate quantity ingested and elapsed time.'
      },
      {
        number: '04',
        title: 'Emergency Medical Care',
        detail: 'Specific antidotes (e.g. Atropine for organophosphate pesticides) must be administered early.'
      }
    ],
    whenProfessionalHelpRequired: 'Always required for any pesticide, plant poison, insecticide, acid, detergent, or medication overdose.',
    emergencyNumber: '108',
    ambulanceHelpline: 'National Poison Information: 1800 116 117'
  },
  {
    id: 'electric-shock',
    slug: 'electric-shock',
    title: 'Electric Shock & Lightning Injury',
    hindiTitle: 'बिजली का झटका / करंट लगना',
    icon: '⚡',
    warningText: 'HIGH RISK OF CARDIAC ARREST AND INTERNAL TISSUE DESTRUCTION.',
    immediateAction: 'DO NOT touch the victim while connected to the power source. Switch off main power or separate with dry wooden stick. Check breathing and start CPR if needed.',
    doList: [
      'Turn off the main electrical supply switch or trip circuit breaker first.',
      'If power cannot be cut, use a dry, non-conductive object (dry wooden broomstick, dry rope) to separate victim from wire.',
      'Stand on a dry wooden board or rubber mat while helping.',
      'Once separated and safe, check responsiveness and breathing.',
      'If not breathing, immediately start chest compressions (CPR).'
    ],
    dontList: [
      'DO NOT touch the person with bare hands or wet items while electricity is still active.',
      'DO NOT approach high-voltage transmission lines (maintain at least 10 meters distance).',
      'DO NOT apply wet compresses to electrical exit wounds before medical check.',
      'DO NOT assume everything is fine because skin marks look small (internal organ burns may exist).'
    ],
    steps: [
      {
        number: '01',
        title: 'Ensure Scene Safety',
        detail: 'Disengage electrical power completely before physical contact.'
      },
      {
        number: '02',
        title: 'Assess Vital Signs',
        detail: 'Check pulse and breathing. Electric currents often trigger ventricular fibrillation (cardiac arrest).'
      },
      {
        number: '03',
        title: 'CPR if Breathing Stops',
        detail: 'Administer uninterrupted CPR compressions until medical personnel take over.'
      },
      {
        number: '04',
        title: 'Treat Entry/Exit Burns',
        detail: 'Cover visible burn spots with dry sterile gauze while heading to hospital.'
      }
    ],
    whenProfessionalHelpRequired: 'All electrical shocks require medical evaluation due to delayed heart arrhythmia risks.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'serious-injury',
    slug: 'serious-injury',
    title: 'Severe Trauma, Road Crash & Spinal Injury',
    hindiTitle: 'गंभीर चोट / सड़क दुर्घटना / रीढ़ की चोट',
    icon: '🤕',
    warningText: 'SUSPECT SPINAL CORD INJURY IN HIGH-SPEED IMPACTS OR FALLS FROM HEIGHT.',
    immediateAction: 'Do NOT move the patient’s head, neck, or spine unless in immediate fire/hazard danger. Stabilize head manually, control bleeding, and call 108.',
    doList: [
      'Keep the neck and back strictly in a straight line without bending or twisting.',
      'Support both sides of the head with folded towels or sandbags to prevent movement.',
      'Control active bleeding with clean direct pressure.',
      'Check if airway is open without tilting the head (use jaw-thrust technique if trained).',
      'Wait for paramedics with spinal board and cervical collar if safe to do so.'
    ],
    dontList: [
      'DO NOT lift or pull an injured person by their arms or legs alone.',
      'DO NOT bend the neck to give water or check behind.',
      'DO NOT remove a motorcycle helmet unless trained and airway is blocked.',
      'DO NOT transport in an auto-rickshaw in a twisted seated posture if spine injury is suspected.'
    ],
    steps: [
      {
        number: '01',
        title: 'Immobilize Head & Neck',
        detail: 'Hold the head steady in the neutral position with both hands.'
      },
      {
        number: '02',
        title: 'Stop Bleeding',
        detail: 'Direct pressure pads on bleeding wounds while avoiding movement of fractures.'
      },
      {
        number: '03',
        title: 'Call Trauma Ambulance',
        detail: 'Inform 108 that a spinal immobilization board is required.'
      },
      {
        number: '04',
        title: 'Log-Roll Transfer if Needed',
        detail: 'If moving is essential due to danger, use at least 4 people to roll the body as a single unified log.'
      }
    ],
    whenProfessionalHelpRequired: 'High-speed collisions, falls from trees/roofs, neck/back pain, numbness/paralysis in limbs, or head trauma with vomiting.',
    emergencyNumber: '108',
    ambulanceHelpline: '108'
  },
  {
    id: 'pregnancy-emergency',
    slug: 'pregnancy-emergency',
    title: 'Obstetric & Pregnancy Emergencies',
    hindiTitle: 'गर्भावस्था आपातकाल / प्रसव जटिलता',
    icon: '🤰',
    warningText: 'DANGER SIGNS IN PREGNANCY REQUIRE URGENT MATERNAL & FETAL CLINICAL CARE.',
    immediateAction: 'Position the pregnant woman on her LEFT side. Check for heavy vaginal bleeding, severe headache, seizures, or umbilical cord prolapse. Rush to First Referral Unit (FRU).',
    doList: [
      'Have the mother lie on her LEFT side to improve blood and oxygen flow to the baby.',
      'Keep mother calm and in a well-ventilated, quiet room.',
      'If umbilical cord is visible before the baby, gently support mother with hips elevated above chest.',
      'Save any expelled clots or pads in a clean bag to show obstetricians.',
      'Call 102/108 Janani Shishu Suraksha Karyakram (JSSK) ambulance immediately.'
    ],
    dontList: [
      'DO NOT allow the mother to lie flat on her back (causes dangerous compression of major blood vessels).',
      'DO NOT pull or push on the umbilical cord or baby during obstructed labor.',
      'DO NOT give local labor-inducing herbal concoctions or unprescribed injections.',
      'DO NOT delay if severe headache with visual flashes occurs (danger sign of eclampsia).'
    ],
    steps: [
      {
        number: '01',
        title: 'Left Lateral Position',
        detail: 'Turn mother onto her left side with pillow between knees.'
      },
      {
        number: '02',
        title: 'Call 102 Maternal Ambulance',
        detail: 'Request urgent transport to the nearest CHC / FRU with Cesarean section capability.'
      },
      {
        number: '03',
        title: 'Monitor Fetal Movement & Bleeding',
        detail: 'Note contractions, blood flow amount, and baby kick patterns.'
      },
      {
        number: '04',
        title: 'Carry Maternal Health Card (MCH)',
        detail: 'Take ANC book, ultrasound reports, and blood group records to hospital.'
      }
    ],
    whenProfessionalHelpRequired: 'Heavy vaginal bleeding, severe headache with blurred vision, high fever, water breaking without labor, fits, or sudden loss of baby movements.',
    emergencyNumber: '102 / 108',
    ambulanceHelpline: '102'
  },
  {
    id: 'child-emergency',
    slug: 'child-emergency',
    title: 'Pediatric Emergencies (Infant & Child)',
    hindiTitle: 'शिशु एवं बाल आपातकाल',
    icon: '👶',
    warningText: 'CHILDREN CAN DETERIORATE RAPIDLY. IMMEDIATE MEDICAL ASSESSMENT IS MANDATORY.',
    immediateAction: 'Look for pediatric danger signs: inability to drink/breastfeed, continuous vomiting, convulsions, chest indrawing, or extreme lethargy.',
    doList: [
      'Keep child warm (skin-to-skin kangaroo care for newborns).',
      'Continue frequent breastfeeding if child is conscious and able to swallow.',
      'If high fever causes febrile shivering, sponge gently with lukewarm (not cold) tap water.',
      'Give Oral Rehydration Solution (ORS) in small sips if dehydration from diarrhea/vomiting is present.',
      'Rush to the nearest pediatric facility or CHC.'
    ],
    dontList: [
      'DO NOT give adult medications or half-tablets without precise pediatric dosages.',
      'DO NOT wrap a burning feverish child in heavy quilts or blankets.',
      'DO NOT use ice-cold water baths for fever (causes severe shivering and temperature spike).',
      'DO NOT withhold breastmilk or water during illness.'
    ],
    steps: [
      {
        number: '01',
        title: 'Check IMNCI Danger Signs',
        detail: 'Can the child drink? Vomiting everything? Having seizures? Lethargic/floppy? Fast breathing?'
      },
      {
        number: '02',
        title: 'Ensure Clear Airway & Warmth',
        detail: 'Wipe excess secretions, keep neck neutral, protect from cold drafts.'
      },
      {
        number: '03',
        title: 'Call 108 Pediatric Support',
        detail: 'Inform emergency operator of child’s exact age and weight if known.'
      },
      {
        number: '04',
        title: 'Transport Safely',
        detail: 'Carry child safely in mother’s arms with head supported and airway open.'
      }
    ],
    whenProfessionalHelpRequired: 'Difficulty breathing, blue lips, severe diarrhea with sunken eyes, refusal to feed, floppy body, or unexplained purplish rash.',
    emergencyNumber: '108',
    ambulanceHelpline: '108 / 102'
  }
];
