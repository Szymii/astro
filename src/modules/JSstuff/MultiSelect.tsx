import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
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
  availableOptions: Option[];
  defaultValue?: string[]; // Updated to use `defaultValue`
  onChange?: (selectedValues: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  availableOptions,
  defaultValue = [], // Default to an empty array
  onChange,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue); // Initialize with `defaultValue`
  const [isOpen, setIsOpen] = React.useState(false);

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
              const option = availableOptions.find((o) => o.value === value);
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
              className="flex-1 outline-none"
            />
          </div>
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {availableOptions.map((option) => (
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
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
