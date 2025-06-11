import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/become-seller', label: 'Become a Seller' },
  { href: '/dashboard/seller', label: 'Seller Dashboard'}, // Added for completeness based on features
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-headline font-bold text-primary">
          LankaHands
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile"> {/* Assuming /profile is the combined login/profile page or directs to login if not authenticated */}
              <User className="h-5 w-5 text-primary" />
              <span className="sr-only">Profile / Login</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" disabled> {/* Cart not in scope, but common */}
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map(link => (
                  <Link key={link.label} href={link.href} className="text-lg text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
                <hr/>
                <Link href="/profile" className="text-lg text-foreground hover:text-primary transition-colors flex items-center">
                   <User className="mr-2 h-5 w-5 text-primary" /> Profile / Login
                </Link>
                <Button variant="ghost" size="icon" className="text-lg text-foreground hover:text-primary transition-colors flex items-center justify-start w-full" disabled>
                  <ShoppingCart className="mr-2 h-5 w-5 text-primary" /> Shopping Cart
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
