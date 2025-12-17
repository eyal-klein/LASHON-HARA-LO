import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Mail, 
  Handshake,
  Image,
  Calendar,
  LogOut,
  RefreshCw,
  Download,
  MoreHorizontal,
  Eye,
  Trash2,
  Home
} from "lucide-react";
import { Link } from "wouter";

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  value: string | number; 
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Commitments Tab
function CommitmentsTab() {
  const { data: stats } = trpc.commitments.stats.useQuery();
  const { data: recent, isLoading } = trpc.commitments.recent.useQuery({ limit: 20 });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="סה״כ התחייבויות" 
          value={stats?.totalCommitments?.toLocaleString() || "0"} 
          icon={Heart}
        />
        <StatsCard 
          title="היום" 
          value={stats?.todayCommitments || 0} 
          icon={Calendar}
        />
        <StatsCard 
          title="השבוע" 
          value={stats?.weekCommitments || 0} 
          icon={Calendar}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>התחייבויות אחרונות</CardTitle>
          <CardDescription>20 ההתחייבויות האחרונות שנרשמו</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">טוען...</div>
          ) : recent && recent.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">מקור</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("he-IL") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.source || "website"}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">אין התחייבויות עדיין</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Subscribers Tab
function SubscribersTab() {
  const { data: count } = trpc.subscribers.count.useQuery();
  const { data: subscribers, isLoading } = trpc.subscribers.list.useQuery({ limit: 20 });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard 
          title="מנויים פעילים" 
          value={count || 0} 
          icon={Mail}
        />
        <StatsCard 
          title="סה״כ נרשמו" 
          value={subscribers?.length || 0} 
          description="ב-20 האחרונים"
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>רשימת מנויים</CardTitle>
            <CardDescription>מנויי הניוזלטר</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            ייצוא CSV
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">טוען...</div>
          ) : subscribers && subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">אימייל</TableHead>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">תאריך הרשמה</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell>{sub.firstName || "-"} {sub.lastName || ""}</TableCell>
                    <TableCell>
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("he-IL") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.isActive ? "default" : "secondary"}>
                        {sub.isActive ? "פעיל" : "לא פעיל"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">אין מנויים עדיין</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Contact Messages Tab
function ContactTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>הודעות יצירת קשר</CardTitle>
          <CardDescription>הודעות שנשלחו דרך טופס יצירת קשר</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>אין הודעות חדשות</p>
            <p className="text-sm">הודעות חדשות יופיעו כאן</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Partnerships Tab
function PartnershipsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>בקשות שותפות</CardTitle>
          <CardDescription>בקשות הצטרפות לתוכניות השותפות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Handshake className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>אין בקשות חדשות</p>
            <p className="text-sm">בקשות שותפות יופיעו כאן</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Gallery Management Tab
function GalleryTab() {
  const { data: categories } = trpc.gallery.categories.useQuery();
  const { data: items, isLoading } = trpc.gallery.list.useQuery({ limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">ניהול גלריה</h3>
          <p className="text-sm text-muted-foreground">הוספה ועריכה של תמונות</p>
        </div>
        <Button>
          <Image className="h-4 w-4 ml-2" />
          הוסף תמונה
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {categories?.map((cat) => (
          <StatsCard 
            key={cat.category}
            title={cat.category} 
            value={cat.count} 
            icon={Image}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>תמונות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">טוען...</div>
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {items.slice(0, 8).map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין תמונות בגלריה</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Activities Management Tab
function ActivitiesTab() {
  const { data: upcomingCount } = trpc.activities.upcomingCount.useQuery();
  const { data: activities, isLoading } = trpc.activities.list.useQuery({ limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">ניהול פעילויות</h3>
          <p className="text-sm text-muted-foreground">הוספה ועריכה של פעילויות</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 ml-2" />
          הוסף פעילות
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard 
          title="פעילויות קרובות" 
          value={upcomingCount || 0} 
          icon={Calendar}
        />
        <StatsCard 
          title="סה״כ פעילויות" 
          value={activities?.length || 0} 
          icon={Calendar}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פעילויות</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">טוען...</div>
          ) : activities && activities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">כותרת</TableHead>
                  <TableHead className="text-right">סוג</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">מיקום</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.activityType}</Badge>
                    </TableCell>
                    <TableCell>
                      {activity.startDate ? new Date(activity.startDate).toLocaleDateString("he-IL") : "-"}
                    </TableCell>
                    <TableCell>{activity.location || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 ml-2" />
                            צפייה
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 ml-2" />
                            מחיקה
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין פעילויות</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Admin Dashboard
export default function Admin() {
  const { loading, user, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ממשק ניהול</CardTitle>
            <CardDescription>התחבר כדי לגשת לממשק הניהול</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              size="lg"
              className="w-full bg-primary"
            >
              התחברות
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 ml-2" />
                חזרה לאתר
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 ml-2" />
                  חזרה לאתר
                </Button>
              </Link>
              <h1 className="text-xl font-bold">ממשק ניהול</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 ml-2" />
                התנתקות
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs defaultValue="commitments" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 bg-transparent justify-start">
            <TabsTrigger value="commitments" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Heart className="h-4 w-4 ml-2" />
              התחייבויות
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Mail className="h-4 w-4 ml-2" />
              מנויים
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="h-4 w-4 ml-2" />
              הודעות
            </TabsTrigger>
            <TabsTrigger value="partnerships" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Handshake className="h-4 w-4 ml-2" />
              שותפויות
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Image className="h-4 w-4 ml-2" />
              גלריה
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Calendar className="h-4 w-4 ml-2" />
              פעילויות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commitments">
            <CommitmentsTab />
          </TabsContent>
          <TabsContent value="subscribers">
            <SubscribersTab />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTab />
          </TabsContent>
          <TabsContent value="partnerships">
            <PartnershipsTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="activities">
            <ActivitiesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
