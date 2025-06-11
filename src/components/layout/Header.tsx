import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ShoppingCart, User, Menu, LogIn, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
];

const accountNavLinks = [
    { href: '/login', label: 'Sign In', icon: LogIn },
    { href: '/become-seller', label: 'Become a Seller', icon: UserPlus },
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
          {mainNavLinks.map(link => (
            <Link key={link.label} href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm">
                Welcome
                {/* Optional: Add a small icon like ChevronDown here if desired */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/become-seller" className="flex items-center w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Become a Seller
                </Link>
              </DropdownMenuItem>
               <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                {mainNavLinks.map(link => (
                  <Link key={link.label} href={link.href} className="text-lg text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
                <hr/>
                {accountNavLinks.map(link => (
                   <Link key={link.label} href={link.href} className="text-lg text-foreground hover:text-primary transition-colors flex items-center">
                     <link.icon className="mr-2 h-5 w-5 text-primary" /> {link.label}
                   </Link>
                ))}
                 <Link href="/profile" className="text-lg text-foreground hover:text-primary transition-colors flex items-center">
                   <User className="mr-2 h-5 w-5 text-primary" /> Profile
                </Link>
                <hr/>
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
