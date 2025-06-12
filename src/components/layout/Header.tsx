
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ShoppingCart, User, Menu, LogIn, UserPlus, Briefcase, Info, LayoutDashboard, LogOut as LogOutIcon, Store } from 'lucide-react'; // Removed UserCircle2
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { useState, type FC, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
];

const Header: FC = () => {
  const { getCartItemCount } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const { currentUser, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [getCartItemCount, currentUser]); // Re-check cart count if user changes


  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6 text-primary" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
        <nav className="flex flex-col space-y-3 mt-8 flex-grow">
          {mainNavLinks.map(link => (
            <SheetClose asChild key={link.label}>
              <Link href={link.href} className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                <Info className="mr-3 h-5 w-5 text-primary" /> {link.label}
              </Link>
            </SheetClose>
          ))}
          <hr className="my-3"/>
          {currentUser ? (
            currentUser.role === 'seller' ? (
              <>
                <SheetClose asChild>
                  <Link href="/dashboard/seller" className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                    <LayoutDashboard className="mr-3 h-5 w-5 text-primary" /> Seller Dashboard
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={`/artisans/${currentUser.id}`} className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                    <Store className="mr-3 h-5 w-5 text-primary" /> View Public Store
                  </Link>
                </SheetClose>
                <Button variant="ghost" onClick={handleLogout} className="text-lg text-destructive hover:text-destructive justify-start p-2 rounded-md hover:bg-destructive/10 flex items-center w-full">
                  <LogOutIcon className="mr-3 h-5 w-5" /> Logout
                </Button>
              </>
            ) : ( // Buyer
              <>
                <SheetClose asChild>
                  <Link href="/profile" className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                    <User className="mr-3 h-5 w-5 text-primary" /> Profile
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/become-seller" className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                    <Briefcase className="mr-3 h-5 w-5 text-primary" /> Become a Seller
                  </Link>
                </SheetClose>
                 <Button variant="ghost" onClick={handleLogout} className="text-lg text-destructive hover:text-destructive justify-start p-2 rounded-md hover:bg-destructive/10 flex items-center w-full">
                  <LogOutIcon className="mr-3 h-5 w-5" /> Logout
                </Button>
              </>
            )
          ) : ( // Logged out
            <>
              <SheetClose asChild>
                <Link href="/login" className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                  <LogIn className="mr-3 h-5 w-5 text-primary" /> Sign In
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register" className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                  <UserPlus className="mr-3 h-5 w-5 text-primary" /> Register
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/become-seller" className="text-lg text-foreground hover:text-primary transition-colors flex items-center p-2 rounded-md hover:bg-muted">
                  <Briefcase className="mr-3 h-5 w-5 text-primary" /> Become a Seller
                </Link>
              </SheetClose>
            </>
          )}
        </nav>
        <div className="mt-auto p-2">
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-headline font-bold text-primary">
          LankaHands
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {mainNavLinks.map(link => (
            <Link key={link.label} href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
          {/* "Become a Seller" link logic is handled within the user dropdowns below for desktop now */}
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block"> <LanguageSwitcher /> </div>
          
          {!isAuthLoading && currentUser ? (
            currentUser.role === 'seller' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.profileImageUrl as string | undefined} alt={currentUser.name} data-ai-hint="seller avatar"/>
                      <AvatarFallback><LayoutDashboard className="h-5 w-5 text-primary"/></AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/seller" className="flex items-center w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link href={`/artisans/${currentUser.id}`} className="flex items-center w-full">
                        <Store className="mr-2 h-4 w-4" /> View Public Store
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : ( // Buyer
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="rounded-full">
                     <Avatar className="h-8 w-8">
                       <AvatarImage src={currentUser.profileImageUrl as string | undefined} alt={currentUser.name} data-ai-hint="buyer avatar"/>
                       <AvatarFallback><User className="h-5 w-5 text-primary"/></AvatarFallback>
                     </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link href="/become-seller" className="flex items-center w-full">
                        <Briefcase className="mr-2 h-4 w-4" /> Become a Seller
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : !isAuthLoading ? ( // Logged out - Desktop Dropdown
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="default" className="px-3"> {/* Changed from icon to text "Welcome" */}
                     Welcome
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center w-full">
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="flex items-center w-full">
                      <UserPlus className="mr-2 h-4 w-4" /> Register
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/become-seller" className="flex items-center w-full">
                        <Briefcase className="mr-2 h-4 w-4" /> Become a Seller
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse hidden md:block"></div> // Skeleton for auth loading
          )}

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
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

    