import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-[#00D9FF]/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">

            <span className="text-xl font-heading font-bold text-[#F8FAFC] hidden sm:block">
            SoloStack
            </span>
          </a>



          {/* CTA Button */}
          <div className="hidden md:block">
          <Link to="/dashboard">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#6366F1] to-[#00D9FF] text-white font-semibold hover:shadow-lg hover:shadow-[#00D9FF]/30 transition-all duration-300 border-0"
            >Начать
            </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#F8FAFC] p-2 hover:bg-[#00D9FF]/10 rounded-lg transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 glass rounded-2xl p-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#94A3B8] hover:text-[#00D9FF] transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-[#00D9FF]/10"
                >
                  {link.name}
                </a>
              ))}
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#6366F1] to-[#00D9FF] text-white font-semibold border-0 w-full"
              >
                    Начать
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
