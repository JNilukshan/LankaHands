import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p className="text-sm">
          &copy; {currentYear} LankaHands. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/about" className="hover:text-primary transition-colors text-sm">About Us</Link>
          <Link href="/contact" className="hover:text-primary transition-colors text-sm">Contact</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors text-sm">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors text-sm">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
