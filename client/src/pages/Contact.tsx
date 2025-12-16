import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Mail, Phone, MapPin, Clock, 
  Send, CheckCircle2, Facebook, Instagram
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "אירעה שגיאה, נסה שוב");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            <Link href="/">
              <span className="text-xl font-bold">
                לשון הרע <span className="text-primary">לא מדבר</span> אליי
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">חזרה לדף הבית</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              צרו <span className="text-primary">קשר</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              יש לכם שאלה? רוצים לשתף פעולה? נשמח לשמוע מכם!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">פרטי התקשרות</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">אימייל</h3>
                      <a href="mailto:info@lashonhara.org.il" className="text-primary hover:underline">
                        info@lashonhara.org.il
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">טלפון</h3>
                      <a href="tel:+972-3-1234567" className="text-primary hover:underline">
                        03-1234567
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">כתובת</h3>
                      <p className="text-muted-foreground">תל אביב, ישראל</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">שעות פעילות</h3>
                      <p className="text-muted-foreground">א'-ה' 09:00-17:00</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">עקבו אחרינו</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com/lashonhara" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/lashonhara" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>שלחו לנו הודעה</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">ההודעה נשלחה בהצלחה!</h3>
                      <p className="text-muted-foreground mb-6">
                        תודה שפנית אלינו. ניצור איתך קשר בהקדם.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        שליחת הודעה נוספת
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">שם מלא *</label>
                          <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="השם שלך"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">אימייל *</label>
                          <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">טלפון</label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="050-1234567"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">נושא *</label>
                          <Input
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="במה נוכל לעזור?"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">הודעה *</label>
                        <Textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="כתבו את ההודעה שלכם..."
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full btn-brand"
                        disabled={submitContact.isPending}
                      >
                        {submitContact.isPending ? (
                          "שולח..."
                        ) : (
                          <>
                            שליחה
                            <Send className="mr-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container text-center">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} עמותת "לשון הרע לא מדבר אליי" (ע.ר.)
          </p>
        </div>
      </footer>
    </div>
  );
}
