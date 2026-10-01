import { initialProducts } from './products';

// Attaches fallback IDs and review meta so frontend can function even during backend cold starts
export const fallbackProducts = initialProducts.map((p, idx) => ({
  _id: `dryway-${idx + 101}`,
  offerPrice: p.offerPrice || Math.round(p.price * 0.85),
  isOffer: p.isOffer || (idx % 3 === 0),
  offerTag: p.offerTag || (idx % 3 === 0 ? '15% OFF' : ''),
  reviews: [
    {
      _id: `rev-101-${idx}`,
      name: 'Anjali R.',
      rating: 5,
      comment: 'Super crisp, full of natural taste and no artificial sugar! Reordering again.',
      createdAt: '2026-09-28T12:00:00.000Z',
    },
    {
      _id: `rev-102-${idx}`,
      name: 'Kiran Kumar',
      rating: 4,
      comment: 'Extremely fresh packaging and very convenient for quick healthy snacking.',
      createdAt: '2026-09-24T12:00:00.000Z',
    },
  ],
  questions: [
    {
      _id: `q-101-${idx}`,
      name: 'Siddharth M.',
      question: 'Is this 100% natural without added preservatives?',
      answer: 'Yes! All Dryway products are 100% natural, dehydrated without artificial chemicals or preservatives.',
      createdAt: '2026-09-26T12:00:00.000Z',
    },
  ],
  rating: 4.8,
  numReviews: 2,
  ...p,
}));
