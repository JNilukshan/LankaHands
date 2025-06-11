
"use client";

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
import { useState, useRef, useEffect, type FC } from 'react';

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
];

// Adjusted accountNavLinks for mobile, desktop uses dropdown
const mobileAccountNavLinks = [
    { href: '/login', label: 'Sign In', icon: LogIn },
    { href: '/register', label: 'Register', icon: UserPlus }, // Assuming register is also useful here
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/become-seller', label: 'Become a Seller', icon: UserPlus }, // Kept for consistency if needed
];


const Header: FC = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenDropdown = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsAccountDropdownOpen(true);
  };

  const handleCloseDropdown = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsAccountDropdownOpen(false);
    }, 150); // ms delay to allow cursor to move to content
  };

  useEffect(() => {
    // Clear timeout on component unmount
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
          <DropdownMenu open={isAccountDropdownOpen} onOpenChange={setIsAccountDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm"
                onMouseEnter={handleOpenDropdown}
                onMouseLeave={handleCloseDropdown}
                // onFocus removed to simplify and prioritize hover logic
                // onClick={() => setIsAccountDropdownOpen(prev => !prev)} // Allow click to toggle
              >
                Welcome
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onMouseEnter={handleOpenDropdown} // Keep open if mouse enters content
              onMouseLeave={handleCloseDropdown} // Start close timer if mouse leaves content
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/register" className="flex items-center w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/become-seller" className="flex items-center w-full">
                  <UserPlus className="mr-2 h-4 w-4" /> {/* Icon can be differentiated or kept same */}
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
                {mobileAccountNavLinks.map(link => (
                   <Link key={link.label} href={link.href} className="text-lg text-foreground hover:text-primary transition-colors flex items-center">
                     <link.icon className="mr-2 h-5 w-5 text-primary" /> {link.label}
                   </Link>
                ))}
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
