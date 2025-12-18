import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { NavigationWithCart } from "@/components/NavigationWithCart";
import { toast } from "sonner";

export default function StoreNew() {
  const { addItem } = useCart();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch featured products for carousel
  const { data: featuredProducts } = trpc.products.list.useQuery(
    {
      page: 1,
      limit: 6,
      featured: true,
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch all products for grid
  const { data: productsData, isLoading } = trpc.products.list.useQuery(
    {
      page,
      limit: 12,
      search: search || undefined,
      category: selectedCategory === "all" ? undefined : (selectedCategory as any),
    },
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  const { data: categories } = trpc.products.listCategories.useQuery();

  const handleAddToCart = (product: any) => {
    const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: images?.[0] || "/placeholder-product.png",
    });
    toast.success("המוצר נוסף לעגלה");
  };

  const nextSlide = () => {
    if (featuredProducts && carouselIndex < featuredProducts.items.length - 3) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationWithCart />

      {/* Free Shipping Banner */}
      <div className="bg-[#ED1C24] text-white py-3 text-center">
        <p className="text-lg font-medium">משלוח חינם בקניה מעל 100 ש"ח לנקודות האיסוף</p>
      </div>

      {/* Featured Products Carousel */}
      {featuredProducts && featuredProducts.items.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container">
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                disabled={carouselIndex === 0}
                className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                disabled={carouselIndex >= featuredProducts.items.length - 3}
                className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Carousel */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out gap-4"
                  style={{
                    transform: `translateX(${carouselIndex * (100 / 3)}%)`,
                  }}
                >
                  {featuredProducts.items.map((product) => {
                    const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
                    return (
                      <div key={product.id} className="flex-shrink-0 w-1/3 px-2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <img
                            src={images?.[0] || "/placeholder-product.png"}
                            alt={product.name}
                            loading="lazy"
                            className="w-full aspect-square object-cover"
                          />
                          <div className="p-4 text-center">
                            <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="bg-[#ED1C24] hover:bg-red-700 text-white w-full"
                            >
                              לקניה &gt;&gt;&gt;
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Title */}
      <section className="py-8">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8">מוצרים פופולריים</h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED1C24]"></div>
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
                  const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={images?.[0] || "/placeholder-product.png"}
                            alt={product.name}
                            loading="lazy"
                            className="w-full aspect-square object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.name}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold">₪{product.price}</span>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-[#ED1C24] hover:bg-red-700 text-white"
                          >
                            לקניה &gt;&gt;&gt;
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {productsData && productsData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    הקודם
                  </Button>
                  <span className="flex items-center px-4">
                    עמוד {page} מתוך {productsData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === productsData.totalPages}
                  >
                    הבא
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Free Shipping Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="container text-center">
          <h3 className="text-2xl font-bold mb-4">דואגים לכם למשלוח חינם!</h3>
          <p className="text-lg text-muted-foreground">
            ברכישה מעל 100 ש"ח - משלוח חינם לנקודות האיסוף ברחבי הארץ
          </p>
        </div>
      </section>
    </div>
  );
}
