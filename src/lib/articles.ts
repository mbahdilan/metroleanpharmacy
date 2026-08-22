export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  date: string;
};

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
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
