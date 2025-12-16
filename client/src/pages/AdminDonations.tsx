import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDonations() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: donations, isLoading } = trpc.donations.list.useQuery({
    page,
    limit: 20,
    startDate,
    endDate,
  });

  const { data: stats } = trpc.donations.getStats.useQuery({
    startDate,
    endDate,
  });

  const refundMutation = trpc.donations.refund.useMutation();

  const handleRefund = async (donationId: number) => {
    if (!confirm("האם אתה בטוח שברצונך להחזיר תרומה זו?")) return;
    
    try {
      await refundMutation.mutateAsync({
        donationId,
        reason: "החזר על פי בקשת לקוח",
      });
      alert("התרומה הוחזרה בהצלחה");
    } catch (error) {
      alert("שגיאה בהחזר התרומה");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      refunded: "destructive",
    };
    const labels: Record<string, string> = {
      completed: "הושלם",
      pending: "ממתין",
      refunded: "הוחזר",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">ניהול תרומות</h1>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>סה"כ תרומות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalDonations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>סה"כ סכום</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₪{stats.totalAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ממוצע תרומה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₪{stats.averageAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>תרומות חודשיות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.monthlyDonations}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              type="date"
              placeholder="מתאריך"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="עד תאריך"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={() => { setStartDate(""); setEndDate(""); }}>
              נקה
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p>טוען...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תאריך</TableHead>
                  <TableHead>תורם</TableHead>
                  <TableHead>סכום</TableHead>
                  <TableHead>תדירות</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations?.items.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      {new Date(donation.createdAt!).toLocaleDateString("he-IL")}
                    </TableCell>
                    <TableCell>{donation.donorName || "אנונימי"}</TableCell>
                    <TableCell>
                      {donation.amount} {donation.currency}
                    </TableCell>
                    <TableCell>
                      {donation.frequency === "one_time" ? "חד פעמי" : "חודשי"}
                    </TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell>
                      {donation.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(donation.id)}
                        >
                          החזר
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {donations && donations.total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                הקודם
              </Button>
              <span className="py-2 px-4">
                עמוד {page} מתוך {Math.ceil(donations.total / 20)}
              </span>
              <Button
                disabled={page >= Math.ceil(donations.total / 20)}
                onClick={() => setPage(page + 1)}
              >
                הבא
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
