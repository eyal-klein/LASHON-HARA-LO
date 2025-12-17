import { Header } from "@/components/Header";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Search, Filter } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { NavigationWithCart } from "@/components/NavigationWithCart";
import { toast } from "sonner";



export default function StoreNew() {
  const { addItem } = useCart();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: productsData, isLoading } = trpc.products.list.useQuery({
    page,
    limit: 12,
    search: search || undefined,
    category: selectedCategory === "all" ? undefined : (selectedCategory as any),
  });

  const { data: categories } = trpc.products.listCategories.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationWithCart />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-blue-600 to-purple-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              החנות שלנו
            </h1>
            <p className="text-xl text-blue-100">
              מוצרים ייחודיים להפצת המסר - צמידים, חולצות, מדבקות ועוד
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש מוצר..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="כל הקטגוריות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">טוען מוצרים...</p>
            </div>
          ) : productsData?.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">לא נמצאו מוצרים</h3>
              <p className="text-muted-foreground">נסה לשנות את הסינון או החיפוש</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData?.items.map((product) => {
                  const images = typeof product.images === 'string' 
                    ? JSON.parse(product.images) 
                    : product.images;
                  const firstImage = Array.isArray(images) ? images[0] : null;
                  const stockQuantity = Number(product.stockQuantity) || 0;

                  return (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square bg-gray-100">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-16 w-16" />
                          </div>
                        )}
                        {stockQuantity === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-lg">אזל מהמלאי</Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            ₪{Number(product.price).toFixed(2)}
                          </span>
                          {stockQuantity > 0 && stockQuantity <= 5 && (
                            <Badge variant="secondary">נותרו {stockQuantity}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Link href={`/product/${product.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            פרטים
                          </Button>
                        </Link>
                        <Button 
                          className="flex-1" 
                          disabled={stockQuantity === 0}
                          onClick={() => {
                            addItem({
                              id: product.id,
                              name: product.name,
                              price: Number(product.price),
                              image: firstImage || "/placeholder-product.png",
                              slug: product.slug,
                            });
                            toast.success(`${product.name} נוסף לעגלה!`);
                          }}
                        >
                          <ShoppingBag className="h-4 w-4 ml-2" />
                          {stockQuantity === 0 ? "אזל מהמלאי" : "הוסף לסל"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {productsData && productsData.total > 12 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    הקודם
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    עמוד {page} מתוך {Math.ceil(productsData.total / 12)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * 12 >= productsData.total}
                  >
                    הבא
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">לשון הרע לא מדבר אליי</h3>
              <p className="text-gray-400">
                עמותה ללא מטרות רווח למען הפצת המודעות לנזקי לשון הרע
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">אודות</Link>
                <Link href="/activities" className="block text-gray-400 hover:text-white transition-colors">הפעילות שלנו</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">צרו קשר</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">צור קשר</h4>
              <p className="text-gray-400">
                info@lashonhara.co.il
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} לשון הרע לא מדבר אליי. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
