import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const { data: products } = trpc.products.listAll.useQuery({ page, limit: 20 });
  const { data: stats } = trpc.products.getInventoryStats.useQuery();

  return (
    <div className="container p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">ניהול מוצרים</h1>
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.totalProducts}</p><p>סה"כ מוצרים</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.publishedProducts}</p><p>פורסמו</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.lowStockProducts}</p><p>מלאי נמוך</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.outOfStockProducts}</p><p>אזל מהמלאי</p></CardContent></Card>
        </div>
      )}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Button>הוסף מוצר חדש</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>מחיר</TableHead>
                <TableHead>מלאי</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>₪{product.price}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">ערוך</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
