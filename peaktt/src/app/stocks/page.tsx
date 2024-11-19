import SuggestionsList from "@/components/SuggestionsList";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const StocksPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Stock Search</h1>
      <form method="GET" action="/stocks">
        <input
          type="text"
          name="query"
          defaultValue={query}
          placeholder="Search for stocks"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </form>

      {query && <SuggestionsList query={query} />}
    </div>
  );
};

export default StocksPage;
