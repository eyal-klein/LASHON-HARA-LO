import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";

export function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, closeCart, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">סל הקניות</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">הסל ריק</p>
              <p className="text-sm text-muted-foreground mt-2">הוסיפו מוצרים מהחנות</p>
              <Link href="/store">
                <Button className="mt-6" onClick={closeCart}>
                  לחנות
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-primary font-bold">₪{item.price.toFixed(2)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mr-auto text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">סה"כ:</span>
              <span className="text-2xl font-bold text-primary">₪{totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button className="w-full" size="lg" onClick={closeCart}>
                המשך לתשלום ({totalItems} פריטים)
              </Button>
            </Link>

            <Link href="/store">
              <Button variant="outline" className="w-full" onClick={closeCart}>
                המשך בקניות
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
