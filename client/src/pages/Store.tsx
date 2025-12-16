import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingBag, Bell } from "lucide-react";

// Header component
function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            לשון הרע <span className="text-primary">לא מדבר</span> אליי
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">אודות</Link>
            <Link href="/activities" className="text-gray-600 hover:text-primary transition-colors">הפעילות שלנו</Link>
            <Link href="/gallery" className="text-gray-600 hover:text-primary transition-colors">גלריה</Link>
            <Link href="/join" className="text-gray-600 hover:text-primary transition-colors">הצטרפו אלינו</Link>
            <Link href="/donate" className="text-gray-600 hover:text-primary transition-colors">תרומה</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">צרו קשר</Link>
            <Link href="/store" className="text-primary font-medium">חנות</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Placeholder products
const placeholderProducts = [
  {
    id: 1,
    name: "חולצת שגריר",
    description: "חולצה רשמית של שגרירי העמותה",
    price: 79,
    image: null,
    comingSoon: true,
  },
  {
    id: 2,
    name: "ספר חפץ חיים",
    description: "ספר הלכות לשון הרע",
    price: 49,
    image: null,
    comingSoon: true,
  },
  {
    id: 3,
    name: "מגנט לשון הרע",
    description: "מגנט עם מסר חיובי",
    price: 15,
    image: null,
    comingSoon: true,
  },
  {
    id: 4,
    name: "פוסטר מעוצב",
    description: "פוסטר עם ציטוט מעורר השראה",
    price: 35,
    image: null,
    comingSoon: true,
  },
];

export default function Store() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-16">
        <div className="container text-center">
          <Badge className="bg-yellow-100 text-yellow-800 mb-4">
            בקרוב
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            החנות שלנו
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            מוצרים ייחודיים לתמיכה בפעילות העמותה
          </p>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-8">
        <div className="container">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <ShoppingBag className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              החנות בבנייה
            </h2>
            <p className="text-gray-600 mb-4">
              אנחנו עובדים על החנות החדשה שלנו. בקרוב תוכלו לרכוש מוצרים ייחודיים לתמיכה בפעילות.
            </p>
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              עדכנו אותי כשהחנות נפתחת
            </Button>
          </div>
        </div>
      </section>

      {/* Preview Products */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            הצצה למוצרים שיהיו זמינים
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {placeholderProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden opacity-75">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  <ShoppingBag className="w-16 h-16 text-gray-300" />
                  <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                    בקרוב
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-primary">₪{product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            רוצים לתמוך בינתיים?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            תרומה לעמותה מאפשרת לנו להמשיך בפעילות החינוכית
          </p>
          <Link href="/donate">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              לתרומה
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
