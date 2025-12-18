import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { Cart } from "./components/Cart";

// Eager load critical pages
import HomeNew from "./pages/HomeNew";
import NotFound from "@/pages/NotFound";

// Lazy load all other pages
const AboutNew = lazy(() => import("./pages/AboutNew"));
const ContactNew = lazy(() => import("./pages/ContactNew"));
const Join = lazy(() => import("./pages/Join"));
const Donate = lazy(() => import("./pages/Donate"));
const GalleryNew = lazy(() => import("./pages/GalleryNew"));
const ActivitiesNew = lazy(() => import("./pages/ActivitiesNew"));
const StoreNew = lazy(() => import("./pages/StoreNew"));
const ProductDetailNew = lazy(() => import("./pages/ProductDetailNew"));
const ChatbotNew = lazy(() => import("./pages/ChatbotNew"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProductsPage = lazy(() => import("./pages/admin/Products"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminActivities = lazy(() => import("./pages/admin/Activities"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminPartnerships = lazy(() => import("./pages/admin/Partnerships"));
const AdminDonationsPage = lazy(() => import("./pages/admin/Donations"));
const AdminCommitments = lazy(() => import("./pages/admin/Commitments"));
const ChofetzChaim = lazy(() => import("./pages/ChofetzChaim"));
const DebugShop = lazy(() => import("./pages/DebugShop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AdminDonations = lazy(() => import("./pages/AdminDonations"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminContent = lazy(() => import("./pages/AdminContent"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">טוען...</span>
      </div>
      <p className="mt-4 text-sm text-gray-600">טוען...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
      <Route path={"/"} component={HomeNew} />
      <Route path={"/about"} component={AboutNew} />
      <Route path={"/contact-new"} component={ContactNew} />
      <Route path={"/contact"} component={ContactNew} />
      <Route path={"/join"} component={Join} />
      <Route path={"/donate"} component={Donate} />
      <Route path={"/gallery-new"} component={GalleryNew} />
      <Route path={"/gallery"} component={GalleryNew} />
      <Route path={"/activities-new"} component={ActivitiesNew} />
      <Route path={"/activities"} component={ActivitiesNew} />
      <Route path={"/store-new"} component={StoreNew} />
      <Route path={"/store"} component={StoreNew} />
      <Route path="/product/:id" component={ProductDetailNew} />
      <Route path="/chatbot" component={ChatbotNew} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/chofetz-chaim"} component={ChofetzChaim} />
      <Route path={"/shop"} component={StoreNew} />
      <Route path={"/debug-shop"} component={DebugShop} />
      <Route path={"/shop/:id"} component={ProductDetail} />
      <Route path={"/admin/donations"} component={AdminDonations} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/products"} component={AdminProductsPage} />
      <Route path={"/admin/gallery"} component={AdminGallery} />
      <Route path={"/admin/activities"} component={AdminActivities} />
      <Route path={"/admin/messages"} component={AdminMessages} />
      <Route path={"/admin/partnerships"} component={AdminPartnerships} />
      <Route path={"/admin/donations-new"} component={AdminDonationsPage} />
      <Route path={"/admin/commitments"} component={AdminCommitments} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/admin/content"} component={AdminContent} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <Cart />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
