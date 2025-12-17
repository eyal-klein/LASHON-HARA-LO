import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/lh-logo.png" alt="לשון הרע לא מדבר אליי" className="h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">אודות</Link>
            <Link href="/activities" className="text-gray-600 hover:text-primary transition-colors">הפעילות שלנו</Link>
            <Link href="/gallery-new" className="text-primary font-medium">גלריה</Link>
            <Link href="/join" className="text-gray-600 hover:text-primary transition-colors">הצטרפו אלינו</Link>
            <Link href="/donate" className="text-gray-600 hover:text-primary transition-colors">תרומה</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">צרו קשר</Link>
            <Link href="/store-new" className="text-gray-600 hover:text-primary transition-colors">חנות</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default function GalleryNew() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: galleryData, isLoading } = trpc.gallery.list.useQuery({
    page: 1,
    limit: 50,
    category: selectedCategory,
  });

  const { data: categories } = trpc.gallery.categories.useQuery();

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (galleryData && currentImageIndex < galleryData.items.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const currentImage = galleryData?.items[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-l from-purple-600 to-blue-600 text-white py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              הגלריה שלנו
            </h1>
            <p className="text-xl text-blue-100">
              תמונות ורגעים מהפעילות שלנו - אירועים, קמפיינים, שגרירים ועוד
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
            >
              הכל
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.category}
                variant={selectedCategory === cat.category ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.category)}
              >
                {cat.category} ({cat.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">טוען תמונות...</p>
            </div>
          ) : galleryData?.items.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">אין תמונות להצגה</h3>
              <p className="text-muted-foreground">נסה לשנות את הסינון</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryData?.items.map((item, index) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ImageIcon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    {item.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-yellow-500">מומלץ</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="mt-2">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {galleryData && galleryData.items.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === galleryData.items.length - 1}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            {currentImage && (
              <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
                <img
                  src={currentImage.imageUrl}
                  alt={currentImage.title}
                  className="max-h-[70vh] max-w-full object-contain"
                />
                <div className="mt-6 text-center text-white">
                  <h2 className="text-2xl font-bold mb-2">{currentImage.title}</h2>
                  {currentImage.description && (
                    <p className="text-gray-300 max-w-2xl">{currentImage.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-center gap-4">
                    {currentImage.category && (
                      <Badge variant="secondary">{currentImage.category}</Badge>
                    )}
                    <span className="text-sm text-gray-400">
                      {currentImageIndex + 1} / {galleryData?.items.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                <Link href="/activities" className="block text-gray-400 hover:text-white transition-colors">הפעילות שלנו</Link>
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
