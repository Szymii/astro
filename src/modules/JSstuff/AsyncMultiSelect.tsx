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
import { useAutocomplete } from "./useAutocomplete";
import {
  getFrameworks,
  getFrameworksUntilDefaultsFound,
} from "./getFrameworks";
import { useQuery } from "@tanstack/react-query";

interface Option {
  value: number;
  label: string;
}

interface AsyncMultiSelectProps {
  defaultValue?: number[];
  onChange?: (selectedValues: number[]) => void;
  placeholder?: string;
}

export function AsyncMultiSelect({
  defaultValue = [],
  onChange,
  placeholder = "Select options...",
}: AsyncMultiSelectProps) {
  const [selectedValues, setSelectedValues] = React.useState(defaultValue);

  // Fetch data using useAutocomplete
  const {
    flatData: options,
    isNextPagePending,
    isLoading,
    isError,
    error,
    search: handleSearchChange,
    getNextPage: handleLoadMore,
  } = useAutocomplete<Option, { search: string }>({
    queryKey: "frameworks",
    queryFn: (searchParams, pageParam) =>
      getFrameworks(searchParams, pageParam),
    initialSearchParams: { search: "" },
  });

  // Fetch missing default values using React Query
  const { data: defaultOptions } = useQuery({
    queryKey: ["defaultFrameworks", defaultValue],
    queryFn: async () => {
      return getFrameworksUntilDefaultsFound(defaultValue);
    },
    enabled: defaultValue.length > 0, // Only run if there are default values
  });

  // Combine options and default options
  const allOptions = React.useMemo(() => {
    const defaultOptionsMap = new Map(
      defaultOptions?.map((option) => [option.value, option]) || [],
    );

    // Merge options, ensuring default values are included
    const mergedOptions = options.map((option) => ({
      ...option,
      ...(defaultOptionsMap.get(option.value) || {}),
    }));

    // Add missing default values
    defaultOptions?.forEach((option) => {
      if (!mergedOptions.some((o) => o.value === option.value)) {
        mergedOptions.push(option);
      }
    });

    return mergedOptions;
  }, [options, defaultOptions]);

  // Handle selection of an option
  const handleSelect = (value: number) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value) // Deselect
      : [...selectedValues, value]; // Select

    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues); // Notify parent component
  };

  // Handle removal of an option
  const handleRemove = (value: number) => {
    const newSelectedValues = selectedValues.filter((v) => v !== value);
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues); // Notify parent component
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="h-auto min-h-[40px] w-full flex-wrap justify-start gap-2 md:w-[300px]"
        >
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const option = allOptions.find((o) => o.value === value);
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
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Search options..."
              onValueChange={(value) => handleSearchChange({ search: value })}
              className="flex-1 outline-none"
            />
          </div>
          <CommandEmpty>
            {isLoading
              ? "Loading..."
              : isError
                ? error?.toString()
                : "No options found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {allOptions.map((option) => (
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
            {!isNextPagePending && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
