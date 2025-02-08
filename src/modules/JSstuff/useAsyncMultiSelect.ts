import * as React from "react";

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
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  // Fetch data from the endpoint
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${endpoint}?search=${searchQuery}&page=${page}&perPage=${perPage}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setOptions((prevOptions) =>
          page === 1
            ? data.data.map((item: { id: string; name: string }) => ({
                value: item.id,
                label: item.name,
              }))
            : [
                ...prevOptions,
                ...data.data.map((item: { id: string; name: string }) => ({
                  value: item.id,
                  label: item.name,
                })),
              ],
        );
        setHasMore(data.data.length === perPage); // Check if there are more items
      } catch (err) {
        setError("Failed to load options");
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page, perPage, endpoint]);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value) // Deselect
      : [...selectedValues, value]; // Select

    setSelectedValues(newSelectedValues);
  };

  const handleRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter((v) => v !== value);
    setSelectedValues(newSelectedValues);
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
