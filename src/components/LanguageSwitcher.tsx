import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'nl', name: 'Nederlands', flag: '🇧🇪' },
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'be', name: 'Беларуская', flag: '🇧🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    { code: 'uz', name: 'Oʻzbek', flag: '🇺🇿' },
];

export function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useState('English');
    const [currentFlag, setCurrentFlag] = useState('🇺🇸');

    const changeLanguage = (langCode: string, langName: string, flag: string) => {
        console.log("Attempting to change language to:", langCode);

        const triggerGoogleUpdate = () => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (select) {
                console.log("Found Google combo, updating value...");
                select.value = langCode;
                select.dispatchEvent(new Event('change'));
                setCurrentLang(langName);
                setCurrentFlag(flag);
                return true;
            }
            return false;
        };

        if (!triggerGoogleUpdate()) {
            console.log("Google combo not found yet, setting up observer/interval...");
            // Polling approach for 5 seconds
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (triggerGoogleUpdate() || attempts > 50) {
                    clearInterval(interval);
                    if (attempts > 50) console.error("Google Translate failed to load in time.");
                }
            }, 100);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentLang}</span>
                    <span className="sm:hidden">{currentFlag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-[#0EA0DC]/20">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code, lang.name, lang.flag)}
                        className="cursor-pointer flex items-center justify-between gap-4 hover:bg-[#0EA0DC]/5 text-[#666666]"
                    >
                        <span>{lang.name}</span>
                        <span>{lang.flag}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
