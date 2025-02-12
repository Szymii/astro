import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

// Define the shape of the response data
interface PaginatedResponse<T> {
  data: T[];
  nextPage?: number;
}

// Define the props for the hook
interface UseAutocompleteProps<T, SearchParams> {
  queryKey: string;
  queryFn: (
    searchParams: SearchParams,
    pageParam?: number,
  ) => Promise<PaginatedResponse<T>>;
  initialSearchParams?: SearchParams;
}

export const useAutocomplete = <T, SearchParams = Record<string, unknown>>({
  queryKey,
  queryFn,
  initialSearchParams = {} as SearchParams,
}: UseAutocompleteProps<T, SearchParams>) => {
  const [searchParams, setSearchParams] =
    useState<SearchParams>(initialSearchParams);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<PaginatedResponse<T>>({
    queryKey: [queryKey, searchParams],
    queryFn: ({ pageParam = 1 }) => queryFn(searchParams, pageParam as number),
    getNextPageParam: (lastPage) => {
      // console.log(lastPage);
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });

  const flatData = data?.pages.flatMap((page) => page.data) || [];

  const search = (newSearchParams: SearchParams) => {
    setSearchParams(newSearchParams);
  };

  const getNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    flatData,
    isNextPagePending: isFetchingNextPage,
    isLoading,
    isError,
    error,
    search,
    getNextPage,
  };
};
