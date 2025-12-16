import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Users, Heart, School, Sparkles,
  CheckCircle2, ArrowLeft
} from "lucide-react";

type PartnershipType = "ambassador" | "financial" | "school" | "inspiration";

const partnershipInfo = {
  ambassador: {
    icon: Users,
    title: "שגרירים",
    color: "bg-blue-500",
    description: "הצטרפו לנבחרת השגרירים שלנו! עזרו בחלוקות מוצרים, הפצת המסר ברשתות החברתיות, והובילו את השינוי בקהילה שלכם.",
    benefits: [
      "הכשרה מקצועית",
      "ערכת שגריר מלאה",
      "חברות בקהילת השגרירים",
      "הכרה ותעודת הוקרה",
    ],
  },
  financial: {
    icon: Heart,
    title: "תמיכה כספית",
    color: "bg-pink-500",
    description: "תרומתכם מאפשרת לנו להמשיך ולפעול. כל שקל עוזר להפיץ את המסר לעוד בתי ספר, קהילות ואנשים.",
    benefits: [
      "קבלה לצורכי מס",
      "דיווח שקוף על השימוש בכספים",
      "הזמנה לאירועים מיוחדים",
      "הכרה באתר ובפרסומים",
    ],
  },
  school: {
    icon: School,
    title: "בתי ספר",
    color: "bg-green-500",
    description: "הביאו את התוכנית החינוכית שלנו לבית הספר שלכם. סדנאות, הרצאות וחומרי לימוד מותאמים לכל גיל.",
    benefits: [
      "תוכנית מותאמת לגיל",
      "חומרי לימוד מקצועיים",
      "הדרכה למורים",
      "ליווי לאורך השנה",
    ],
  },
  inspiration: {
    icon: Sparkles,
    title: "השראה",
    color: "bg-purple-500",
    description: "יש לכם סיפור מעורר השראה? חוויתם את הנזק של לשון הרע או הצלחתם לשנות? שתפו ועזרו לאחרים.",
    benefits: [
      "במה לשתף את הסיפור",
      "השפעה על אחרים",
      "חלק מקמפיינים",
      "הנצחת המסר",
    ],
  },
};

export default function Join() {
  const [selectedType, setSelectedType] = useState<PartnershipType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitPartnership = trpc.partnerships.submit.useMutation({
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
    if (!selectedType) return;
    
    submitPartnership.mutate({
      type: selectedType,
      ...formData,
    });
  };

  const resetForm = () => {
    setSelectedType(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      message: "",
    });
    setIsSubmitted(false);
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
              הצטרפו <span className="text-primary">אלינו</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              יש הרבה דרכים להיות חלק מהשינוי. בחרו את הדרך שמתאימה לכם.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      {!selectedType && !isSubmitted && (
        <section className="section-padding">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {(Object.keys(partnershipInfo) as PartnershipType[]).map((type) => {
                const info = partnershipInfo[type];
                const Icon = info.icon;
                return (
                  <Card 
                    key={type} 
                    className="card-hover cursor-pointer group"
                    onClick={() => setSelectedType(type)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle>{info.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center mb-4">
                        {info.description.substring(0, 100)}...
                      </CardDescription>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                        בחרו
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Selected Type Form */}
      {selectedType && !isSubmitted && (
        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Button 
                variant="ghost" 
                className="mb-6"
                onClick={() => setSelectedType(null)}
              >
                ← חזרה לבחירת סוג שותפות
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${partnershipInfo[selectedType].color} rounded-full flex items-center justify-center text-white`}>
                      {(() => {
                        const Icon = partnershipInfo[selectedType].icon;
                        return <Icon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <CardTitle>{partnershipInfo[selectedType].title}</CardTitle>
                      <CardDescription>מלאו את הפרטים ונחזור אליכם בהקדם</CardDescription>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {partnershipInfo[selectedType].description}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Benefits */}
                  <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">מה תקבלו:</h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {partnershipInfo[selectedType].benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Form */}
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
                        <label className="text-sm font-medium mb-1 block">טלפון *</label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="050-1234567"
                        />
                      </div>
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

                    {(selectedType === "school" || selectedType === "ambassador") && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            {selectedType === "school" ? "שם בית הספר" : "ארגון/מקום עבודה"}
                          </label>
                          <Input
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            placeholder={selectedType === "school" ? "שם בית הספר" : "שם הארגון"}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">תפקיד</label>
                          <Input
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            placeholder="התפקיד שלך"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        {selectedType === "inspiration" ? "ספרו לנו את הסיפור שלכם" : "הערות נוספות"}
                      </label>
                      <Textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={selectedType === "inspiration" 
                          ? "שתפו את הסיפור שלכם..." 
                          : "יש משהו שחשוב לכם שנדע?"}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-brand"
                      disabled={submitPartnership.isPending}
                    >
                      {submitPartnership.isPending ? "שולח..." : "שליחת בקשה"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Success State */}
      {isSubmitted && (
        <section className="section-padding">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">תודה על הפנייה!</h2>
              <p className="text-xl text-muted-foreground mb-8">
                קיבלנו את הבקשה שלכם ונחזור אליכם בהקדם האפשרי.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetForm} variant="outline">
                  שליחת בקשה נוספת
                </Button>
                <Link href="/">
                  <Button className="btn-brand">
                    חזרה לדף הבית
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-auto">
        <div className="container text-center">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} עמותת "לשון הרע לא מדבר אליי" (ע.ר.)
          </p>
        </div>
      </footer>
    </div>
  );
}
