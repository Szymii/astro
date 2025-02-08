import { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface UseAsyncMultiSelectProps {
  endpoint: string;
  defaultValue?: string[];
  perPage?: number;
}

export function useAsyncMultiSelect({
  endpoint,
  defaultValue = [],
  perPage = 10,
}: UseAsyncMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${endpoint}?search=${searchQuery}&page=${page}&perPage=${perPage}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const newOptions = data.data.map(
          (item: { id: string; name: string }) => ({
            value: item.id,
            label: item.name,
          }),
        );

        setOptions((prev) =>
          page === 1 ? newOptions : [...prev, ...newOptions],
        );
        setHasMore(newOptions.length === perPage);
      } catch (err) {
        setError("Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page, perPage, endpoint]);

  const handleSelect = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleRemove = (value: string) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to the first page
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return {
    selectedValues,
    options,
    loading,
    error,
    hasMore,
    searchQuery,
    handleSelect,
    handleRemove,
    handleSearchChange,
    handleLoadMore,
  };
}
