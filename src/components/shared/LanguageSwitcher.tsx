"use client";

import { useState, type FC } from 'react';
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

const LanguageSwitcher: FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  // In a real app, this would call i18n library functions
  const changeLanguage = (langCode: string) => {
    const lang = languages.find(l => l.code === langCode);
    if (lang) {
      setSelectedLanguage(lang);
      // console.log(`Language changed to: ${lang.name}`);
      // Here you would typically use router.push with locale or i18n.changeLanguage()
    }
  };

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
            className={selectedLanguage.code === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
