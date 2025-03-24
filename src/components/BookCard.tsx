import { useState } from 'react';
import { Book } from '@/types/book';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, ThumbsUp, Star } from 'lucide-react';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, coverUrl } = book;  // Only destructure what we use

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">#{book.id}</div>
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <div className="text-sm text-muted-foreground">
            by {book.authors.join(', ')}
          </div>
          <div className="text-sm">ISBN: {book.isbn}</div>
          <div className="text-sm">{book.publisher}</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {book.likes}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <Image
            src={coverUrl}
            alt={title}
            width={400}
            height={600}
            className="w-full h-auto"
          />

          {book.reviews.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Reviews</h3>
              {book.reviews.map((review) => (
                <div key={review.id} className="border-l-2 pl-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium">{review.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {review.company}
                    </div>
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
      )}
    </Card>
  );
}