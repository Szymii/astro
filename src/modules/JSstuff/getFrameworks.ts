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
    })),
    nextPage: data.page < data.total_pages ? data.page + 1 : false,
  };
};
