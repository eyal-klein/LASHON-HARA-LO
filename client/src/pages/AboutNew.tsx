import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  Heart, Target, Users, Award, 
  ArrowLeft, CheckCircle2, Quote, Loader2
} from "lucide-react";

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lh-logo.png" alt="לשון הרע לא מדבר אליי" className="h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about-new" className="text-primary font-medium">אודות</Link>
            <Link href="/activities-new" className="text-gray-600 hover:text-primary transition-colors">הפעילות שלנו</Link>
            <Link href="/gallery-new" className="text-gray-600 hover:text-primary transition-colors">גלריה</Link>
            <Link href="/join" className="text-gray-600 hover:text-primary transition-colors">הצטרפו אלינו</Link>
            <Link href="/donate" className="text-gray-600 hover:text-primary transition-colors">תרומה</Link>
            <Link href="/contact-new" className="text-gray-600 hover:text-primary transition-colors">צרו קשר</Link>
            <Link href="/store-new" className="text-gray-600 hover:text-primary transition-colors">חנות</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default function AboutNew() {
  const { data: contentSections, isLoading } = trpc.content.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

      {/* Content Sections from Database */}
      {contentSections && contentSections.length > 0 && (
        <section className="section-padding">
          <div className="container max-w-4xl">
            <div className="space-y-12">
              {contentSections.map((section, index) => (
                <Card key={section.id} className="card-hover">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">
                      {section.title}
                    </h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      {section.body.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="section-padding bg-secondary/30">
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
                  להעלות את המודעות לנזקים הכבדים של לשון הרע ורכילות, 
                  לספק כלים מעשיים להתמודדות עם תופעות אלו, 
                  ולטפח תרבות של כבוד הדדי ושיח בונה בכל רבדי החברה.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            הערכים <span className="text-primary">שלנו</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">כבוד האדם</h3>
                <p className="text-sm text-muted-foreground">
                  אנחנו מאמינים בערך האדם ובזכותו לכבוד ולפרטיות
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">אחריות קהילתית</h3>
                <p className="text-sm text-muted-foreground">
                  כל אחד מאיתנו אחראי על השפעתו על הסביבה
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">מצוינות חינוכית</h3>
                <p className="text-sm text-muted-foreground">
                  פיתוח תכנים איכותיים ומקצועיים להעברת המסר
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              הצטרפו למהפכה של שיח מכבד
            </h2>
            <p className="text-xl mb-8 opacity-90">
              ביחד נוכל ליצור שינוי אמיתי בחברה הישראלית
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/join">
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  הצטרפו כשגרירים
                </button>
              </Link>
              <Link href="/donate">
                <button className="bg-primary-foreground/20 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-foreground/30 transition-colors border-2 border-white">
                  תרמו לעמותה
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
