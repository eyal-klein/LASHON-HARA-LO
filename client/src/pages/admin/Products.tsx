import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: productsData, isLoading } = trpc.products.listAll.useQuery({
    page,
    limit: 20,
  });

  const { data: stats } = trpc.products.getInventoryStats.useQuery();

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "המוצר נמחק בהצלחה",
      });
      utils.products.listAll.invalidate();
      utils.products.getInventoryStats.invalidate();
    },
    onError: (error) => {
      toast({
        title: "שגיאה",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את "${name}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ניהול מוצרים</h1>
            <p className="text-muted-foreground mt-2">
              נהל את כל המוצרים בחנות
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            הוסף מוצר
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">סה"כ מוצרים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">מוצרים פעילים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.publishedProducts || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">מלאי נמוך</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats?.lowStockProducts || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">אזל מהמלאי</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats?.outOfStockProducts || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>חיפוש וסינון</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש מוצר..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>רשימת מוצרים</CardTitle>
            <CardDescription>
              {productsData?.total || 0} מוצרים בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                טוען...
              </div>
            ) : productsData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                אין מוצרים להצגה
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>תמונה</TableHead>
                      <TableHead>שם</TableHead>
                      <TableHead>מחיר</TableHead>
                      <TableHead>מלאי</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsData?.items.map((product) => {
                      const images = typeof product.images === 'string' 
                        ? JSON.parse(product.images) 
                        : product.images;
                      const firstImage = Array.isArray(images) ? images[0] : null;
                      const stockQuantity = Number(product.stockQuantity) || 0;
                      const lowThreshold = Number(product.lowStockThreshold) || 5;

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                                אין תמונה
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            ₪{Number(product.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                stockQuantity === 0
                                  ? "destructive"
                                  : stockQuantity <= lowThreshold
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {stockQuantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.isPublished ? (
                              <Badge variant="default" className="gap-1">
                                <Eye className="h-3 w-3" />
                                פעיל
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <EyeOff className="h-3 w-3" />
                                לא פעיל
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast({ title: "בקרוב", description: "עריכה תהיה זמינה בקרוב" })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id, product.name)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {productsData && productsData.total > 20 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 20) + 1} - {Math.min(page * 20, productsData.total)} מתוך {productsData.total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    הקודם
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * 20 >= productsData.total}
                  >
                    הבא
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
