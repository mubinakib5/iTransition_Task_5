'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Book } from '@/types/book';
import { ChevronDown, ChevronUp, ThumbsUp, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface BookTableProps {
  pages: Book[][];
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}

export default function BookTable({
  pages,
  onLoadMore,
  isFetchingNextPage,
}: BookTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const toggleRow = (bookId: number) => {
    setExpandedRows(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">#</th>
            <th className="text-left p-4">ISBN</th>
            <th className="text-left p-4">Title</th>
            <th className="text-left p-4">Author(s)</th>
            <th className="text-left p-4">Publisher</th>
            <th className="w-8 p-4"></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) =>
            page.map((book) => (
              <React.Fragment key={book.id}>
                <tr
                  className="border-b hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => toggleRow(book.id)}
                >
                  <td className="p-4">{book.id}</td>
                  <td className="p-4 font-mono">{book.isbn}</td>
                  <td className="p-4">{book.title}</td>
                  <td className="p-4">{book.authors.join(', ')}</td>
                  <td className="p-4">
                    {book.publisher}, {book.publishYear}
                  </td>
                  <td className="p-4">
                    {expandedRows.includes(book.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </td>
                </tr>
                {expandedRows.includes(book.id) && (
                  <tr className="bg-muted/50">
                    <td colSpan={6} className="p-6">
                      <div className="flex gap-6">
                        <div className="w-48 flex-shrink-0">
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            width={400}
                            height={600}
                            className="w-full h-auto rounded-md"
                            unoptimized
                          />
                        </div>
                        <div className="space-y-4 flex-grow">
                          <div className="space-y-2">
                            <h2 className="text-2xl font-bold">{book.title}</h2>
                            <p className="text-lg">by {book.authors.join(', ')}</p>
                            <p className="text-muted-foreground">
                              Published by {book.publisher} ({book.publishYear})
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            {book.likes > 0 && (
                              <div className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {book.likes}
                              </div>
                            )}
                          </div>
                          {book.reviews && book.reviews.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="font-semibold">Reviews</h3>
                              {book.reviews.map((review) => (
                                <div key={review.id} className="border-l-2 pl-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{review.author}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {review.company}
                                    </span>
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      {review.rating}
                                    </div>
                                  </div>
                                  <p className="mt-1 text-sm">{review.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center mt-4">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
    </div>
  );
}