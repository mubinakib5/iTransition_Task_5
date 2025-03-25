'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw, List, Grid, Download } from 'lucide-react';
import BookList from '@/components/BookList';
import { SUPPORTED_LOCALES } from '@/utils/bookGenerator';
import { exportToCSV } from '@/utils/csvExport';
import BookGallery from '@/components/BookGallery';
import BookTable from '@/components/BookTable';

export default function Home() {
  const [seed, setSeed] = useState('42');
  const [language, setLanguage] = useState('en-US');
  const [likes, setLikes] = useState(5);
  const [reviews, setReviews] = useState(2.5);
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'gallery'>('table');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['books', seed, language, likes, reviews],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          seed,
          language,
          likes: likes.toString(),
          reviews: reviews.toString(),
          page: pageParam.toString(),
          pageSize: '20',
        });
        const res = await fetch(`/api/books?${params}`);
        return res.json();
      },
      initialPageParam: 1,  // Add this line
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 20 ? pages.length + 1 : undefined;
      },
    });

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 100000000).toString());
  };

  const handleExportCSV = () => {
    const allBooks = data?.pages.flat() || [];
    exportToCSV(allBooks);
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language & Region</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Seed</label>
            <div className="flex gap-2">
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Enter seed..."
              />
              <Button size="icon" onClick={generateRandomSeed}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Likes per book: {likes.toFixed(1)}
            </label>
            <Slider
              value={[likes]}
              onValueChange={(value) => setLikes(value[0])}
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Reviews per book: {reviews.toFixed(1)}
            </label>
            <Slider
              value={[reviews]}
              onValueChange={(value) => setReviews(value[0])}
              min={0}
              max={10}
              step={0.1}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('gallery')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Gallery
            </Button>
          </div>

          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : viewMode === 'table' ? (
        <BookTable
          pages={data?.pages || []}
          onLoadMore={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
        />
      ) : viewMode === 'list' ? (
        <BookList
          pages={data?.pages || []}
          onLoadMore={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
        />
      ) : (
        <BookGallery
          pages={data?.pages || []}
          onLoadMore={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </main>
  );
}
