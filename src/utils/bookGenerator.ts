import { faker } from '@faker-js/faker';
import { de, fr } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { Book, GeneratorParams } from '@/types/book';

const SUPPORTED_LOCALES = {
  'en-US': 'English (US)',
  'de-DE': 'German (Germany)',
  'fr-FR': 'French (France)'
};

export function generateBooks(params: GeneratorParams): Book[] {
  const { seed, language, page, pageSize, likesPerBook, reviewsPerBook } = params;
  
  const combinedSeed = `${seed}-${page}`;
  const rng = seedrandom(combinedSeed);
  
  // Set faker locale
  switch (language) {
    case 'de-DE':
      faker.locale = 'de';
      break;
    case 'fr-FR':
      faker.locale = 'fr';
      break;
    default:
      faker.locale = 'en';
  }

  return Array.from({ length: pageSize }, (_, index) => {
    const actualIndex = (page - 1) * pageSize + index + 1;
    
    return {
      id: actualIndex,
      isbn: generateISBN(rng),
      title: faker.commerce.productName(),
      authors: generateAuthors(rng, faker),
      publisher: `${faker.company.name()}`,
      publishYear: faker.date.past().getFullYear(),
      coverUrl: generateCoverUrl(rng),
      likes: generateLikes(likesPerBook, rng),
      reviews: generateReviews(reviewsPerBook, rng, faker)
    };
  });
}

// Update other functions to use localFaker
function generateISBN(rng: () => number): string {
  const prefix = '978';
  const group = Math.floor(rng() * 5) + 1;
  const publisher = Math.floor(rng() * 99999).toString().padStart(5, '0');
  const title = Math.floor(rng() * 999).toString().padStart(3, '0');
  // TODO: Add check digit calculation
  const checkDigit = '0';
  return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`;
}

// Keep only these versions of the functions and remove the duplicates
function generateAuthors(rng: () => number, localFaker: any): string[] {
  const count = Math.floor(rng() * 2) + 1;
  return Array.from({ length: count }, () => localFaker.person.fullName());
}

function generateReviews(reviewsPerBook: number, rng: () => number, localFaker: any): Review[] {
  const count = Math.floor(reviewsPerBook);
  const fraction = reviewsPerBook - count;
  
  if (fraction > 0 && rng() > fraction) {
    count - 1;
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
  // Using placeholder image service
  const width = 400;
  const height = 600;
  return `https://picsum.photos/seed/${Math.floor(rng() * 1000)}/${width}/${height}`;
}

export { SUPPORTED_LOCALES };