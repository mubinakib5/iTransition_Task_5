import { useEffect, useRef } from 'react';
import { Book } from '@/types/book';
import { Loader2 } from 'lucide-react';
import BookCard from './BookCard';

interface BookListProps {
  pages: Book[][];
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}

export default function BookList({
  pages,
  onLoadMore,
  isFetchingNextPage,
}: BookListProps) {
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
    <div className="space-y-4">
      {pages.map((page) =>
        page.map((book) => <BookCard key={book.id} book={book} />)
      )}

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
    </div>
  );
}