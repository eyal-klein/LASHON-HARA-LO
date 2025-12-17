import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Users,
  Heart,
  School,
  ShoppingBag,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomeNew() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturedProductsSection />
      <ActivitiesSection />
      <ImpactSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// Header Component
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "אודות", href: "/about" },
    { label: "פעילויות", href: "/activities-new" },
    { label: "חנות", href: "/store-new" },
    { label: "גלריה", href: "/gallery-new" },
    { label: "צור קשר", href: "/contact-new" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img
                src="/images/lh-logo.png"
                alt="לשון הרע לא מדבר אליי"
                className="h-14 w-auto"
              />
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <a className="text-foreground/80 hover:text-primary font-medium transition-colors text-lg">
                  {item.label}
                </a>
              </Link>
            ))}
            <Link href="/donate">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                תרומה
                <Heart className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Hero Section with Gradient
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 opacity-90">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img
              src="/images/lh-logo.png"
              alt="לשון הרע לא מדבר אליי"
              className="h-32 md:h-40 lg:h-48 w-auto mx-auto drop-shadow-2xl"
            />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            לשון הרע{" "}
            <span className="text-yellow-300 drop-shadow-lg">לא מדבר</span>{" "}
            אליי
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            העמותה מעודדת תרבות שיח חיובית במטרה למגר רכילות, שיימינג ובריונות
            במרחב הפיזי והמקוון
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/join">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 text-xl px-8 py-6 h-auto"
              >
                אני מצטרף להתחייבות
                <ArrowLeft className="mr-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/20 text-xl px-8 py-6 h-auto"
              >
                קראו עוד
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-16">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats Section with Live Data
function StatsSection() {
  const { data: commitmentsStats } = trpc.commitments.stats.useQuery();
  const { data: donationsStats } = trpc.donations.stats.useQuery();

  const stats = [
    {
      icon: Users,
      value: commitmentsStats?.totalCommitments || 50000,
      label: "התחייבויות",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      value: donationsStats?.totalDonations || 500,
      label: "שגרירים",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: School,
      value: 100,
      label: "בתי ספר",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: ShoppingBag,
      value: 10000,
      label: "מוצרים נמכרו",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="text-muted-foreground text-lg">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Products Carousel
function FeaturedProductsSection() {
  const { data: products } = trpc.products.list.useQuery({
    page: 1,
    limit: 8,
    featured: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    if (products && currentIndex < products.items.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!products || products.items.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">המוצרים שלנו</h2>
            <p className="text-lg text-muted-foreground">
              מוצרים ייחודיים להפצת המסר
            </p>
          </div>
          <Link href="/store-new">
            <Button variant="outline" size="lg">
              לכל המוצרים
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= products.items.length - itemsPerPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {products.items.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="flex-shrink-0 w-64 group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg aspect-square">
                        <img
                          src={product.images?.[0] || "/placeholder-product.png"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.featured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            מומלץ
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            ₪{product.price}
                          </span>
                          <Button size="sm">צפה במוצר</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Activities Preview
function ActivitiesSection() {
  const { data: activities } = trpc.activities.list.useQuery({
    page: 1,
    limit: 3,
    upcoming: true,
  });

  if (!activities || activities.items.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">פעילויות קרובות</h2>
            <p className="text-lg text-muted-foreground">
              הצטרפו לאירועים והפעילויות שלנו
            </p>
          </div>
          <Link href="/activities-new">
            <Button variant="outline" size="lg">
              לכל הפעילויות
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.items.map((activity) => (
            <Card
              key={activity.id}
              className="group hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  <img
                    src={activity.imageUrl || "/placeholder-activity.png"}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {activity.type}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(activity.date).toLocaleDateString("he-IL")}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{activity.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  <Link href={`/activities/${activity.slug}`}>
                    <Button variant="outline" className="w-full">
                      פרטים נוספים
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Impact/Testimonials Section
function ImpactSection() {
  const testimonials = [
    {
      quote:
        "הפרויקט שינה לגמרי את האווירה בכיתה שלנו. התלמידים הפכו להיות הרבה יותר מודעים למילים שלהם.",
      author: "מורה בבית ספר תיכון",
      role: "ירושלים",
    },
    {
      quote:
        "כשגריר, אני מרגיש שאני באמת עושה שינוי. כל שיחה, כל חלוקה - זה משנה.",
      author: "דני, שגריר",
      role: "תל אביב",
    },
    {
      quote:
        "המסר הזה הציל את הבת שלי מבריונות ברשת. תודה על העבודה החשובה שאתם עושים.",
      author: "הורה",
      role: "חיפה",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 text-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            הסיפורים שלכם
          </h2>
          <p className="text-xl text-white/90">
            ראו איך אנחנו משנים את השיח ביחד
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white"
            >
              <CardContent className="p-8">
                <div className="text-6xl mb-4 opacity-50">"</div>
                <p className="text-lg mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-white/70">
                    {testimonial.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            מוכנים להצטרף למהפכה?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            כל אחד יכול לעשות שינוי. בחרו את הדרך שלכם להיות חלק מהשינוי.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">הצטרפו כשגרירים</h3>
                <p className="text-muted-foreground mb-4">
                  עזרו לנו להפיץ את המסר
                </p>
                <Link href="/join">
                  <Button className="w-full">הצטרפו עכשיו</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">תרמו</h3>
                <p className="text-muted-foreground mb-4">
                  תמכו בפעילות שלנו
                </p>
                <Link href="/join">               <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                    תרמו עכשיו
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <School className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">בתי ספר</h3>
                <p className="text-muted-foreground mb-4">
                  אמצו תוכנית חינוכית
                </p>
                <Link href="/contact-new">
                  <Button className="w-full">צרו קשר</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/images/lh-logo.png"
              alt="לשון הרע לא מדבר אליי"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400">
              העמותה מעודדת תרבות שיח חיובית במטרה למגר רכילות ובריונות
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    אודות
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/activities-new">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    פעילויות
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/store-new">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    חנות
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact-new">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    צור קשר
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">הצטרפו אלינו</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/join">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    שגרירים
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/donate">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    תרומה
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/join">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    התחייבות
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">צרו קשר</h3>
            <ul className="space-y-2 text-gray-400">
              <li>info@lashonhara.co.il</li>
              <li>03-1234567</li>
              <li>תל אביב, ישראל</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 לשון הרע לא מדבר אליי. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
