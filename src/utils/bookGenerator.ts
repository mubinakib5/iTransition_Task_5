import { Faker, de, en, fr, base } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { Book, Review } from '@/types/book';

const SUPPORTED_LOCALES = {
  'en-US': 'English (US)',
  'de-DE': 'German (Germany)',
  'fr-FR': 'French (France)'
};

export function generateBooks(
  rng: () => number,
  language: string,
  page: number,
  pageSize: number,
  likesPerBook: number,
  reviewsPerBook: number,
  seed: string
): Book[] {
  const baseSeed = seed.split('-')[0];

  let fakerInstance: Faker;
  switch (language) {
    case 'de-DE':
      fakerInstance = new Faker({ locale: [de, en, base], seed: parseInt(baseSeed) });
      break;
    case 'fr-FR':
      fakerInstance = new Faker({ locale: [fr, en, base], seed: parseInt(baseSeed) });
      break;
    default:
      fakerInstance = new Faker({ locale: [en, base], seed: parseInt(baseSeed) });
  }

  return Array.from({ length: pageSize }, (_, index) => {
    const actualIndex = (page - 1) * pageSize + index + 1;
    const bookRng = seedrandom(`${baseSeed}-${actualIndex}`);

    return {
      id: actualIndex,
      isbn: generateISBN(bookRng),
      title: fakerInstance.commerce.productName(),
      authors: generateAuthors(bookRng, fakerInstance),
      publisher: fakerInstance.company.name(),
      publishYear: 2000 + Math.floor(bookRng() * 24),
      coverUrl: generateCoverUrl(bookRng),
      likes: generateLikes(likesPerBook, bookRng),
      reviews: generateReviews(reviewsPerBook, bookRng, fakerInstance)
    };
  });
}

function generateISBN(rng: () => number): string {
  const prefix = '978';
  const group = Math.floor(rng() * 5) + 1;
  const publisher = Math.floor(rng() * 99999).toString().padStart(5, '0');
  const title = Math.floor(rng() * 999).toString().padStart(3, '0');
  const checkDigit = '0';
  return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`;
}

function generateAuthors(rng: () => number, localFaker: Faker): string[] {
  const count = Math.floor(rng() * 2) + 1;
  return Array.from({ length: count }, () => localFaker.person.fullName());
}

function generateReviews(reviewsPerBook: number, rng: () => number, localFaker: Faker): Review[] {
  // Explicit check for zero
  if (reviewsPerBook <= 0) {
    return [];
  }

  const wholeCount = Math.floor(reviewsPerBook);
  const fraction = reviewsPerBook - wholeCount;
  const finalCount = wholeCount + (fraction > 0 && rng() < fraction ? 1 : 0);

  // Double-check to ensure we don't generate reviews when we shouldn't
  if (finalCount <= 0) {
    return [];
  }

  return Array.from({ length: finalCount }, () => ({
    id: localFaker.string.uuid(),
    author: localFaker.person.fullName(),
    text: localFaker.lorem.paragraph(),
    rating: Math.floor(rng() * 5) + 1,
    company: localFaker.company.name()
  }));
}

function generateLikes(likesPerBook: number, rng: () => number): number {
  // Explicit check for zero
  if (likesPerBook <= 0) {
    return 0;
  }

  const wholeCount = Math.floor(likesPerBook);
  const fraction = likesPerBook - wholeCount;
  const result = wholeCount + (fraction > 0 && rng() < fraction ? 1 : 0);

  // Double-check to ensure we don't return likes when we shouldn't
  return result <= 0 ? 0 : result;
}

function generateCoverUrl(rng: () => number): string {
  const width = 400;
  const height = 600;
  return `https://picsum.photos/seed/${Math.floor(rng() * 1000)}/${width}/${height}`;
}

export { SUPPORTED_LOCALES };
