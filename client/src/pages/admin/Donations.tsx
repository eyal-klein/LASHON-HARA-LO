import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export default function AdminDonations() {
  const [page, setPage] = useState(1);
  
  const { data: donationsData, isLoading } = trpc.donations.list.useQuery({
    page,
    limit: 20,
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL");
  };

  const totalAmount = donationsData?.items.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ניהול תרומות</h1>
          <p className="text-muted-foreground mt-2">
            צפה בכל התרומות שהתקבלו
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">סה"כ תרומות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donationsData?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">סכום כולל</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₪{totalAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">תרומה ממוצעת</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₪{donationsData?.total ? (totalAmount / donationsData.total).toFixed(0) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>רשימת תרומות</CardTitle>
            <CardDescription>
              {donationsData?.total || 0} תרומות בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">טוען...</div>
            ) : donationsData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">אין תרומות להצגה</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead>סכום</TableHead>
                    <TableHead>סוג</TableHead>
                    <TableHead>תאריך</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationsData?.items.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">
                        {donation.donorName || "אנונימי"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {donation.email || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          ₪{Number(donation.amount).toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {donation.donationType === "one-time" ? "חד פעמי" : "חודשי"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(donation.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {donationsData && donationsData.total > 20 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 20) + 1} - {Math.min(page * 20, donationsData.total)} מתוך {donationsData.total}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    הקודם
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * 20 >= donationsData.total}>
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
