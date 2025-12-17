import { Header } from "@/components/Header";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, Clock, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";



export default function ActivitiesNew() {
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const { toast } = useToast();

  const { data: activitiesData, isLoading } = trpc.activities.list.useQuery({
    page: 1,
    limit: 50,
    type: selectedType as any,
    upcoming: showUpcoming,
  });

  const registerMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast({
        title: "נרשמת בהצלחה!",
        description: "נציג יצור איתך קשר בקרוב",
      });
      setRegistrationOpen(false);
      setFormData({ name: "", email: "", phone: "", notes: "" });
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת הטופס",
        variant: "destructive",
      });
    },
  });

  const handleRegister = (activity: any) => {
    setSelectedActivity(activity);
    setRegistrationOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `רישום לפעילות: ${selectedActivity?.title}\n\n${formData.notes}`,
      priority: "normal",
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = (date: string | Date) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-green-600 to-teal-600 text-white py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              הפעילות שלנו
            </h1>
            <p className="text-xl text-green-100">
              אירועים, הרצאות, קמפיינים ופעילויות למען הפצת המודעות לנזקי לשון הרע
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">סינון:</span>
            </div>
            <Button
              variant={!selectedType ? "default" : "outline"}
              onClick={() => setSelectedType(undefined)}
            >
              הכל
            </Button>
            <Button
              variant={selectedType === "lecture" ? "default" : "outline"}
              onClick={() => setSelectedType("lecture")}
            >
              הרצאות
            </Button>
            <Button
              variant={selectedType === "workshop" ? "default" : "outline"}
              onClick={() => setSelectedType("workshop")}
            >
              סדנאות
            </Button>
            <Button
              variant={selectedType === "campaign" ? "default" : "outline"}
              onClick={() => setSelectedType("campaign")}
            >
              קמפיינים
            </Button>
            <Button
              variant={selectedType === "event" ? "default" : "outline"}
              onClick={() => setSelectedType("event")}
            >
              אירועים
            </Button>
            <div className="mr-auto">
              <Button
                variant={showUpcoming ? "default" : "outline"}
                onClick={() => setShowUpcoming(!showUpcoming)}
              >
                <Calendar className="h-4 w-4 ml-2" />
                {showUpcoming ? "פעילויות קרובות" : "כל הפעילויות"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">טוען פעילויות...</p>
            </div>
          ) : activitiesData?.items.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">אין פעילויות להצגה</h3>
              <p className="text-muted-foreground">נסה לשנות את הסינון</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesData?.items.map((activity) => {
                const upcoming = isUpcoming(activity.date);
                return (
                  <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {activity.imageUrl && (
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                        {upcoming && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-green-600">קרוב</Badge>
                          </div>
                        )}
                        {activity.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500">מומלץ</Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-xl">{activity.title}</CardTitle>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {activity.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      {activity.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      {activity.maxParticipants && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>עד {activity.maxParticipants} משתתפים</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {upcoming ? (
                        <Button 
                          className="w-full"
                          onClick={() => handleRegister(activity)}
                        >
                          הירשם עכשיו
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          הסתיים
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>רישום לפעילות</DialogTitle>
            <DialogDescription>
              {selectedActivity?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">שם מלא *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">אימייל *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">טלפון</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">הערות</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegistrationOpen(false)}>
                ביטול
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "שולח..." : "שלח רישום"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">לשון הרע לא מדבר אליי</h3>
              <p className="text-gray-400">
                עמותה ללא מטרות רווח למען הפצת המודעות לנזקי לשון הרע
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">אודות</Link>
                <Link href="/activities-new" className="block text-gray-400 hover:text-white transition-colors">הפעילות שלנו</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">צרו קשר</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">צור קשר</h4>
              <p className="text-gray-400">
                info@lashonhara.co.il
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} לשון הרע לא מדבר אליי. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
