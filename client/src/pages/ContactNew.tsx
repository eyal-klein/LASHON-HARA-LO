import { Header } from "@/components/Header";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";



export default function ContactNew() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
  });

  const { toast } = useToast();

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "ההודעה נשלחה בהצלחה!",
        description: "ניצור איתך קשר בהקדם האפשרי",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        priority: "normal",
      });
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת ההודעה. נסה שוב.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `נושא: ${formData.subject}\n\n${formData.message}`,
      priority: formData.priority,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header />
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">תודה שפנית אלינו!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              קיבלנו את הודעתך וניצור איתך קשר בהקדם האפשרי
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setSubmitted(false)}>
                שלח הודעה נוספת
              </Button>
              <Link href="/">
                <Button variant="outline">חזור לדף הבית</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              צרו קשר
            </h1>
            <p className="text-xl text-blue-100">
              נשמח לשמוע ממך! פנה אלינו בכל שאלה, הצעה או בקשה
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>אימייל</CardTitle>
                      <CardDescription>info@lashonhara.co.il</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>טלפון</CardTitle>
                      <CardDescription>050-123-4567</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>כתובת</CardTitle>
                      <CardDescription>ירושלים, ישראל</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>שעות פעילות</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    ראשון - חמישי: 9:00 - 17:00
                    <br />
                    שישי: 9:00 - 13:00
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">שלח הודעה</CardTitle>
                  <CardDescription>
                    מלא את הטופס ונחזור אליך בהקדם
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">שם מלא *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="הכנס את שמך המלא"
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
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">טלפון</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="050-123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">דחיפות</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">נמוכה</SelectItem>
                            <SelectItem value="normal">רגילה</SelectItem>
                            <SelectItem value="high">גבוהה</SelectItem>
                            <SelectItem value="urgent">דחוף</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">נושא *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="על מה תרצה לדבר?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">הודעה *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        placeholder="כתוב את הודעתך כאן..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        "שולח..."
                      ) : (
                        <>
                          <Send className="h-5 w-5 ml-2" />
                          שלח הודעה
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

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
                <Link href="/gallery-new" className="block text-gray-400 hover:text-white transition-colors">גלריה</Link>
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
