
"use client";

import { useState, type FC, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'si', name: 'සිංහල (Sinhala)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
];

// Helper to get the initial language based on search params or default
function getInitialLanguage(searchParamsLocal: URLSearchParams | null): { code: string; name: string; } {
  if (!searchParamsLocal) return languages[0]; 
  const langCode = searchParamsLocal.get('lang');
  return languages.find(l => l.code === langCode) || languages[0];
}

const LanguageSwitcher: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedLanguage, setSelectedLanguage] = useState(() => getInitialLanguage(searchParams));

  // Effect to update selectedLanguage if searchParams change from external navigation or router.push
  useEffect(() => {
    const currentLangCode = searchParams.get('lang');
    const targetLang = languages.find(l => l.code === currentLangCode) || languages[0];
    
    if (targetLang.code !== selectedLanguage.code) {
      setSelectedLanguage(targetLang);
    }
  }, [searchParams.toString(), selectedLanguage.code]); // Use searchParams.toString() as dependency


  const changeLanguage = useCallback((langCode: string) => {
    const lang = languages.find(l => l.code === langCode);
    if (lang) {
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

      if (langCode === languages[0].code) { // Default language (English)
        currentParams.delete('lang');
      } else {
        currentParams.set('lang', langCode);
      }

      const queryString = currentParams.toString();
      // Preserve existing hash if any
      const currentHash = window.location.hash;
      const newUrl = (queryString ? `${pathname}?${queryString}` : pathname) + currentHash;
      
      router.push(newUrl, { scroll: false }); // scroll: false prevents jumping to top
    }
  }, [router, pathname, searchParams.toString()]); // Use searchParams.toString() as dependency

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm">
          <Languages className="mr-2 h-4 w-4 text-primary" />
          {selectedLanguage.code.toUpperCase()}
          <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={selectedLanguage.code === lang.code ? "bg-accent text-accent-foreground" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
