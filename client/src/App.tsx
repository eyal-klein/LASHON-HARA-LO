import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { Cart } from "./components/Cart";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Join from "./pages/Join";
import Donate from "./pages/Donate";
import Gallery from "./pages/Gallery";
import Activities from "./pages/Activities";
import Store from "./pages/Store";
import Admin from "./pages/Admin";
import ChofetzChaim from "./pages/ChofetzChaim";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import DebugShop from "./pages/DebugShop";
import AdminDonations from "./pages/AdminDonations";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminContent from "./pages/AdminContent";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProductsPage from "./pages/admin/Products";
import AdminGallery from "./pages/admin/Gallery";
import AdminActivities from "./pages/admin/Activities";
import AdminMessages from "./pages/admin/Messages";
import AdminPartnerships from "./pages/admin/Partnerships";
import HomeNew from "./pages/HomeNew";
import ProductDetailNew from "./pages/ProductDetailNew";
import AboutNew from "./pages/AboutNew";
import AdminDonationsPage from "./pages/admin/Donations";
import AdminCommitments from "./pages/admin/Commitments";
import StoreNew from "./pages/StoreNew";
import GalleryNew from "./pages/GalleryNew";
import ActivitiesNew from "./pages/ActivitiesNew";
import ContactNew from "./pages/ContactNew";
import ChatbotNew from "./pages/ChatbotNew";

function Router() {
  return (
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
      <Route path={"/shop"} component={Shop} />
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
