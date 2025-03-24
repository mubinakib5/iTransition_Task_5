import { NextResponse } from 'next/server';
import { generateBooks } from '@/utils/bookGenerator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const params = {
    seed: searchParams.get('seed') || '1',
    language: searchParams.get('language') || 'en-US',
    region: searchParams.get('region') || 'US',
    likesPerBook: parseFloat(searchParams.get('likes') || '0'),
    reviewsPerBook: parseFloat(searchParams.get('reviews') || '0'),
    page: parseInt(searchParams.get('page') || '1'),
    pageSize: parseInt(searchParams.get('pageSize') || '20')
  };

  const books = generateBooks(params);

  return NextResponse.json(books);
}