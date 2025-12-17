import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/join"} component={Join} />
      <Route path={"/donate"} component={Donate} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/activities"} component={Activities} />
      <Route path={"/store"} component={Store} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/chofetz-chaim"} component={ChofetzChaim} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/debug-shop"} component={DebugShop} />
      <Route path={"/shop/:id"} component={ProductDetail} />
      <Route path={"/admin/donations"} component={AdminDonations} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/products"} component={AdminProducts} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
