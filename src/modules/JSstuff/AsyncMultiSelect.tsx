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
import { useAsyncMultiSelect } from "./useAsyncMultiSelect"; // Adjust the import path
import { useEffect } from "react";

interface MultiSelectProps {
  endpoint: string;
  defaultValue?: string[];
  onChange?: (selectedValues: string[]) => void;
  placeholder?: string;
  perPage?: number;
}

export function AsyncMultiSelect({
  endpoint,
  defaultValue = [],
  onChange,
  placeholder = "Select options...",
  perPage = 10,
}: MultiSelectProps) {
  const {
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
  } = useAsyncMultiSelect({
    endpoint,
    defaultValue,
    perPage,
  });

  // Notify parent component when selectedValues change
  useEffect(() => {
    onChange?.(selectedValues);
  }, [selectedValues, onChange]);

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
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Search options..."
              value={searchQuery}
              onValueChange={handleSearchChange}
              className="flex-1 outline-none"
            />
          </div>
          <CommandEmpty>
            {loading ? "Loading..." : error ? error : "No options found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            <CommandItem
              key={"Sztywno"}
              onSelect={() => handleSelect("Sztywno")}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedValues.includes("Sztywno")
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
              {"Sztywno"}
            </CommandItem>
            {options.map((option) => {
              return (
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
              );
            })}
            {hasMore && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleLoadMore}
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
