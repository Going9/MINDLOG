import { useCallback } from "react";

type PaginationData = {
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
};

export function usePagination(pagination: PaginationData) {
  const updateUrlParams = useCallback((newParams: Record<string, string>) => {
    const url = new URL(window.location.href);
    
    Object.entries(newParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    window.location.href = url.toString();
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      updateUrlParams({ page: (pagination.currentPage - 1).toString() });
    }
  }, [pagination.currentPage, updateUrlParams]);

  const goToNextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      updateUrlParams({ page: (pagination.currentPage + 1).toString() });
    }
  }, [pagination.hasNextPage, pagination.currentPage, updateUrlParams]);

  return {
    goToPreviousPage,
    goToNextPage,
    canGoToPrevious: pagination.currentPage > 1,
    canGoToNext: pagination.hasNextPage,
  };
}