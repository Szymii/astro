import { AsyncMultiSelect } from "./AsyncMultiSelect";
import { MultiSelect } from "./MultiSelect";

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
        endpoint="http://localhost:3000/framework"
        onChange={(selectedValues) => console.log(selectedValues)}
        placeholder="Select frameworks..."
        perPage={10}
      />
    </div>
  );
};
