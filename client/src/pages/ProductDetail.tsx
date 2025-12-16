import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const productId = parseInt(params?.id || "0");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });

  if (isLoading) {
    return <div className="container p-8">טוען...</div>;
  }

  if (!product) {
    return <div className="container p-8">מוצר לא נמצא</div>;
  }

  const images = JSON.parse(product.images as string);

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`הוספת ${quantity} פריטים לעגלה`);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto py-8 px-4">
        <Link href="/shop">
          <Button variant="outline" className="mb-6">← חזרה לחנות</Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <img
              src={images[0]}
              alt={product.name}
              className="w-full rounded-lg shadow-lg mb-4"
            />
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 2}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-4xl font-bold text-[#ED1C24] mb-6">₪{product.price}</p>

            {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
              <p className="text-gray-500 line-through mb-4">₪{product.compareAtPrice}</p>
            )}

            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stockQuantity > 0 ? (
                <p className="text-green-600">במלאי ({product.stockQuantity} יחידות)</p>
              ) : (
                <p className="text-red-600 font-bold">אזל מהמלאי</p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stockQuantity > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="font-bold">כמות:</label>
                    <Input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="ml-2" />
                    הוסף לעגלה
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Product Info */}
            <div className="border-t pt-6">
              <h3 className="font-bold mb-4">פרטים נוספים</h3>
              <div className="space-y-2 text-sm">
                {product.sku && <p><strong>מק"ט:</strong> {product.sku}</p>}
                {product.category && <p><strong>קטגוריה:</strong> {product.category}</p>}
                {product.weight && <p><strong>משקל:</strong> {product.weight} ק"ג</p>}
                {product.dimensions && <p><strong>מידות:</strong> {product.dimensions}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
