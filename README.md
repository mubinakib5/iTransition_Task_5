# Book Catalog Generator

A TypeScript application that generates a catalog of books with localized content in multiple languages (English, German, and French). The generator creates realistic-looking book data including titles, authors, reviews, and other metadata.

## Features

- Multi-language support (English, German, French)
- Consistent data generation using seeds
- Pagination support
- Generates:
  - Book titles in the selected language
  - Author names
  - Publisher information
  - ISBN numbers
  - Reviews with ratings
  - Like counts
  - Book cover images (via picsum.photos)

## Technologies Used

- TypeScript
- Faker.js for data generation
- Seedrandom for consistent random number generation
- Picsum Photos for cover images

## Usage

```typescript
const params: GeneratorParams = {
  seed: "unique-seed", // For consistent generation
  language: "en-US", // Supported: 'en-US', 'de-DE', 'fr-FR'
  page: 1, // Page number
  pageSize: 10, // Books per page
  likesPerBook: 100, // Average likes per book
  reviewsPerBook: 5, // Average reviews per book
};

const books = generateBooks(params);
```
