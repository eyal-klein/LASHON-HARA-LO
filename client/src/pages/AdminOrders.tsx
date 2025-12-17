import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const { data: orders } = trpc.orders.list.useQuery({ page, limit: 20 });
  const { data: stats } = trpc.orders.getStats.useQuery({});

  return (
    <div className="container p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">ניהול הזמנות</h1>
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.totalOrders}</p><p>סה"כ הזמנות</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">₪{stats.totalRevenue}</p><p>הכנסות</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.pendingOrders}</p><p>ממתינות</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-2xl font-bold">{stats.shippedOrders}</p><p>נשלחו</p></CardContent></Card>
        </div>
      )}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר הזמנה</TableHead>
                <TableHead>לקוח</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.items.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>₪{order.total}</TableCell>
                  <TableCell><Badge>{order.status}</Badge></TableCell>
                  <TableCell>{new Date(order.createdAt!).toLocaleDateString("he-IL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
