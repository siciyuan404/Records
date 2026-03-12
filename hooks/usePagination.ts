import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageCount: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 0,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageCount = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  }, [pageCount]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  }, [pageCount]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < pageCount) {
      setCurrentPage(page);
    }
  }, [pageCount]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage,
    pageCount,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
  };
}
