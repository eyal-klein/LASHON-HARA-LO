import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Archive, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMessages() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: messagesData, isLoading } = trpc.contact.list.useQuery({
    page,
    limit: 20,
    unreadOnly,
  });

  const { data: unreadCount } = trpc.contact.getUnreadCount.useQuery();

  const markAsReadMutation = trpc.contact.markAsRead.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "ההודעה סומנה כנקראה",
      });
      utils.contact.list.invalidate();
      utils.contact.getUnreadCount.invalidate();
    },
  });

  const archiveMutation = trpc.contact.archive.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "ההודעה הועברה לארכיון",
      });
      utils.contact.list.invalidate();
    },
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "ההודעה נמחקה בהצלחה",
      });
      utils.contact.list.invalidate();
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">דחוף</Badge>;
      case "medium":
        return <Badge variant="default">בינוני</Badge>;
      case "low":
        return <Badge variant="secondary">נמוך</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ניהול הודעות</h1>
            <p className="text-muted-foreground mt-2">
              נהל הודעות צור קשר מהמשתמשים
            </p>
          </div>
          <Badge variant="default" className="text-lg px-4 py-2">
            {unreadCount || 0} הודעות חדשות
          </Badge>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={!unreadOnly ? "default" : "outline"}
                onClick={() => setUnreadOnly(false)}
              >
                הכל
              </Button>
              <Button
                variant={unreadOnly ? "default" : "outline"}
                onClick={() => setUnreadOnly(true)}
              >
                <Mail className="h-4 w-4 ml-2" />
                לא נקראו
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>הודעות</CardTitle>
            <CardDescription>
              {messagesData?.total || 0} הודעות בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                טוען...
              </div>
            ) : messagesData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                אין הודעות להצגה
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>סטטוס</TableHead>
                      <TableHead>שם</TableHead>
                      <TableHead>אימייל</TableHead>
                      <TableHead>הודעה</TableHead>
                      <TableHead>עדיפות</TableHead>
                      <TableHead>תאריך</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messagesData?.items.map((message) => (
                      <TableRow
                        key={message.id}
                        className={!message.isRead ? "bg-blue-50/50" : ""}
                      >
                        <TableCell>
                          {!message.isRead ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {message.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {message.email}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm line-clamp-2">
                            {message.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(message.priority || "low")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!message.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsReadMutation.mutate({ id: message.id })}
                                disabled={markAsReadMutation.isPending}
                              >
                                <MailOpen className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => archiveMutation.mutate({ id: message.id })}
                              disabled={archiveMutation.isPending}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMutation.mutate({ id: message.id })}
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
            {messagesData && messagesData.total > 20 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 20) + 1} - {Math.min(page * 20, messagesData.total)} מתוך {messagesData.total}
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
                    disabled={page * 20 >= messagesData.total}
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
