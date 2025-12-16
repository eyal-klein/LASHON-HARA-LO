import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Camera, Users, Calendar, Megaphone, Image } from "lucide-react";

// Header component (same as other pages)
function Header() {
  return (
    <Navigation />
  );
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  ambassador: <Users className="w-5 h-5" />,
  event: <Calendar className="w-5 h-5" />,
  campaign: <Megaphone className="w-5 h-5" />,
  media: <Camera className="w-5 h-5" />,
  other: <Image className="w-5 h-5" />,
};

const categoryNames: Record<string, string> = {
  ambassador: "שגרירים",
  event: "אירועים",
  campaign: "קמפיינים",
  media: "מדיה",
  other: "אחר",
};

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const { data: categories } = trpc.gallery.categories.useQuery();
  const { data: items, isLoading } = trpc.gallery.list.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory as any,
    limit: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            הגלריה שלנו
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            תמונות מהפעילויות, האירועים והשגרירים שלנו ברחבי הארץ
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12">
        <div className="container">
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 rounded-full"
              >
                הכל
              </TabsTrigger>
              {categories?.map((cat) => (
                <TabsTrigger
                  key={cat.category}
                  value={cat.category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-2 rounded-full flex items-center gap-2"
                >
                  {categoryIcons[cat.category]}
                  {categoryNames[cat.category]} ({cat.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow">
                      <CardContent className="p-0 relative">
                        <div className="aspect-square bg-gray-100">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="font-semibold">{item.title}</h3>
                            {item.location && (
                              <p className="text-sm text-white/80">{item.location}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="space-y-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full rounded-lg"
                        />
                      )}
                      <div>
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        {item.description && (
                          <p className="text-gray-600 mt-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {categoryIcons[item.category]}
                            {categoryNames[item.category]}
                          </span>
                          {item.location && <span>📍 {item.location}</span>}
                          {item.eventDate && (
                            <span>📅 {new Date(item.eventDate).toLocaleDateString("he-IL")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">אין תמונות עדיין</h3>
              <p className="text-gray-500">תמונות חדשות יתווספו בקרוב</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            רוצים להיות חלק מהגלריה?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            הצטרפו לשגרירים שלנו והיו חלק מהשינוי
          </p>
          <Link href="/join">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              הצטרפו אלינו
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
