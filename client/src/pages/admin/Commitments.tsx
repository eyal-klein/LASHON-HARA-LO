import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function AdminCommitments() {
  const [page, setPage] = useState(1);
  
  const { data: commitmentsData, isLoading } = trpc.commitments.list.useQuery({
    page,
    limit: 20,
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL");
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ניהול התחייבויות</h1>
          <p className="text-muted-foreground mt-2">
            צפה בכל ההתחייבויות שהתקבלו
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">סה"כ התחייבויות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{commitmentsData?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">התחייבויות השבוע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {commitmentsData?.items.filter(c => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(c.createdAt) > weekAgo;
                }).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>רשימת התחייבויות</CardTitle>
            <CardDescription>
              {commitmentsData?.total || 0} התחייבויות בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">טוען...</div>
            ) : commitmentsData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">אין התחייבויות להצגה</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead>טלפון</TableHead>
                    <TableHead>התחייבות</TableHead>
                    <TableHead>תאריך</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commitmentsData?.items.map((commitment) => (
                    <TableRow key={commitment.id}>
                      <TableCell className="font-medium">
                        {commitment.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {commitment.email || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {commitment.phone || "-"}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm line-clamp-2">
                          {commitment.commitment}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(commitment.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {commitmentsData && commitmentsData.total > 20 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 20) + 1} - {Math.min(page * 20, commitmentsData.total)} מתוך {commitmentsData.total}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    הקודם
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * 20 >= commitmentsData.total}>
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
