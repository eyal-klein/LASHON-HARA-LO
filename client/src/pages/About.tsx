import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Heart, Target, Users, Award, 
  ArrowLeft, CheckCircle2, Quote
} from "lucide-react";

export default function About() {
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
              אודות <span className="text-primary">העמותה</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              עמותת "לשון הרע לא מדבר אליי" פועלת לקידום תרבות שיח מכבדת וסובלנית בחברה הישראלית, 
              תוך מאבק בתופעות של רכילות, שיימינג ובריונות.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="card-hover border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">החזון שלנו</h2>
                <p className="text-muted-foreground leading-relaxed">
                  חברה ישראלית שבה השיח הציבורי מתנהל בכבוד, סובלנות והקשבה הדדית. 
                  חברה שבה כל אדם מרגיש בטוח להביע את דעתו מבלי לחשוש מביוש או התקפות אישיות.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">המשימה שלנו</h2>
                <p className="text-muted-foreground leading-relaxed">
                  להעלות מודעות לנזקים של לשון הרע ורכילות, לספק כלים מעשיים לשיח מכבד, 
                  ולהוביל שינוי תרבותי דרך חינוך, הסברה ופעילות קהילתית.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">הערכים שלנו</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Heart, title: "אהבת חינם", desc: "לאהוב כל אדם ללא תנאי" },
              { icon: Users, title: "אחריות חברתית", desc: "כל אחד אחראי לשיח" },
              { icon: CheckCircle2, title: "יושרה", desc: "לדבר אמת בדרכי נועם" },
              { icon: Award, title: "מצוינות", desc: "לשאוף לשיפור מתמיד" },
            ].map((value, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-6">
                  <value.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-padding bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-12 w-12 mx-auto mb-6 opacity-50" />
            <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
              "מוות וחיים ביד הלשון"
            </blockquote>
            <cite className="text-lg opacity-80">— משלי י"ח, כ"א</cite>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">הסיפור שלנו</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6 leading-relaxed">
                העמותה נוסדה מתוך הבנה עמוקה שהשיח הציבורי בישראל זקוק לשינוי. 
                בעידן הרשתות החברתיות, תופעות של שיימינג, בריונות מקוונת ולשון הרע הפכו לנפוצות יותר מאי פעם.
              </p>
              <p className="mb-6 leading-relaxed">
                החלטנו לפעול. התחלנו עם קמפיין פשוט - לבקש מאנשים להתחייב לשמור על שיח מכבד. 
                התגובה הייתה מדהימה. אלפי אנשים הצטרפו, ומאז הפעילות רק גדלה.
              </p>
              <p className="leading-relaxed">
                היום אנחנו פועלים בבתי ספר, בקהילות, ברשתות החברתיות ובמרחב הציבורי. 
                עם למעלה מ-50,000 מתחייבים ומאות שגרירים, אנחנו מובילים את השינוי.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">רוצים להצטרף למהפכה?</h2>
            <p className="text-muted-foreground mb-8">
              כל אחד יכול להיות חלק מהשינוי. הצטרפו אלינו והתחייבו לשיח מכבד.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#commitment">
                <Button size="lg" className="btn-brand">
                  אני מצטרף להתחייבות
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/join">
                <Button size="lg" variant="outline" className="btn-brand-outline">
                  דרכים נוספות להשתתף
                </Button>
              </Link>
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
