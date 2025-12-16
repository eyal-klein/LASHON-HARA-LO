import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Shop() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = trpc.products.list.useQuery({
    page,
    limit: 12,
    category: category as any,
    search,
  });

  const { data: featured } = trpc.products.featured.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-[#ED1C24] text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">החנות שלנו</h1>
          <p className="text-xl">ספרים, צמידים, מדבקות ועוד...</p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Featured Products */}
        {featured && featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">מוצרים מומלצים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <img
                      src={JSON.parse(product.images as string)[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-[#ED1C24]">₪{product.price}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/shop/${product.id}`}>
                      <Button className="w-full">צפה במוצר</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <Input
            placeholder="חפש מוצרים..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="כל הקטגוריות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              <SelectItem value="books">ספרים</SelectItem>
              <SelectItem value="bracelets">צמידים</SelectItem>
              <SelectItem value="stickers">מדבקות</SelectItem>
              <SelectItem value="posters">פוסטרים</SelectItem>
              <SelectItem value="other">אחר</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <p>טוען מוצרים...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products?.items.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <img
                      src={JSON.parse(product.images as string)[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <p className="text-xl font-bold text-[#ED1C24]">₪{product.price}</p>
                    {product.stockQuantity === 0 && (
                      <p className="text-red-500 text-sm mt-2">אזל מהמלאי</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/shop/${product.id}`}>
                      <Button className="w-full" disabled={product.stockQuantity === 0}>
                        {product.stockQuantity === 0 ? "אזל מהמלאי" : "צפה במוצר"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {products && products.total > 12 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  הקודם
                </Button>
                <span className="py-2">
                  עמוד {page} מתוך {Math.ceil(products.total / 12)}
                </span>
                <Button
                  disabled={page >= Math.ceil(products.total / 12)}
                  onClick={() => setPage(page + 1)}
                >
                  הבא
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
