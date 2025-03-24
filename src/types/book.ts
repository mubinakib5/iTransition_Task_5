export interface Book {
  id: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publishYear: number;
  coverUrl: string;
  likes: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  company: string;
}

export interface GeneratorParams {
  seed: string;
  language: string;
  region: string;
  likesPerBook: number;
  reviewsPerBook: number;
  page: number;
  pageSize: number;
}