import { HealthGuideArticle } from '../types/health';

export const HEALTH_GUIDES: HealthGuideArticle[] = [
  {
    id: 'understanding-warning-signs',
    slug: 'understanding-warning-signs',
    title: 'How to Recognize Life-Threatening Emergency Signs',
    category: 'Emergency Signs',
    icon: '🚨',
    excerpt: 'A practical, easy-to-remember guide on spotting danger signs in family members before it is too late.',
    readTime: '3 min read',
    keyPoints: [
      'Breathing distress is always an urgent priority over mild fever or stomach ache.',
      'Sudden loss of speech, facial weakness, or arm weakness is a medical emergency.',
      'Unconsciousness lasting more than 60 seconds requires immediate hospital evaluation.'
    ],
    fullContent: [
      'In rural and remote villages, knowing when an illness is standard and when it has transformed into a critical emergency saves lives. You do not need to be a doctor to recognize life-threatening danger signals.',
      'The three most crucial bodily systems to watch are: (1) Airway and Breathing, (2) Brain and Consciousness, and (3) Heart and Circulation.',
      'If a person cannot speak full sentences without gasping, their lips turn bluish, or their chest visibly sucks in between their ribs, their lungs are failing. This cannot be treated at home.',
      'For neurological warning signs, remember the F.A.S.T rule: Face drooping, Arm drifting downward, Slurred speech, and Time to rush to a hospital equipped with a CT scan.',
      'Always keep local ambulance numbers (108/102) and your local ASHA/ANM contact saved on speed-dial.'
    ]
  },
  {
    id: 'first-aid-basics-rural',
    slug: 'first-aid-basics-rural',
    title: 'Essential First Aid in Low-Resource Settings',
    category: 'First Aid',
    icon: '🩹',
    excerpt: 'Key do’s and don’ts for handling wounds, fractures, and accidental burns with safe everyday household materials.',
    readTime: '4 min read',
    keyPoints: [
      'Direct pressure with a clean cloth stops over 90% of bleeds.',
      'Water is the only safe first-response agent for fresh thermal burns.',
      'Never give water or food to a person who is drowsy or unconscious.'
    ],
    fullContent: [
      'First aid is what happens in the crucial minutes between injury and arrival at a healthcare centre. In rural communities where the nearest hospital may be 20 kilometers away, safe first aid prevents death and long-term disability.',
      'Wounds & Bleeding: Find the cleanest cloth available. Press firmly right on top of the wound. Hold it for at least 10 straight minutes without lifting. If blood soaks through, add another cloth on top.',
      'Fractures & Sprains: If a limb looks bent or causes screaming pain upon touch, immobilize it. Use a straight wooden stick or folded cardboard wrapped in cloth to splint it before transporting the patient.',
      'Burns: Run ordinary clean water over the burn for 15 full minutes. Never put cow dung, mud, toothpaste, or engine oil on a burn. These introduce severe infections that lead to sepsis and scarring.',
      'Always transport patients in a stable, well-supported posture.'
    ]
  },
  {
    id: 'maternal-danger-signs',
    slug: 'maternal-danger-signs',
    title: 'Maternal Health & Pregnancy Red Flags',
    category: 'Maternal Health',
    icon: '🤰',
    excerpt: 'Critical danger signs during pregnancy, delivery, and postpartum that require immediate hospital care.',
    readTime: '4 min read',
    keyPoints: [
      'Vaginal bleeding at any stage of pregnancy is abnormal and dangerous.',
      'Severe headache with blurred vision indicates pre-eclampsia / eclampsia.',
      'Always deliver at an accredited healthcare institution (PHC/CHC/Hospital).'
    ],
    fullContent: [
      'Pregnancy is a natural journey, but sudden complications can threaten both mother and unborn child. Timely recognition of danger signs ensures safe motherhood.',
      'Key Warning Signs during pregnancy include: (1) Any amount of vaginal bleeding, (2) Swelling of hands and face accompanied by severe headaches, (3) High fever, (4) Foul-smelling vaginal discharge, and (5) Decreased or absent baby movements after the 6th month.',
      'If the pregnant mother has seizures or fits, turn her onto her left side immediately and call the 102/108 ambulance. This is eclampsia and requires specialized medical intervention.',
      'Make sure the Mother and Child Protection (MCP) card is kept ready with all ANC checkup records and blood group information.',
      'Government schemes like JSSK (Janani Shishu Suraksha Karyakram) guarantee free transport, free medicines, and free hospital delivery for all mothers.'
    ]
  },
  {
    id: 'ors-and-child-diarrhea',
    slug: 'ors-and-child-diarrhea',
    title: 'Protecting Children from Dehydration & Diarrhea',
    category: 'Child Health',
    icon: '👶',
    excerpt: 'How Oral Rehydration Salts (ORS) and Zinc save infants and young children from deadly dehydration.',
    readTime: '3 min read',
    keyPoints: [
      'Dehydration, not loose motion itself, is the primary danger in child diarrhea.',
      'ORS replaces lost water and vital salts; Zinc tablets accelerate gut recovery.',
      'Never stop breastfeeding an ill or diarrheic infant.'
    ],
    fullContent: [
      'Childhood diarrhea remains one of the leading causes of illness in young children. When a child passes frequent watery stools, their tiny body loses water and essential minerals at a rapid pace.',
      'How to make ORS: Take 1 standard packet of WHO-ORS. Dissolve the entire packet in exactly 1 liter of clean boiled and cooled water. Mix thoroughly. Give small spoonfuls or sips after every loose stool.',
      'Give dispersible Zinc tablets for 14 days as advised by your ASHA worker or doctor, even if diarrhea stops earlier.',
      'Signs of severe dehydration: Sunken eyes, very dry tongue, child is unusually sleepy or floppy, skin pinch on belly takes long to go flat, or no urine for 6 hours.',
      'If any of these signs appear, take the child to the nearest Primary Health Centre immediately.'
    ]
  },
  {
    id: 'clean-water-sanitation',
    slug: 'clean-water-sanitation',
    title: 'Safe Water, Sanitation & Seasonal Fever Prevention',
    category: 'Prevention',
    icon: '💧',
    excerpt: 'Practical steps to prevent water-borne illnesses, dengue, malaria, and typhoid in your home and village.',
    readTime: '3 min read',
    keyPoints: [
      'Boiling drinking water vigorously for 1 minute kills virtually all harmful pathogens.',
      'Prevent stagnant water in open tyres, buckets, and coolers to stop mosquito breeding.',
      'Wash hands with soap before preparing meals and after using the toilet.'
    ],
    fullContent: [
      'Most monsoon and seasonal fevers spread through two main pathways: contaminated drinking water and mosquito bites.',
      'Water Purification: Even clear-looking well or river water can carry dangerous bacteria and viruses. Boiling water until it rolls with big bubbles for at least one full minute is the most dependable purification method.',
      'Vector Control: Dengue mosquitoes breed in clean, standing water (coconut shells, flower pots, coolers). Empty and scrub standing water containers once a week. Malaria mosquitoes breed in puddles and slow drains.',
      'Use insecticide-treated mosquito nets (ITNs) while sleeping, especially for children and pregnant women.',
      'Keep food covered to prevent contamination by houseflies and dust.'
    ]
  },
  {
    id: 'nutrition-rural-health',
    slug: 'nutrition-rural-health',
    title: 'Nutritious Everyday Foods for Stronger Immunity',
    category: 'Nutrition',
    icon: '🥗',
    excerpt: 'Affordable, locally available foods that prevent anemia, boost energy, and keep families healthy.',
    readTime: '3 min read',
    keyPoints: [
      'Iron-rich local greens (palak, methi, moringa/drumstick leaves) combat widespread anemia.',
      'Combining pulses (dal) with grains (rice/roti) provides complete protein.',
      'Local seasonal fruits (amla, guava, papaya) provide abundant Vitamin C and immunity.'
    ],
    fullContent: [
      'Good health does not require expensive packaged food. Traditional local foods provide balanced nutrition when selected thoughtfully.',
      'Fighting Anemia: Anemia causes fatigue, dizziness, and maternal complications. Include dark green leafy vegetables, drumstick leaves, jaggery (gud), roasted chana, and sprouted pulses regularly.',
      'Proteins for Growth: Children require protein for brain and physical development. Moong dal, lentils, eggs, milk, peanuts, and sattu are excellent, accessible protein sources.',
      'Vitamin C Power: Vitamin C helps your body absorb iron from food. Eating an amla or a slice of lemon with your regular dal-roti meal doubles iron absorption.',
      'Avoid giving children packaged artificial snacks, colorful deep-fried crisps, and sugary drinks.'
    ]
  }
];
