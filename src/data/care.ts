import { CareTopic } from '../types/health';

export const CARE_TOPICS: CareTopic[] = [
  {
    id: 'fever',
    slug: 'fever',
    title: 'Fever & High Body Temperature',
    category: 'General Supportive Care',
    icon: '🌡️',
    summary: 'Supportive guidance for managing mild to moderate fevers safely at home while arranging clinical review.',
    whatMayHelp: [
      'Drink plenty of clean, safe fluids (boiled water, clear broths, fresh coconut water, thin dal soup).',
      'Wear lightweight, breathable cotton clothing to allow body heat to dissipate naturally.',
      'Sponge the forehead, neck, and limbs with lukewarm (not cold) tap water if body temperature is high.',
      'Rest completely in a well-ventilated, shaded room away from direct burning sun.',
      'Take standard Paracetamol only in age-appropriate recommended doses if advised by a pharmacist or health worker.'
    ],
    whatToAvoid: [
      'DO NOT use ice-cold water baths or alcohol rubs (these cause dangerous shivering and sudden blood pressure spikes).',
      'DO NOT wrap the patient in heavy quilts, woolen sweaters, or thick blankets.',
      'DO NOT take random antibiotics, steroids, or multiple combination fever tablets without prescription.',
      'DO NOT skip drinking water due to lack of thirst (dehydration significantly worsens fever).'
    ],
    whenToSeeDoctor: [
      'Fever exceeds 102°F (38.9°C) and does not come down with simple measures.',
      'Fever lasts more than 3 consecutive days.',
      'Fever is accompanied by a stiff neck, persistent vomiting, or severe confusion.'
    ],
    warningSigns: [
      'Seizures or fits during fever (especially in infants and young children)',
      'Difficulty breathing or rapid panting',
      'Unexplained purplish red pinpoint spots or dark rash on skin',
      'Inability to wake up or extreme drowsiness'
    ]
  },
  {
    id: 'cold-cough',
    slug: 'cold-cough',
    title: 'Common Cold, Sore Throat & Cough',
    category: 'Respiratory Care',
    icon: '😮‍💨',
    summary: 'Safe, soothing measures for upper respiratory irritation and mild seasonal coughs.',
    whatMayHelp: [
      'Gargle with warm salt water (1/2 teaspoon salt in a glass of warm water) 3–4 times daily for throat relief.',
      'Drink warm water, herbal tulsi/ginger decoctions, or warm water with a teaspoon of honey (for children over 1 year).',
      'Inhale gentle warm water steam to loosen nasal congestion and relieve dry airways.',
      'Keep head slightly elevated on an extra pillow while sleeping to reduce nighttime coughing.',
      'Wash hands regularly with soap and water to avoid infecting household members.'
    ],
    whatToAvoid: [
      'DO NOT give honey to infants under 12 months of age (risk of infant botulism).',
      'DO NOT take leftover antibiotics from previous illnesses — colds and flus are viral.',
      'DO NOT use heavy chemical vapor rubs directly inside nostrils or on infants’ chests.',
      'DO NOT expose throat to dusty, smoky chulha air or cigarette smoke.'
    ],
    whenToSeeDoctor: [
      'Cough lasts for more than 2 weeks (requires tuberculosis and chest evaluation).',
      'Coughing up yellowish/greenish thick phlegm or blood-tinged sputum.',
      'Persistent sharp pain in the chest while coughing or taking a deep breath.'
    ],
    warningSigns: [
      'Struggling to draw breath or wheezing sounds from chest',
      'Blue discoloration of fingernails or lips',
      'Inability to speak sentences without catching breath'
    ]
  },
  {
    id: 'mild-headache',
    slug: 'mild-headache',
    title: 'Mild Headache & Tension',
    category: 'Neurological Care',
    icon: '🤕',
    summary: 'Supportive care for common tension, eye-strain, and dehydration-related headaches.',
    whatMayHelp: [
      'Drink 2–3 glasses of water slowly (mild dehydration is one of the most frequent headache triggers).',
      'Rest in a quiet, darkened, cool room with eyes closed.',
      'Apply a cool, damp cloth gently across the forehead or back of the neck.',
      'Gently massage the temples, neck muscles, and shoulders to relieve muscular tension.',
      'Ensure adequate regular meals if the headache was triggered by missing food.'
    ],
    whatToAvoid: [
      'DO NOT stare at bright phone screens or work under flickering harsh lights.',
      'DO NOT consume excessive tea, coffee, or tobacco in an attempt to suppress the headache.',
      'DO NOT take strong painkillers on an empty stomach.',
      'DO NOT ignore sudden severe headaches described as "the worst headache of your life".'
    ],
    whenToSeeDoctor: [
      'Headache develops after a fall, vehicle crash, or blow to the head.',
      'Headaches occur repeatedly every week with nausea and visual disturbances.',
      'Headache is accompanied by fever and an inability to bend the chin to the chest (neck stiffness).'
    ],
    warningSigns: [
      'Sudden explosive "thunderclap" headache within seconds',
      'Associated weakness in one arm, leg, or facial droop',
      'Confusion, memory lapse, or speech difficulty'
    ]
  },
  {
    id: 'stomach-discomfort',
    slug: 'stomach-discomfort',
    title: 'Mild Stomach Discomfort & Gas',
    category: 'Digestive Care',
    icon: '⚡',
    summary: 'Gentle dietary support for mild indigestion, bloating, and non-severe stomach upset.',
    whatMayHelp: [
      'Eat light, easily digestible meals: boiled rice with curd, light moong dal khichdi, or stewed apples.',
      'Sip warm cumin (jeera) water or warm water with a pinch of hing (asafoetida) for gas relief.',
      'Drink plenty of clean fluids in small, frequent sips throughout the day.',
      'Walk gently after meals rather than immediately lying down flat on the stomach.',
      'Allow the stomach to rest by avoiding heavy, fried, or highly spiced foods for 24–48 hours.'
    ],
    whatToAvoid: [
      'DO NOT eat oily, deep-fried street foods, spicy masalas, or heavily processed snacks.',
      'DO NOT take strong pain relief pills (like Ibuprofen/Diclofenac) for stomach pain (can cause stomach ulcers).',
      'DO NOT consume unboiled tap water or raw, unwashed street salads.',
      'DO NOT take antacids continuously for days without seeking medical guidance.'
    ],
    whenToSeeDoctor: [
      'Severe cramping or sharp localized pain in the lower right side of the abdomen.',
      'Stomach pain accompanied by persistent vomiting or inability to keep water down for 12 hours.',
      'Blood present in vomit (looks like coffee grounds) or dark black tarry stools.'
    ],
    warningSigns: [
      'Abdomen feels rigid, rock-hard, or extremely tender to light touch',
      'High fever accompanied by severe abdominal swelling',
      'Dizziness, fainting, or clammy cold skin'
    ]
  },
  {
    id: 'minor-cuts',
    slug: 'minor-cuts',
    title: 'Minor Cuts, Scrapes & Grazes',
    category: 'Wound Care',
    icon: '🩹',
    summary: 'Safe hygiene steps for small skin abrasions, superficial cuts, and minor scrapes.',
    whatMayHelp: [
      'Wash hands thoroughly with soap and clean water before touching the wound.',
      'Rinse the cut under clean, cool running water to flush out dirt and grit gently.',
      'Wash gently around the wound with mild soap (avoid getting strong soap directly inside the cut).',
      'Apply light direct pressure with a clean cloth or sterile gauze for 2–3 minutes to stop minor oozing.',
      'Cover with a clean adhesive bandage or sterile dry gauze to protect from dust and flies.'
    ],
    whatToAvoid: [
      'DO NOT apply cow dung, soil, cigarette ash, or turmeric powder into deep open wounds.',
      'DO NOT pick at scabs as they form (scabs are natural protective barriers during healing).',
      'DO NOT use harsh chemical concentrates (like undiluted hydrogen peroxide or spirit) which damage healing skin tissue.',
      'DO NOT leave wounds uncovered in dusty, farm, or animal-rearing environments.'
    ],
    whenToSeeDoctor: [
      'The cut is deep, gaping, or edges do not come together naturally (may need stitches).',
      'The injury was caused by a dirty, rusty nail or animal bite (requires Tetanus / Rabies shot).',
      'Redness, throbbing warmth, swelling, or yellowish pus develops after 24–48 hours.'
    ],
    warningSigns: [
      'Pulsing bright red blood that will not stop after 10 minutes of pressure',
      'Red streaks spreading from the wound upward toward the heart',
      'Fever developing a day or two after a dirty puncture wound'
    ]
  },
  {
    id: 'minor-burns',
    slug: 'minor-burns',
    title: 'Minor First-Degree Burns & Scalds',
    category: 'Wound Care',
    icon: '🔥',
    summary: 'First-aid care for small, superficial burns that affect only the topmost layer of skin (redness without large blisters).',
    whatMayHelp: [
      'Hold the burned skin under gentle, cool running tap water immediately for 10 to 15 minutes.',
      'Remove tight rings, wristbands, or loose clothing near the burn before slight swelling starts.',
      'Apply pure medical petroleum jelly (Vaseline) or pure aloe vera gel gently after the skin has completely cooled.',
      'Cover loosely with a sterile, non-stick gauze pad to shield from air and dust.',
      'Keep the area clean and wash very gently with plain water daily.'
    ],
    whatToAvoid: [
      'DO NOT apply ice cubes, ice packs, toothpaste, butter, mustard oil, or flour onto the burn.',
      'DO NOT pop or puncture small blister bubbles if they appear (blister skin prevents infection).',
      'DO NOT apply fluffy raw cotton directly on raw skin (cotton fibers stick to the wound).',
      'DO NOT forcefully pull off clothing that is stuck to burnt skin.'
    ],
    whenToSeeDoctor: [
      'Burn is larger than 3 inches in diameter or covers a significant portion of a hand, foot, or joint.',
      'Burn appears leathery, white, or charred black (indicates deep third-degree burn).',
      'Burn involves the face, eyes, groin, or major joints.'
    ],
    warningSigns: [
      'Signs of infection: spreading red border, increasing pain, foul-smelling yellowish discharge',
      'Burn caused by chemical acids, high-voltage electricity, or explosion',
      'The victim is an infant or elderly person'
    ]
  },
  {
    id: 'dehydration',
    slug: 'dehydration',
    title: 'Dehydration & Heat Exhaustion',
    category: 'General Supportive Care',
    icon: '💧',
    summary: 'Supportive fluid and electrolyte management for dehydration caused by hot weather, sweating, or mild diarrhea.',
    whatMayHelp: [
      'Drink Oral Rehydration Solution (ORS): Dissolve 1 standard WHO-ORS packet in exactly 1 liter of clean drinking water and drink regularly.',
      'If ORS is not immediately available, prepare homemade electrolyte drink: 6 level teaspoons sugar + 1/2 level teaspoon salt in 1 liter clean water.',
      'Drink fresh tender coconut water, buttermilk (chaas with a pinch of roasted jeera and salt), or thin rice kanji.',
      'Move immediately to a shaded, cool, well-ventilated area or under a fan/tree.',
      'Lie down and slightly elevate the feet to encourage blood circulation to the brain.'
    ],
    whatToAvoid: [
      'DO NOT drink sugary commercial sodas, strong alcohol, or excessive black tea/coffee (these worsen fluid loss).',
      'DO NOT gulp huge quantities of plain water all at once if severely dehydrated (sip steadily instead).',
      'DO NOT continue heavy farm work or walking long distances in the peak afternoon sun (12 PM – 4 PM).',
      'DO NOT give oral fluids to someone who is drowsy, confused, or vomiting uncontrollably.'
    ],
    whenToSeeDoctor: [
      'Diarrhea or vomiting prevents retaining any fluids for more than 12 hours.',
      'Urine is very dark amber or no urine passed for over 6–8 hours.',
      'Extreme dry mouth, sunken eyes, and skin pinch on abdomen goes back very slowly.'
    ],
    warningSigns: [
      'Sunken soft spot (fontanelle) in infants with no tears while crying',
      'Confusion, disorientation, extreme dizziness, or fainting',
      'High body temperature above 104°F with dry, hot skin without sweating (heat stroke emergency)'
    ]
  },
  {
    id: 'muscle-pain',
    slug: 'muscle-pain',
    title: 'Muscle Aches, Sprains & Strains',
    category: 'Orthopedic Care',
    icon: '💪',
    summary: 'Supportive care using the R.I.C.E principle for minor physical fatigue, muscle sprains, and joint strains.',
    whatMayHelp: [
      'Rest the injured or aching muscle/joint; avoid bearing heavy loads or intense exertion.',
      'Apply an ice pack wrapped in a clean towel for 15–20 minutes at a time (never apply bare ice directly to skin).',
      'Apply light compression with an elastic crepe bandage to support the joint without making it uncomfortably tight.',
      'Elevate the injured limb above heart level whenever resting on a cot or chair.',
      'After 48 hours, switch to gentle warm compresses or warm water soaks to relax tight muscle fibers.'
    ],
    whatToAvoid: [
      'DO NOT perform vigorous bone-setting, hard cracking, or aggressive massage on freshly swollen joints.',
      'DO NOT apply hot packs during the first 24–48 hours of an acute sprain (heat increases swelling and internal bleeding).',
      'DO NOT continue running or lifting heavy sacks on an unstable, painful joint.',
      'DO NOT tie bandages so tightly that fingers or toes turn cold, numb, or bluish.'
    ],
    whenToSeeDoctor: [
      'Inability to bear any weight on the injured leg or foot.',
      'The bone or joint looks visibly crooked, misshapen, or out of place.',
      'Severe numbness, tingling, or loss of sensation below the injured area.'
    ],
    warningSigns: [
      'Audible "pop" or snap sound accompanied by immediate severe deformity and swelling',
      'Open skin with protruding bone fragment (compound fracture emergency)',
      'Severe coldness or absence of pulse in the foot/hand below the injury'
    ]
  }
];
