import { stringify } from 'csv-stringify/sync';
import { Book } from '@/types/book';

export function exportToCSV(books: Book[]) {
  const records = books.map(book => ({
    '#': book.id,
    'ISBN': book.isbn,
    'Title': book.title,
    'Authors': book.authors.join('; '),
    'Publisher': book.publisher,
    'Likes': book.likes,
    'Reviews': book.reviews.length
  }));

  const csv = stringify(records, {
    header: true,
    quoted: true
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `books_export_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}