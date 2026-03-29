/**
 * Helper to generate random "layman" reviews for medical products.
 */

const OCCUPATIONS = [
  'Plumber',
  'Primary School Teacher',
  'McDonald\'s Receptionist',
  'Nail Technician',
  'Construction Worker',
  'University Student',
  'Delivery Driver',
  'Graphic Designer',
  'Yoga Instructor',
  'Security Guard'
];

const NAMES = [
  'James Wilson',
  'Sarah Jenkins',
  'Michael O\'Connor',
  'Priya Sharma',
  'David Thompson',
  'Emily Chen',
  'Robert Miller',
  'Lisa Garcia',
  'Kevin Baker',
  'Amanda White'
];

const REVIEW_TEMPLATES = [
  "I don't know much about the medical stuff, but this definitely helped me feel better after a long shift. My wife recommended it.",
  "Great product. Tastes much better than the usual bitter stuff you get. Works fast too!",
  "Always keep a bottle of this in my toolkit. You never know when you'll need it during a big job.",
  "As a student, I need something that doesn't make me too drowsy but gets the job done. This was perfect.",
  "The packaging looks very professional. I used it for my kids and they didn't even put up a fight.",
  "I was skeptical at first, but after one dose, I could really feel the difference. Highly recommend for busy workers.",
  "Cheap, effective, and arrived quickly. Can't ask for much more from a syrup.",
  "Finally something that actually does what it says on the bottle. I'm not an expert, but this is good stuff.",
  "Bought this on a whim and now it's our family staple. Reliable and trustworthy.",
  "The instructions were clear even for someone like me who hasn't stepped into a lab since high school!"
];

export interface Review {
  id: string;
  author: string;
  occupation: string;
  content: string;
  rating: number;
  date: string;
}

export function generateRandomReviews(productId: string, count: number = 3): Review[] {
  const reviews: Review[] = [];
  
  // Use productId as seed for deterministic-ish randomness per product
  let seed = 0;
  for (let i = 0; i < productId.length; i++) {
    seed += productId.charCodeAt(i);
  }

  for (let i = 0; i < count; i++) {
    const nameIdx = (seed + i * 7) % NAMES.length;
    const occIdx = (seed + i * 13) % OCCUPATIONS.length;
    const contentIdx = (seed + i * 3) % REVIEW_TEMPLATES.length;
    const rating = 4 + (seed % 2); // 4 or 5 stars
    
    // Generate a date within the last 6 months
    const date = new Date(Date.now() - (seed % 100) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    reviews.push({
      id: `${productId}-rev-${i}`,
      author: NAMES[nameIdx],
      occupation: OCCUPATIONS[occIdx],
      content: REVIEW_TEMPLATES[contentIdx],
      rating,
      date
    });
  }

  return reviews;
}
