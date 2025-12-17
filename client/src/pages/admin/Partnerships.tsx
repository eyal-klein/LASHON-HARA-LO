import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPartnerships() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: partnershipsData, isLoading } = trpc.partnerships.list.useQuery({
    page,
    limit: 20,
  });

  const { data: pendingCount } = trpc.partnerships.getPendingCount.useQuery();

  const updateStatusMutation = trpc.partnerships.updateStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "הסטטוס עודכן בהצלחה",
      });
      utils.partnerships.list.invalidate();
      utils.partnerships.getPendingCount.invalidate();
    },
  });

  const deleteMutation = trpc.partnerships.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "הבקשה נמחקה בהצלחה",
      });
      utils.partnerships.list.invalidate();
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-600">אושר</Badge>;
      case "rejected":
        return <Badge variant="destructive">נדחה</Badge>;
      case "pending":
        return <Badge variant="secondary">ממתין</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ניהול שותפויות</h1>
            <p className="text-muted-foreground mt-2">
              נהל בקשות שותפות מארגונים ועסקים
            </p>
          </div>
          <Badge variant="default" className="text-lg px-4 py-2">
            {pendingCount || 0} בקשות ממתינות
          </Badge>
        </div>

        {/* Partnerships Table */}
        <Card>
          <CardHeader>
            <CardTitle>בקשות שותפות</CardTitle>
            <CardDescription>
              {partnershipsData?.total || 0} בקשות בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                טוען...
              </div>
            ) : partnershipsData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                אין בקשות להצגה
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ארגון</TableHead>
                      <TableHead>איש קשר</TableHead>
                      <TableHead>אימייל</TableHead>
                      <TableHead>טלפון</TableHead>
                      <TableHead>סוג</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>תאריך</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnershipsData?.items.map((partnership) => (
                      <TableRow key={partnership.id}>
                        <TableCell className="font-medium">
                          {partnership.organizationName}
                        </TableCell>
                        <TableCell>
                          {partnership.contactName}
                        </TableCell>
                        <TableCell className="text-sm">
                          {partnership.email}
                        </TableCell>
                        <TableCell className="text-sm">
                          {partnership.phone || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {partnership.partnershipType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(partnership.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(partnership.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {partnership.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: partnership.id,
                                      status: "approved",
                                    })
                                  }
                                  disabled={updateStatusMutation.isPending}
                                  className="text-green-600"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: partnership.id,
                                      status: "rejected",
                                    })
                                  }
                                  disabled={updateStatusMutation.isPending}
                                  className="text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMutation.mutate({ id: partnership.id })}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {partnershipsData && partnershipsData.total > 20 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 20) + 1} - {Math.min(page * 20, partnershipsData.total)} מתוך {partnershipsData.total}
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
                    disabled={page * 20 >= partnershipsData.total}
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
