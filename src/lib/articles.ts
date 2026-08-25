export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  date: string;
};

// Category used for controlled-substance safety content. Articles in this
// category skip the "Shop Related Products" CTA (see blog/[slug]/page.tsx) —
// this content is informational, not a purchase funnel.
export const SAFETY_CATEGORY = 'Medication Safety';

export const ARTICLES: Article[] = [
  {
    slug: 'cold-vs-flu-vs-allergies',
    title: 'Cold vs. Flu vs. Allergies: How to Tell Them Apart',
    category: 'Cold & Flu',
    date: '2026-01-12',
    excerpt: 'Same runny nose, three different causes. Here’s how to tell a cold, the flu, and seasonal allergies apart so you reach for the right relief.',
    body: [
      'Colds, flu, and allergies can all start with a stuffy nose and a scratchy throat, which is why so many people reach for the wrong remedy. The fastest way to tell them apart is speed of onset and the presence of fever.',
      'Colds build gradually over a day or two, rarely cause a high fever in adults, and usually clear up within seven to ten days. Flu symptoms hit hard and fast — often within hours — and commonly include a fever above 100.4°F, body aches, and fatigue that colds don’t typically cause.',
      'Allergies are the outlier: no fever, ever. Look for itchy or watery eyes and symptoms that flare in specific settings (spring pollen, a dusty attic, a friend’s cat) and can last for weeks as long as you’re exposed to the trigger.',
      'A simple rule of thumb: fever points toward flu, itchy eyes point toward allergies, and everything in between — mild, gradual, no fever — is probably a common cold. If symptoms are severe, don’t improve after 10 days, or you’re in a high-risk group, check in with a healthcare provider rather than self-treating indefinitely.',
    ],
  },
  {
    slug: 'otc-pain-relief-nsaids-vs-acetaminophen',
    title: 'NSAIDs vs. Acetaminophen: Which OTC Pain Reliever Should You Choose?',
    category: 'Pain Relief',
    date: '2026-01-19',
    excerpt: 'Ibuprofen and acetaminophen aren’t interchangeable. Here’s the practical difference and how to pick the right one for your symptoms.',
    body: [
      'Ibuprofen and naproxen are NSAIDs (nonsteroidal anti-inflammatory drugs) — they reduce pain and inflammation together, which makes them a good fit for muscle strains, menstrual cramps, and joint pain.',
      'Acetaminophen (Tylenol) relieves pain and fever but doesn’t reduce inflammation. It’s often the better choice if you have a sensitive stomach, are on blood thinners, or have certain conditions where NSAIDs aren’t recommended.',
      'The most important safety rule: don’t exceed the labeled maximum daily dose of either, and check every other medication you’re taking (including cold and flu combination products) for acetaminophen or ibuprofen you might be double-dosing without realizing it.',
      'If over-the-counter doses aren’t controlling your pain after a few days, or the pain is severe or accompanied by other symptoms, that’s a sign to talk to a healthcare provider rather than simply taking more.',
    ],
  },
  {
    slug: 'otc-allergy-relief-without-prescription',
    title: 'Can You Get Allergy Relief Without a Prescription?',
    category: 'Allergy & Hayfever',
    date: '2026-01-26',
    excerpt: 'Most seasonal allergy symptoms respond well to over-the-counter antihistamines. Here’s what’s available without a prescription and when to see a doctor.',
    body: [
      'Yes — most mild-to-moderate seasonal allergy symptoms (sneezing, itchy eyes, runny nose) respond well to over-the-counter second-generation antihistamines like loratadine, cetirizine, and fexofenadine, all of which are non-prescription in the US.',
      'These are generally preferred over older first-generation antihistamines (like diphenhydramine) for daytime use, since they cause far less drowsiness for most people.',
      'Nasal congestion specifically often responds better to a steroid nasal spray (also available OTC) than an oral antihistamine alone — the two work through different mechanisms and can be used together.',
      'See a healthcare provider if OTC options aren’t controlling your symptoms, if you experience wheezing or shortness of breath, or if you want to explore allergy testing to identify and reduce your specific triggers.',
    ],
  },
  {
    slug: 'what-does-non-drowsy-mean',
    title: 'What Does "Non-Drowsy" Actually Mean on Allergy Medication?',
    category: 'Allergy & Hayfever',
    date: '2026-02-02',
    excerpt: 'The "non-drowsy" label isn’t a guarantee — here’s what it actually refers to and why some people still feel sleepy.',
    body: [
      '"Non-drowsy" on an allergy medication label almost always refers to second-generation antihistamines (loratadine, cetirizine, fexofenadine), which cross into the brain far less than older antihistamines like diphenhydramine.',
      'It’s a population-level claim, not a guarantee for every individual. A meaningful minority of people still report some drowsiness on cetirizine in particular, even though it’s labeled non-drowsy.',
      'Combination products (labeled "allergy + sinus" or with a "D" suffix, like a decongestant combo) can also affect alertness differently — the decongestant component can be stimulating for some people and disruptive to sleep if taken late in the day.',
      'If a "non-drowsy" product is making you sleepy, it doesn’t mean you’re doing something wrong — it just means your body responds differently, and it’s reasonable to try a different antihistamine in the same class or talk to a pharmacist about alternatives.',
    ],
  },
  {
    slug: 'vitamin-d-and-immunity',
    title: 'Vitamin D and Immunity: What the Evidence Actually Shows',
    category: 'Vitamins & Supplements',
    date: '2026-02-09',
    excerpt: 'Vitamin D gets credited with a lot. Here’s a grounded look at what the research actually supports for immune health.',
    body: [
      'Vitamin D plays a real, well-established role in immune regulation — cells throughout the immune system have vitamin D receptors, and deficiency is linked to a higher risk of respiratory infections.',
      'The strongest evidence for supplementation is in people who are actually deficient. Clinical trials show the clearest benefit (modestly reduced risk of acute respiratory infections) in people with low baseline vitamin D levels, not in people who are already replete.',
      'That means supplementing "just in case" when your levels are already normal is unlikely to provide the same benefit — vitamin D isn’t a general-purpose immune booster in the way it’s sometimes marketed.',
      'If you suspect you’re deficient (limited sun exposure, certain diets, darker skin in northern latitudes, older age), a blood test can confirm it, and a healthcare provider can recommend an appropriate dose rather than guessing.',
    ],
  },
  {
    slug: 'how-to-read-a-drug-facts-label',
    title: 'How to Read a Drug Facts Label: A Plain-English Guide',
    category: 'Pharmacy Basics',
    date: '2026-02-16',
    excerpt: 'Every OTC product has the same label format by law. Here’s what each section actually means.',
    body: [
      'US law requires all OTC drug labels to follow the same "Drug Facts" format, so once you know how to read one, you can read them all — the sections always appear in the same order.',
      '"Active ingredient(s)" lists what actually treats your symptoms and at what strength. "Purpose" tells you what each active ingredient is for (e.g. "pain reliever," "antihistamine"), which matters most in combination products with several active ingredients.',
      '"Uses" and "Warnings" are the two sections worth reading closely every time — Warnings covers who shouldn’t take the product, drug interactions, and when to stop use and contact a doctor. This is where you’ll catch overlaps with other medications you’re taking.',
      '"Directions" gives the dose and how often — pay attention to age-specific dosing and maximum doses in 24 hours. "Inactive ingredients" lists everything else (fillers, dyes, flavoring), which matters if you have allergies to specific substances.',
    ],
  },
  {
    slug: 'ointment-vs-cream-difference',
    title: 'Ointment vs. Cream: What’s Actually the Difference?',
    category: 'Skin & Dermatology',
    date: '2026-02-23',
    excerpt: 'The same medication is often sold as both a cream and an ointment. Here’s how to pick the right one for your skin.',
    body: [
      'The difference comes down to the base, not usually the medication itself. Ointments are oil-based (often petroleum-based), while creams are a mix of oil and water — that changes how each behaves on skin.',
      'Ointments are more occlusive, meaning they form a stronger barrier that locks in moisture. That makes them well suited to very dry, cracked, or scaling skin, but they can feel greasy and aren’t ideal for hairy areas or hot, humid climates.',
      'Creams absorb faster, feel lighter, and are generally more cosmetically acceptable for daytime use or larger body areas — but they don’t lock in moisture as effectively as ointments.',
      'As a rule of thumb: for very dry or weeping skin, ointments tend to work better; for general daily use or the face, creams are usually more comfortable. If you’re not sure which formulation fits your skin condition, a pharmacist can point you to the right option.',
    ],
  },
  {
    slug: 'glp-1-vs-insulin-diabetes-care',
    title: 'GLP-1 vs. Insulin: Understanding the Difference in Diabetes Care',
    category: 'Diabetes & Metabolic Health',
    date: '2026-03-02',
    excerpt: 'GLP-1 medications and insulin are both used in diabetes care but work in very different ways. Here’s a clear breakdown.',
    body: [
      'Insulin is a hormone your body needs to move glucose out of the bloodstream and into cells. In diabetes care, injectable insulin directly replaces or supplements what the body isn’t producing or using effectively.',
      'GLP-1 receptor agonists work differently: they mimic a gut hormone that stimulates the body’s own insulin release (only when blood sugar is elevated), slow digestion, and reduce appetite — which is why this drug class is also associated with weight loss.',
      'Because GLP-1s rely on the body still being able to produce some insulin, they’re primarily used in type 2 diabetes, not type 1, where the body produces little to no insulin of its own.',
      'The two are sometimes used together in type 2 diabetes when one medication alone isn’t enough to manage blood sugar. Which approach — or combination — is right depends on individual factors like diabetes type, other health conditions, and treatment goals, which is a conversation for your prescribing doctor, not something to decide from an article.',
    ],
  },
  {
    slug: 'why-codeine-is-prescription-only',
    title: 'Why Codeine and Other Opioid Cough Medicines Are Prescription-Only',
    category: SAFETY_CATEGORY,
    date: '2026-07-27',
    excerpt: 'Codeine isn’t a regular cough suppressant — it’s an opioid. Here’s what that means for how it’s regulated and the risks worth understanding.',
    body: [
      'Codeine is an opioid, chemically related to morphine, and your liver converts a portion of it into morphine as it’s metabolized. That’s part of why it works as a cough suppressant and mild pain reliever, and also why it’s regulated far more tightly than an over-the-counter option like dextromethorphan.',
      '## Why every formulation requires a prescription\nIn the United States, codeine is a Schedule II–V controlled substance depending on the specific formulation and what it’s combined with. There is no legitimate over-the-counter codeine product sold through US pharmacies, regardless of what a website or search result might claim.\n- Even taken exactly as prescribed, codeine can cause physical dependence within days to weeks of regular use.\n- Combined with alcohol, benzodiazepines, or other opioids, it can slow or stop breathing — the mechanism behind most opioid overdose deaths.\n- People metabolize codeine at different rates. A small percentage are “ultra-rapid metabolizers” who convert it to morphine unusually fast, which has caused serious harm at doses that are safe for most people — part of why codeine is specifically avoided in children after surgery.',
      '## Signs it’s time to talk to a doctor or pharmacist\nNeeding a cough suppressant to work for longer than a week, needing more than the prescribed dose for the same effect, or feeling anxious about running out are all worth raising with a healthcare provider rather than managing alone. Dependence can develop even in people who never intended to misuse the medication — it isn’t a reflection of willpower.',
      'If you or someone you know is using codeine, alone or as part of a cough syrup, outside of how it was prescribed, or is having trouble stopping, the SAMHSA National Helpline (1-800-662-4357) is free, confidential, and available 24/7 for referrals to local treatment.',
    ],
  },
  {
    slug: 'xanax-benzodiazepines-what-to-know',
    title: 'Xanax and Other Benzodiazepines: What They Treat, and Why You Never Stop Them Abruptly',
    category: SAFETY_CATEGORY,
    date: '2026-08-03',
    excerpt: 'Xanax and other benzodiazepines are effective for anxiety and panic disorders, but stopping them suddenly can be more dangerous than the condition they treat.',
    body: [
      'Xanax (alprazolam) belongs to a class of medications called benzodiazepines, which also includes drugs like Ativan (lorazepam), Klonopin (clonazepam), and Valium (diazepam). They work by enhancing the effect of GABA, a calming neurotransmitter in the brain, which is why they’re effective for anxiety disorders, panic disorder, and short-term insomnia.',
      '## Why they’re Schedule IV controlled substances\nBenzodiazepines carry a real risk of physical dependence, tolerance, and misuse potential — which is why they’re prescription-only and classified as controlled substances in the US. They’re generally prescribed for the shortest effective duration rather than as an indefinite daily medication.',
      '## The most important safety fact: never stop suddenly\nStopping a benzodiazepine abruptly after regular use — even just a few weeks — can trigger a withdrawal syndrome that includes rebound anxiety, tremor, and in more severe cases, seizures. This is one of the reasons benzodiazepine withdrawal can be more medically dangerous than withdrawal from some other drug classes.\n- Never stop or reduce your dose without medical guidance, even if you feel like you no longer need it.\n- A prescriber will typically taper the dose gradually over weeks, not stop it in one step.\n- Mixing benzodiazepines with opioids, alcohol, or other sedatives significantly increases the risk of dangerous breathing suppression — the FDA carries a boxed warning specifically about combining benzodiazepines with opioids.',
      'If you’re taking a benzodiazepine and want to stop, or you’re worried about dependence, talk to the prescriber rather than stopping on your own. If you’re in a mental health crisis, the 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7, and the SAMHSA National Helpline (1-800-662-4357) can connect you to local treatment for dependence.',
    ],
  },
  {
    slug: 'truth-about-lean-promethazine-codeine',
    title: 'The Truth About "Lean": Why Mixing Promethazine and Codeine Is Life-Threatening',
    category: SAFETY_CATEGORY,
    date: '2026-08-10',
    excerpt: '“Lean” or “purple drank” — promethazine-codeine syrup mixed with soda — has been popularized in music culture, but the combination carries serious, sometimes fatal risk.',
    body: [
      '“Lean” (also called “purple drank” or “sizzurp”) refers to promethazine-codeine cough syrup mixed with a soft drink and sometimes hard candy, taken in amounts and a context far outside how the medication is prescribed. It’s been referenced and glamorized in music and popular culture for years, which has made it seem more casual and less dangerous than it actually is.',
      '## Why the combination is especially dangerous\nPromethazine and codeine are both central nervous system depressants on their own, and combining them compounds the risk rather than simply adding to it.\n- Codeine, an opioid, can suppress breathing at high doses — the leading cause of death in opioid overdose.\n- Promethazine adds sedation on top of that, and in higher amounts carries its own risk of dangerous heart rhythm changes (QT prolongation) and, rarely, severe tissue injury if misused by injection.\n- Because “lean” is typically consumed in volumes and concentrations far beyond a prescribed dose, and often alongside alcohol, the combined depressant effect on breathing and heart rhythm is what makes it capable of causing death, including in otherwise healthy young people.',
      'This isn’t a matter of an occasional recreational choice being roughly as risky as alcohol. Prescription promethazine-codeine syrup is dosed in single-digit milliliters for genuine medical need; “lean” preparations commonly involve multiples of that amount, repeated over hours, which is a fundamentally different risk profile than what the prescribing information accounts for.',
      'If you or someone you know is using promethazine-codeine syrup outside of a prescription, this is worth treating as seriously as any other opioid use — the SAMHSA National Helpline (1-800-662-4357) is free, confidential, and available 24/7. In a suspected overdose (slow or stopped breathing, unresponsiveness, blue lips), call 911 immediately — naloxone can reverse the opioid component of an overdose, but emergency care is still necessary.',
    ],
  },
  {
    slug: 'dangers-of-mixing-opioids-benzodiazepines-alcohol',
    title: 'Why You Should Never Mix Opioids, Benzodiazepines, and Alcohol',
    category: SAFETY_CATEGORY,
    date: '2026-08-17',
    excerpt: 'Opioids, benzodiazepines, and alcohol all slow breathing through overlapping mechanisms — combining any two of them multiplies the risk rather than adding to it.',
    body: [
      'Opioids (like codeine, oxycodone, or morphine), benzodiazepines (like Xanax, Ativan, or Valium), and alcohol are all central nervous system depressants. Each one, on its own, can slow breathing at high enough doses. Combined, the effect isn’t simply additive — it’s synergistic, meaning the combined risk is greater than the sum of the individual risks.',
      '## Why the FDA requires a boxed warning\nIn 2016, the FDA added its strongest warning — a boxed warning — to both opioid and benzodiazepine labeling specifically about combining the two classes, after data showed a sharp rise in overdose deaths involving both drug types together. Alcohol compounds the same risk further.',
      '## What this looks like in practice\n- A dose of an opioid that’s safe on its own can become dangerous when a benzodiazepine or alcohol is also on board, because all three suppress the same breathing reflex.\n- This applies even when each medication is individually taken as prescribed — it’s specifically the combination that matters, not just misuse of either one alone.\n- Older adults and people with sleep apnea or other respiratory conditions are at even higher risk from these combinations.',
      'If you’re prescribed both an opioid and a benzodiazepine, that’s sometimes medically necessary and should be closely supervised by your prescriber — it isn’t automatically unsafe, but it does require caution, the lowest effective doses, and avoiding alcohol entirely. Always tell every prescriber and your pharmacist about every medication you’re taking, including as-needed prescriptions, so this interaction can be flagged before it becomes a problem.',
    ],
  },
  {
    slug: 'safe-storage-and-disposal-of-medications',
    title: 'Safe Storage and Disposal of Prescription Medications at Home',
    category: SAFETY_CATEGORY,
    date: '2026-08-24',
    excerpt: 'Where and how you store medications at home meaningfully affects both accidental poisoning risk and the chance they end up used by someone they weren’t prescribed for.',
    body: [
      'Most people store medication in a bathroom cabinet or kitchen drawer without thinking much about it, but where and how prescriptions are stored has a measurable effect on two separate risks: accidental ingestion by children, and use by a family member or visitor the medication wasn’t prescribed for — one of the most common ways people are first exposed to controlled substances like opioids and benzodiazepines.',
      '## Storage\n- Keep controlled medications (opioids, benzodiazepines, stimulants) in a locked box or cabinet, not just a high shelf — child-resistant caps aren’t the same as child-proof, and older kids and teens can and do find and recognize medications left in plain sight.\n- Don’t store medication in its original bottle inside a shared medicine cabinet if household members other than the prescribed patient have access — a locked container is worth the inconvenience for anything with misuse potential.\n- Keep track of roughly how many pills or how much liquid you have left, the same way you’d notice if cash went missing — it makes it far easier to notice if something is off.',
      '## Disposal\nExpired or unneeded medication shouldn’t sit in a cabinet indefinitely, and most medications shouldn’t simply go in household trash or down the drain. The DEA runs National Prescription Drug Take Back Day events, and many pharmacies host permanent drop boxes year-round — search “drug take back near me” or ask your pharmacist directly. For a short list of specific medications, the FDA recommends flushing if no take-back option is immediately available, specifically because the poisoning risk from a child or pet finding them outweighs the environmental concern — check the FDA’s “flush list” if you’re unsure which category a medication falls into.',
      'This applies even to medications you don’t think of as risky. A half-empty bottle of a prescribed cough syrup or anti-anxiety medication sitting in a cabinet for months is a common, preventable starting point for both accidental poisoning and misuse — a few minutes of secure storage or proper disposal meaningfully reduces both.',
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
