interface Options {
  value: number;
  label: string;
}

export const getFrameworks = async (
  searchParams: {
    search: string;
  },
  pageParam = 1,
) => {
  const { search } = searchParams;
  const url = `http://localhost:3000/framework?search=${search}&page=${pageParam}&perPage=10`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return {
    data: data.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    })) as Options[],
    nextPage: data.page < data.total_pages ? data.page + 1 : false,
  };
};

// Fetch all pages until default values are found
export const getFrameworksUntilDefaultsFound = async (
  defaultValue: number[],
) => {
  let page = 1;
  const foundOptions: Options[] = [];
  const missingDefaults = new Set(defaultValue);

  while (missingDefaults.size > 0) {
    const response = await getFrameworks({ search: "" }, page);

    // Check if any default values are in the current page
    response.data.forEach((option) => {
      if (missingDefaults.has(option.value)) {
        foundOptions.push(option);
        missingDefaults.delete(option.value);
      }
    });

    // Stop if there are no more pages or all defaults are found
    if (!response.nextPage || missingDefaults.size === 0) {
      break;
    }

    page++;
  }

  return foundOptions;
};
