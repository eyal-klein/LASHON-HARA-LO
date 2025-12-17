import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminGallery() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: galleryData, isLoading } = trpc.gallery.list.useQuery({
    page,
    limit: 12,
  });

  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "התמונה נמחקה בהצלחה",
      });
      utils.gallery.list.invalidate();
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

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ניהול גלריה</h1>
            <p className="text-muted-foreground mt-2">
              נהל את תמונות הגלריה
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            הוסף תמונה
          </Button>
        </div>

        {/* Gallery Grid */}
        <Card>
          <CardHeader>
            <CardTitle>גלריה</CardTitle>
            <CardDescription>
              {galleryData?.total || 0} תמונות בסך הכל
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                טוען...
              </div>
            ) : galleryData?.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                אין תמונות להצגה
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryData?.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {item.isPublished ? (
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
                        {item.isFeatured && (
                          <Badge variant="default" className="gap-1 bg-yellow-500">
                            <Star className="h-3 w-3" />
                            מומלץ
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toast({ title: "בקרוב", description: "עריכה תהיה זמינה בקרוב" })}
                        >
                          ערוך
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {galleryData && galleryData.total > 12 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  מציג {((page - 1) * 12) + 1} - {Math.min(page * 12, galleryData.total)} מתוך {galleryData.total}
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
                    disabled={page * 12 >= galleryData.total}
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
