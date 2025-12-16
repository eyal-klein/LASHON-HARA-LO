import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Heart, School, Sparkles, 
  Phone, Mail, CheckCircle2, ArrowLeft,
  Truck, Megaphone, BookOpen, Palette
} from "lucide-react";
import { toast } from "sonner";

// Logo component
function Logo({ className = "" }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="לשון הרע לא מדבר אליי" 
      className={className}
      onError={(e) => {
        // Fallback to text if logo doesn't load
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

// Header/Navigation
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { label: "אודות", href: "/about" },
    { label: "הפעילות שלנו", href: "#activities" },
    { label: "הצטרפו אלינו", href: "/join" },
    { label: "תרומה", href: "/donate" },
    { label: "צרו קשר", href: "/contact" },
    { label: "חנות", href: "https://shop.lashonhara.co.il", external: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Logo className="h-12 md:h-14 w-auto" />
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="תפריט"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-foreground transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-full bg-foreground transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-foreground transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="block py-3 text-foreground/80 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  // Get stats from API
  const { data: stats } = trpc.commitments.stats.useQuery();
  const totalCommitments = stats?.totalCommitments || 50000;
  
  return (
    <section className="relative bg-gradient-to-b from-secondary to-background section-padding overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Logo */}
          <div className="mb-8 animate-fade-in">
            <Logo className="h-24 md:h-32 w-auto mx-auto" />
          </div>
          
          {/* Main Message */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            לשון הרע <span className="text-primary">לא מדבר</span> אליי
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            העמותה מעודדת תרבות שיח חיובית במטרה למגר רכילות, שיימינג ובריונות במרחב הפיזי והמקוון, 
            על מנת ליצור חברה סובלנית ומכבדת יותר.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-brand text-lg"
              onClick={() => document.getElementById('commitment')?.scrollIntoView({ behavior: 'smooth' })}
            >
              אני מצטרף להתחייבות
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="btn-brand-outline text-lg"
              onClick={() => document.getElementById('partnership')?.scrollIntoView({ behavior: 'smooth' })}
            >
              איך אפשר להשתתף?
            </Button>
          </div>
          
          {/* Stats Counter */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary">{totalCommitments.toLocaleString()}+</div>
                <div className="text-muted-foreground mt-1">התחייבויות</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground mt-1">שגרירים</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary">100+</div>
                <div className="text-muted-foreground mt-1">בתי ספר</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// What is Lashon Hara Section
function WhatIsLashonHaraSection() {
  const categories = [
    { icon: "💬", label: "השמצות" },
    { icon: "😂", label: "לעג" },
    { icon: "🗣️", label: "רכילות" },
    { icon: "👥", label: "הכללה" },
    { icon: "😢", label: "ביוש" },
    { icon: "🔥", label: "הסתה" },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מה זה לשון הרע?</h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            דיבור שלילי שנאמר לאחר או על אחר.
          </p>
          
          {/* Quote Box */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 md:p-8 mb-10">
            <p className="text-xl md:text-2xl font-medium text-foreground">
              המבחן לקביעה האם מדובר בלשון הרע הוא:
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary mt-4">
              אם לא הייתם אומרים את זה בפני האדם – 
              <br />
              אל תגידו מאחורי גבו.
            </p>
          </div>
          
          <p className="text-lg text-muted-foreground mb-6">מה נכלל בהגדרה הזאת?</p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.label}
                className="bg-secondary px-4 py-2 rounded-full flex items-center gap-2 text-lg"
              >
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </div>
            ))}
          </div>
          
          <Button 
            variant="link" 
            className="mt-8 text-primary text-lg"
            onClick={() => toast.info("בקרוב - עמוד מידע מלא")}
          >
            אני רוצה לקרוא עוד על הפעילות
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Partnership Cards Section
function PartnershipSection() {
  const partnerships = [
    {
      icon: Users,
      title: "שגרירים",
      description: "אני רוצה להיות בנבחרת השגרירים, לעזור בחלוקות ולנקות את השיח ברשת",
      color: "bg-blue-500",
    },
    {
      icon: Heart,
      title: "תמיכה כספית",
      description: "אני רוצה לתמוך כספית ולסייע בהפצת המסר בבתי ספר",
      color: "bg-pink-500",
    },
    {
      icon: School,
      title: "בית ספר",
      description: "אני נציג של בית הספר ורוצה לאמץ תוכנית חינוכית",
      color: "bg-green-500",
    },
    {
      icon: Sparkles,
      title: "השראה",
      description: "אני רוצה להפיץ השראה באמצעות הסיפור שלי",
      color: "bg-purple-500",
    },
  ];

  return (
    <section id="partnership" className="section-padding bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">איך תרצו להיות שותפים?</h2>
          <p className="text-lg text-muted-foreground">בחרו את הדרך שמתאימה לכם להצטרף למהפכה</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {partnerships.map((item) => (
            <Card 
              key={item.title}
              className="card-hover cursor-pointer group bg-white"
              onClick={() => toast.info(`בקרוב - טופס הצטרפות ל${item.title}`)}
            >
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {item.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  הצטרפו
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Commitment Form Section
function CommitmentSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    receiveUpdates: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get stats from API
  const { data: stats } = trpc.commitments.stats.useQuery();
  
  // Create commitment mutation
  const createCommitment = trpc.commitments.create.useMutation({
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "אירעה שגיאה, נסה שוב");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createCommitment.mutate(formData);
  };
  
  const isSubmitting = createCommitment.isPending;

  if (isSubmitted) {
    return (
      <section id="commitment" className="section-padding bg-primary text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle2 className="h-20 w-20 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">תודה על ההתחייבות!</h2>
            <p className="text-xl opacity-90">
              הצטרפת לאלפי אנשים שמתחייבים לשמור על שיח מכבד. יחד ננקה את החברה שלנו.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="mt-8"
              onClick={() => setIsSubmitted(false)}
            >
              אני רוצה לשתף עוד מישהו
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="commitment" className="section-padding bg-primary text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">השינוי מתחיל בי!</h2>
          </div>
          
          {/* Commitment Text */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 text-lg leading-relaxed">
            <p className="mb-4">
              <strong>אני מתחייב/ת בזאת</strong> להימנע מהפצת לשון הרע ודברי רכילות.
            </p>
            <p className="mb-4">
              <strong>אני מתחייב/ת</strong> לשמור על שיח סובלני ומכבד, לדון בדרכי נועם, להביע התנגדות בצורה עניינית שאינה פוגענית.
            </p>
            <p className="mb-4">
              <strong>אני מתחייב/ת</strong> להפיץ את המסר בסביבתי, לעצור שיחות שעלולות להגיע ללשון הרע, בפני ומאחורי גבו של אחר.
            </p>
            <p>
              <strong>אני מתחייב/ת</strong> לעשות כל שביכולתי כדי לנקות את החברה שלנו מביוש, בריונות, אלימות, הסתה, הכללה והלבנת פנים.
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="שם פרטי"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
                />
              </div>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="מספר טלפון"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
                  dir="ltr"
                />
              </div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="כתובת אימייל"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12 text-lg"
                  dir="ltr"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Checkbox
                id="updates"
                checked={formData.receiveUpdates}
                onCheckedChange={(checked) => setFormData({ ...formData, receiveUpdates: checked as boolean })}
                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <label htmlFor="updates" className="text-white/90 cursor-pointer">
                אני מאשר/ת קבלת מידע ודיוורים מהעמותה
              </label>
            </div>
            
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-white text-primary hover:bg-white/90 text-lg font-bold h-14 px-10"
            >
              {isSubmitting ? "שולח..." : "קבלו את התחייבותי"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Gandhi Quote Section
function GandhiQuoteSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl text-primary/20 mb-4">❝</div>
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-4">
            היה אתה השינוי שאתה רוצה לראות בעולמך
          </blockquote>
          <cite className="text-lg text-muted-foreground">— מהטמה גנדי</cite>
          <div className="text-6xl text-primary/20 mt-4">❞</div>
        </div>
      </div>
    </section>
  );
}

// Activities Section
function ActivitiesSection() {
  const activities = [
    { icon: Truck, title: "חלוקות", description: "הפצת מוצרים עם המסר" },
    { icon: Megaphone, title: "שגרירים", description: "רשת מתנדבים ארצית" },
    { icon: BookOpen, title: "סדנאות חינוכיות", description: "הרצאות בבתי ספר" },
    { icon: Palette, title: "תערוכות וקמפיינים", description: "פעילויות ציבוריות" },
  ];

  return (
    <section id="activities" className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">הפעילות שלנו</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            יחד מחזקים מודעות לשיח מכבד בין אחד לשני, מזכירים שמילים יכולות לפגוע ואף להרוג. 
            מובילים שינוי חברתי דרך חינוך, חלוקת מוצרים עם המסר, ניקיון הרשת החברתית מלשון הרע ועוד.
          </p>
          <p className="text-primary font-medium mt-4">
            בעזרתכם אנחנו מרחיבים את הפעילות ומביאים אותה גם לחו"ל!
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {activities.map((item) => (
            <div key={item.title} className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                <item.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Logo className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-white/70 max-w-md">
              העמותה מעודדת תרבות שיח חיובית במטרה למגר רכילות, שיימינג ובריונות במרחב הפיזי והמקוון.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-white/70 hover:text-white transition-colors">אודות</a></li>
              <li><a href="#activities" className="text-white/70 hover:text-white transition-colors">הפעילות שלנו</a></li>
              <li><a href="#partnership" className="text-white/70 hover:text-white transition-colors">הצטרפו אלינו</a></li>
              <li><a href="#commitment" className="text-white/70 hover:text-white transition-colors">התחייבות</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">צרו קשר</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/70">
                <Phone className="h-4 w-4" />
                <span dir="ltr">03-1234567</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="h-4 w-4" />
                <span>info@lashonhara.co.il</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a href="https://facebook.com/lashonhara" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
              </a>
              <a href="https://instagram.com/lashonhara" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
              </a>
              <a href="https://youtube.com/lashonhara" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.5,3.5,12,3.5,12,3.5s-7.5,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.56,31.56,0,0,0,0,12a31.56,31.56,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.88.55,9.38.55,9.38.55s7.5,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.56,31.56,0,0,0,24,12,31.56,31.56,0,0,0,23.5,6.19ZM9.55,15.57V8.43L15.82,12Z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} לשון הרע לא מדבר אליי. כל הזכויות שמורות.</p>
          <p className="mt-2">
            פותח על ידי{" "}
            <a href="https://thrivesystem.co.il" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
              ניוקלאוס - מבית THRIVE SYSTEM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Home Page
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <WhatIsLashonHaraSection />
        <PartnershipSection />
        <CommitmentSection />
        <GandhiQuoteSection />
        <ActivitiesSection />
      </main>
      <Footer />
    </div>
  );
}
