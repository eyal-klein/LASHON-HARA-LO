import { Link } from "wouter";
import { useState, useEffect } from "react";

export function Header() {
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
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Navigation - RTL: on the right */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <a className="text-foreground/80 hover:text-primary font-medium transition-colors text-lg">
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Logo - RTL: on the left */}
          <Link href="/">
            <a className="flex items-center gap-3">
              <img
                src="/images/lh-logo.png"
                alt="לשון הרע לא מדבר אליי"
                className="h-14 w-auto"
              />
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
