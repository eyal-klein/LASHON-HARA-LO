import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminActivities() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: activitiesData, isLoading } = trpc.activities.list.useQuery({
    page,
    limit: 20,
  });

  const deleteMutation = trpc.activities.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "הפעילות נמחקה בהצלחה",
      });
      utils.activities.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "שגיאה",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`האם אתה בטוח שברצונך למחוק את "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("he-IL");
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ניהול פעילויות</h1>
            <p className="text-muted-foreground mt-2">
              נהל את כל הפעילויות והאירועים
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            הוסף פעילות
          </Button>
        </div>

        {/* Activities Table */}
        <Card>
          <CardHeader>
            <CardTitle>רשימת פעילויות</CardTitle>
            <CardDescription>
              {activitiesData?.total || 0} פעילויות בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                טוען...
              </div>
            ) : activitiesData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                אין פעילויות להצגה
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>כותרת</TableHead>
                      <TableHead>סוג</TableHead>
                      <TableHead>תאריך</TableHead>
                      <TableHead>מיקום</TableHead>
                      <TableHead>משתתפים</TableHead>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activitiesData?.items.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          {activity.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {activity.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(activity.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {activity.location ? (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {activity.location}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {activity.participantCount || 0}
                        </TableCell>
                        <TableCell>
                          {activity.isPublished ? (
                            <Badge variant="default">פעיל</Badge>
                          ) : (
                            <Badge variant="secondary">לא פעיל</Badge>
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
                              onClick={() => handleDelete(activity.id, activity.title)}
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
            {activitiesData && activitiesData.total > 20 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 20) + 1} - {Math.min(page * 20, activitiesData.total)} מתוך {activitiesData.total}
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
                    disabled={page * 20 >= activitiesData.total}
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
