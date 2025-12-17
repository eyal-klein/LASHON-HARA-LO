import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Image, Calendar, Mail, Handshake, DollarSign, FileText, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: productsStats } = trpc.products.getInventoryStats.useQuery();
  const { data: unreadMessages } = trpc.contact.getUnreadCount.useQuery();
  const { data: pendingPartnerships } = trpc.partnerships.getPendingCount.useQuery();
  const { data: upcomingActivities } = trpc.activities.upcomingCount.useQuery();

  const stats = [
    {
      title: "מוצרים",
      value: productsStats?.totalProducts || 0,
      description: `${productsStats?.publishedProducts || 0} פעילים`,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "הודעות חדשות",
      value: unreadMessages || 0,
      description: "ממתינות לטיפול",
      icon: Mail,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "בקשות שותפות",
      value: pendingPartnerships || 0,
      description: "ממתינות לאישור",
      icon: Handshake,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "פעילויות קרובות",
      value: upcomingActivities || 0,
      description: "בחודש הקרוב",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "מלאי נמוך",
      value: productsStats?.lowStockProducts || 0,
      description: "מוצרים שנגמרים",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "ערך מלאי",
      value: `₪${(productsStats?.totalValue || 0).toLocaleString()}`,
      description: "סה\"כ ערך מוצרים",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">לוח בקרה</h1>
          <p className="text-muted-foreground mt-2">
            סקירה כללית של המערכת
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">פעולות מהירות</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  הוסף מוצר
                </CardTitle>
                <CardDescription>
                  הוסף מוצר חדש לחנות
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  צור פעילות
                </CardTitle>
                <CardDescription>
                  הוסף פעילות או אירוע חדש
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  העלה תמונה
                </CardTitle>
                <CardDescription>
                  הוסף תמונה לגלריה
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  הודעות
                </CardTitle>
                <CardDescription>
                  צפה בהודעות חדשות
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">פעילות אחרונה</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                אין פעילות אחרונה להצגה
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
