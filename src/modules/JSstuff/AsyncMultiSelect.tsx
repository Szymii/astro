import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/system/ui/command";
import { cn } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/system/ui/popover";
import { Button } from "@/system/ui/button";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  endpoint: string; // Endpoint to fetch data from
  defaultValue?: string[]; // Updated to use `defaultValue`
  onChange?: (selectedValues: string[]) => void;
  placeholder?: string;
  perPage?: number; // Number of items per page
}

export function AsyncMultiSelect({
  endpoint,
  defaultValue = [],
  onChange,
  placeholder = "Select options...",
  perPage = 10,
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
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
        setOptions((prev) =>
          page === 1
            ? data.data.map((item: { id: string; name: string }) => ({
                value: item.id,
                label: item.name,
              }))
            : [
                ...prev,
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
    onChange?.(newSelectedValues); // Notify parent component
  };

  const handleRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter((v) => v !== value);
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues); // Notify parent component
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="h-auto min-h-[40px] w-full flex-wrap justify-start gap-2 md:w-[300px]"
        >
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <div
                  key={value}
                  className="flex items-center gap-1 rounded-md bg-gray-700 px-2 py-1 text-sm"
                >
                  <span>{option?.label}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the dropdown from opening
                      handleRemove(value);
                    }}
                  />
                </div>
              );
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-[300px]">
        <Command>
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Search options..."
              value={searchQuery}
              onValueChange={(value) => {
                setSearchQuery(value); // Update search query
                setPage(1); // Reset to the first page
              }}
              className="flex-1 outline-none"
            />
          </div>
          <CommandEmpty>
            {loading ? "Loading..." : error ? error : "No options found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValues.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
            {hasMore && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
