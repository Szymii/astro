import { AsyncMultiSelect } from "./AsyncMultiSelect";
import { MultiSelect } from "./MultiSelect";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const JSstuff = () => {
  const availableOptions = [
    { value: "nextjs", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "angular", label: "Angular" },
  ];

  const defaultValue = ["react", "vue"];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container flex min-h-[300px] flex-col items-start gap-6 py-8">
        <h1 className="mb-4 text-xl font-bold">Select Frameworks</h1>
        <MultiSelect
          availableOptions={availableOptions}
          defaultValue={defaultValue}
          onChange={(selectedValues: string[]) =>
            console.log("Selected Values:", selectedValues)
          }
          placeholder="Select frameworks..."
        />
        <AsyncMultiSelect
          defaultValue={[3, 20]}
          onChange={(selectedValues) => console.log(selectedValues)}
          placeholder="Select frameworks..."
        />
      </div>
    </QueryClientProvider>
  );
};
