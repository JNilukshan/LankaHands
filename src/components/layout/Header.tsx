
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ShoppingCart, User, Menu, LogIn, UserPlus, Briefcase, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, type FC, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
];

const mobileNavLinks = [
    { href: '/', label: 'Home', icon: Info },
    { href: '/products', label: 'Products', icon: ShoppingCart },
    { href: '/about', label: 'About Us', icon: Info },
];

const mobileAccountNavLinks = [
    { href: '/login', label: 'Sign In', icon: LogIn },
    { href: '/register', label: 'Register', icon: UserPlus },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/become-seller', label: 'Become a Seller', icon: Briefcase },
    { href: '/dashboard/seller', label: 'Seller Dashboard', icon: Briefcase },
];


const Header: FC = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Update cart count on client-side after hydration
    setCartItemCount(getCartItemCount());
  }, [getCartItemCount]);


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
              >
                Welcome
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
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
                  <Briefcase className="mr-2 h-4 w-4" />
                  Become a Seller
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/seller" className="flex items-center w-full">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Seller Dashboard
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
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[0.6rem]">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {mobileNavLinks.map(link => (
                  <Link key={link.label} href={link.href} className="text-lg text-foreground hover:text-primary transition-colors flex items-center">
                     <link.icon className="mr-2 h-5 w-5 text-primary" /> {link.label}
                  </Link>
                ))}
                <hr/>
                {mobileAccountNavLinks.map(link => (
                   <Link key={link.label} href={link.href} className="text-lg text-foreground hover:text-primary transition-colors flex items-center">
                     <link.icon className="mr-2 h-5 w-5 text-primary" /> {link.label}
                   </Link>
                ))}
                {/* Cart link removed from here as it's an icon button now */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
