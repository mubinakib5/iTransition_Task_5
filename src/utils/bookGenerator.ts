import { Faker, de, en, fr, base } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { Book, GeneratorParams, Review } from '@/types/book';

const SUPPORTED_LOCALES = {
  'en-US': 'English (US)',
  'de-DE': 'German (Germany)',
  'fr-FR': 'French (France)'
};

export function generateBooks(params: GeneratorParams): Book[] {
  const { seed, language, page, pageSize, likesPerBook, reviewsPerBook } = params;
  
  const combinedSeed = `${seed}-${page}`;
  const rng = seedrandom(combinedSeed);

  // Create a localized faker instance with a fallback to 'en' and 'base'
  let fakerInstance: Faker;
  switch (language) {
    case 'de-DE':
      fakerInstance = new Faker({ locale: [de, en, base] });
      break;
    case 'fr-FR':
      fakerInstance = new Faker({ locale: [fr, en, base] });
      break;
    default:
      fakerInstance = new Faker({ locale: [en, base] });
  }

  return Array.from({ length: pageSize }, (_, index) => {
    const actualIndex = (page - 1) * pageSize + index + 1;
    
    return {
      id: actualIndex,
      isbn: generateISBN(rng),
      title: fakerInstance.commerce.productName(), // Now guaranteed to work
      authors: generateAuthors(rng, fakerInstance),
      publisher: fakerInstance.company.name(),
      publishYear: fakerInstance.date.past().getFullYear(),
      coverUrl: generateCoverUrl(rng),
      likes: generateLikes(likesPerBook, rng),
      reviews: generateReviews(reviewsPerBook, rng, fakerInstance)
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
  let count = Math.floor(reviewsPerBook);
  const fraction = reviewsPerBook - count;
  
  if (fraction > 0 && rng() > fraction) {
    count -= 1;
  }

  return Array.from({ length: count }, () => ({
    id: localFaker.string.uuid(),
    author: localFaker.person.fullName(),
    text: localFaker.lorem.paragraph(),
    rating: Math.floor(rng() * 5) + 1,
    company: localFaker.company.name()
  }));
}

function generateLikes(likesPerBook: number, rng: () => number): number {
  const count = Math.floor(likesPerBook);
  const fraction = likesPerBook - count;
  
  return count + (rng() < fraction ? 1 : 0);
}

function generateCoverUrl(rng: () => number): string {
  const width = 400;
  const height = 600;
  return `https://picsum.photos/seed/${Math.floor(rng() * 1000)}/${width}/${height}`;
}

export { SUPPORTED_LOCALES };
