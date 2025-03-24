'use client'
import { useEffect, useRef } from 'react';
import { Book } from '@/types/book';
import { Card } from '@/components/ui/card';
import { Loader2, ThumbsUp, Star } from 'lucide-react';
import Image from 'next/image';

interface BookGalleryProps {
  pages: Book[][];
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}

export default function BookGallery({
  pages,
  onLoadMore,
  isFetchingNextPage,
}: BookGalleryProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pages.map((page) =>
        page.map((book) => (
          <Card key={book.id} className="overflow-hidden group">
            <div className="relative aspect-[2/3]">
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-white flex flex-col justify-end">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm">{book.authors.join(', ')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <ThumbsUp className="h-4 w-4" />
                  {book.likes}
                  <Star className="h-4 w-4 ml-2" />
                  {book.reviews.length}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}

      <div ref={loadMoreRef} className="col-span-full h-10 flex justify-center items-center">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
    </div>
  );
}