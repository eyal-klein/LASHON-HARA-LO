import { trpc } from "@/lib/trpc";

export default function DebugShop() {
  const { data, isLoading, error } = trpc.products.list.useQuery({
    page: 1,
    limit: 12,
  });

  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">Debug Shop</h1>
      
      <div className="mb-4">
        <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          <strong>Error:</strong> {error.message}
        </div>
      )}
      
      {data && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          <strong>Success!</strong> Found {data.total} products
        </div>
      )}
      
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
