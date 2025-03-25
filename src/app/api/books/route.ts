import { NextResponse } from 'next/server';
import { generateBooks } from '@/utils/bookGenerator';
import seedrandom from 'seedrandom';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get('seed') || '42';
  const language = searchParams.get('language') || 'en-US';
  const likes = Number(searchParams.get('likes')) || 0; // Changed default to 0
  const reviews = Number(searchParams.get('reviews')) || 0; // Changed default to 0
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;

  // Ensure likes and reviews are exactly 0 when that's the value
  const actualLikes = searchParams.get('likes') === '0' ? 0 : likes;
  const actualReviews = searchParams.get('reviews') === '0' ? 0 : reviews;

  const baseSeed = seed.split('-')[0];
  const rng = seedrandom(baseSeed);
  
  const books = generateBooks(rng, language, page, pageSize, actualLikes, actualReviews, seed);

  return NextResponse.json(books);
}