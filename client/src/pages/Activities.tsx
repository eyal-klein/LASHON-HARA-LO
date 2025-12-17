import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  BookOpen, 
  Megaphone, 
  Package,
  Clock,
  ExternalLink
} from "lucide-react";

// Header component
function Header() {
  return (
    <Navigation />
  );
}

// Activity type icons and names
const activityTypeConfig: Record<string, { icon: React.ReactNode; name: string; color: string }> = {
  workshop: { icon: <BookOpen className="w-5 h-5" />, name: "סדנה", color: "bg-blue-100 text-blue-800" },
  distribution: { icon: <Package className="w-5 h-5" />, name: "חלוקה", color: "bg-green-100 text-green-800" },
  lecture: { icon: <Users className="w-5 h-5" />, name: "הרצאה", color: "bg-purple-100 text-purple-800" },
  campaign: { icon: <Megaphone className="w-5 h-5" />, name: "קמפיין", color: "bg-orange-100 text-orange-800" },
  event: { icon: <Calendar className="w-5 h-5" />, name: "אירוע", color: "bg-pink-100 text-pink-800" },
  other: { icon: <Calendar className="w-5 h-5" />, name: "אחר", color: "bg-gray-100 text-gray-800" },
};

export default function Activities() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { data: activities, isLoading } = trpc.activities.list.useQuery({
    activityType: selectedType === "all" ? undefined : selectedType as any,
    upcoming: showUpcoming,
    limit: 50,
  });

  const { data: upcomingCount } = trpc.activities.upcomingCount.useQuery();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("he-IL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (date: Date | string) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            הפעילות שלנו
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            סדנאות, הרצאות, חלוקות ואירועים ברחבי הארץ
          </p>
          {upcomingCount !== undefined && upcomingCount > 0 && (
            <Badge className="bg-primary text-white text-lg px-4 py-2">
              {upcomingCount} פעילויות קרובות
            </Badge>
          )}
        </div>
      </section>

      {/* Activities Content */}
      <section className="py-12">
        <div className="container">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            {/* Type Filter */}
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="flex flex-wrap gap-2 bg-transparent">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-full"
                >
                  הכל
                </TabsTrigger>
                {Object.entries(activityTypeConfig).map(([key, config]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    {config.icon}
                    {config.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Time Filter */}
            <div className="flex gap-2">
              <Button
                variant={showUpcoming ? "default" : "outline"}
                onClick={() => setShowUpcoming(true)}
                className={showUpcoming ? "bg-primary" : ""}
              >
                פעילויות קרובות
              </Button>
              <Button
                variant={!showUpcoming ? "default" : "outline"}
                onClick={() => setShowUpcoming(false)}
                className={!showUpcoming ? "bg-primary" : ""}
              >
                כל הפעילויות
              </Button>
            </div>
          </div>

          {/* Activities Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const config = activityTypeConfig[activity.type] || activityTypeConfig.other;
                const upcoming = activity.date ? isUpcoming(activity.date) : false;
                
                return (
                  <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {activity.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={config.color}>
                          {config.icon}
                          <span className="mr-1">{config.name}</span>
                        </Badge>
                        {upcoming && (
                          <Badge className="bg-green-500 text-white">קרוב</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{activity.title}</CardTitle>
                      {activity.description && (
                        <CardDescription className="line-clamp-2">
                          {activity.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        {activity.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDate(activity.date)}</span>
                          </div>
                        )}
                        {activity.date && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{formatTime(activity.date)}</span>
                          </div>
                        )}
                        {activity.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                        {activity.participantCount && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span>
                              {activity.participantCount || 0}/{activity.participantCount} משתתפים
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {activity.location && upcoming && (
                        <a
                          href={activity.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 block"
                        >
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            להרשמה
                            <ExternalLink className="mr-2 h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {showUpcoming ? "אין פעילויות קרובות" : "אין פעילויות"}
              </h3>
              <p className="text-gray-500">
                {showUpcoming 
                  ? "פעילויות חדשות יתווספו בקרוב" 
                  : "עדיין לא נוספו פעילויות"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            רוצים לארח פעילות?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            אנחנו מגיעים לבתי ספר, קהילות וארגונים ברחבי הארץ
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              צרו קשר
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} לשון הרע לא מדבר אליי. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
