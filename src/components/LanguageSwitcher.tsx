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
    { code: 'af', name: 'Afrikaans', flags: '🇿🇦', countries: 'South Africa' },
    { code: 'sq', name: 'Albanian', flags: '🇦🇱', countries: 'Albania' },
    { code: 'am', name: 'Amharic', flags: '🇪🇹', countries: 'Ethiopia' },
    { code: 'ar', name: 'Arabic', flags: '🇸🇦🇩🇿🇧🇭+', countries: 'Saudi Arabia, Algeria, Bahrain, Comoros, Egypt, Iraq, Jordan, Kuwait, Lebanon, Libya, Mauritania, Morocco, Oman, Palestinian Territories, Qatar, Sudan, Syria, Tunisia, United Arab Emirates, Yemen' },
    { code: 'hy', name: 'Armenian', flags: '🇦🇲', countries: 'Armenia' },
    { code: 'az', name: 'Azerbaijani', flags: '🇦🇿', countries: 'Azerbaijan' },
    { code: 'bn', name: 'Bangla', flags: '🇧🇩', countries: 'Bangladesh' },
    { code: 'be', name: 'Belarusian', flags: '🇧🇾', countries: 'Belarus' },
    { code: 'bs', name: 'Bosnian', flags: '🇧🇦', countries: 'Bosnia & Herzegovina' },
    { code: 'bg', name: 'Bulgarian', flags: '🇧🇬', countries: 'Bulgaria' },
    { code: 'my', name: 'Burmese', flags: '🇲🇲', countries: 'Myanmar (Burma)' },
    { code: 'ca', name: 'Catalan', flags: '🇦🇩', countries: 'Andorra' },
    { code: 'zh-CN', name: 'Chinese (China)', flags: '🇨🇳', countries: 'China' },
    { code: 'hr', name: 'Croatian', flags: '🇭🇷', countries: 'Croatia' },
    { code: 'cs', name: 'Czech', flags: '🇨🇿', countries: 'Czechia' },
    { code: 'da', name: 'Danish', flags: '🇩🇰', countries: 'Denmark' },
    { code: 'dv', name: 'Divehi', flags: '🇲🇻', countries: 'Maldives' },
    { code: 'nl', name: 'Dutch', flags: '🇧🇪🇳🇱🇸🇷', countries: 'Belgium, Netherlands, Suriname' },
    { code: 'dz', name: 'Dzongkha', flags: '🇧🇹', countries: 'Bhutan' },
    { code: 'en', name: 'English', flags: '🇺🇸🇦🇬🇦🇺+', countries: 'United States, Antigua & Barbuda, Australia, Bahamas, Barbados, Belize, Botswana, Canada, Dominica, Eswatini, Fiji, Gambia, Ghana, Grenada, Guyana, Jamaica, Kiribati, Liberia, Marshall Islands, Mauritius, Micronesia, Namibia, Nauru, New Zealand, Nigeria, Palau, Papua New Guinea, St. Kitts & Nevis, St. Lucia, St. Vincent & Grenadines, Sierra Leone, Singapore, Solomon Islands, South Sudan, Trinidad & Tobago, Tuvalu, Uganda, United Kingdom, Vanuatu, Zambia, Zimbabwe' },
    { code: 'et', name: 'Estonian', flags: '🇪🇪', countries: 'Estonia' },
    { code: 'tl', name: 'Filipino', flags: '🇵🇭', countries: 'Philippines' },
    { code: 'fi', name: 'Finnish', flags: '🇫🇮', countries: 'Finland' },
    { code: 'fr', name: 'French', flags: '🇫🇷🇧🇯🇧🇫+', countries: 'France, Benin, Burkina Faso, Burundi, Cameroon, Central African Republic, Chad, Congo - Brazzaville, Congo - Kinshasa, Djibouti, Gabon, Guinea, Mali, Monaco, Niger, Senegal, Seychelles, Togo' },
    { code: 'ka', name: 'Georgian', flags: '🇬🇪', countries: 'Georgia' },
    { code: 'de', name: 'German', flags: '🇩🇪🇦🇹🇱🇮+', countries: 'Germany, Austria, Liechtenstein, Switzerland' },
    { code: 'el', name: 'Greek', flags: '🇬🇷🇨🇾', countries: 'Greece, Cyprus' },
    { code: 'ht', name: 'Haitian Creole', flags: '🇭🇹', countries: 'Haiti' },
    { code: 'he', name: 'Hebrew', flags: '🇮🇱', countries: 'Israel' },
    { code: 'hi', name: 'Hindi', flags: '🇮🇳', countries: 'India' },
    { code: 'hu', name: 'Hungarian', flags: '🇭🇺', countries: 'Hungary' },
    { code: 'is', name: 'Icelandic', flags: '🇮🇸', countries: 'Iceland' },
    { code: 'id', name: 'Indonesian', flags: '🇮🇩', countries: 'Indonesia' },
    { code: 'ga', name: 'Irish', flags: '🇮🇪', countries: 'Ireland' },
    { code: 'it', name: 'Italian', flags: '🇮🇹🇸🇲🇻🇦', countries: 'Italy, San Marino, Vatican City' },
    { code: 'ja', name: 'Japanese', flags: '🇯🇵', countries: 'Japan' },
    { code: 'kk', name: 'Kazakh', flags: '🇰🇿', countries: 'Kazakhstan' },
    { code: 'km', name: 'Khmer', flags: '🇰🇭', countries: 'Cambodia' },
    { code: 'rw', name: 'Kinyarwanda', flags: '🇷🇼', countries: 'Rwanda' },
    { code: 'ko', name: 'Korean', flags: '🇰🇵🇰🇷', countries: 'North Korea, South Korea' },
    { code: 'ky', name: 'Kyrgyz', flags: '🇰🇬', countries: 'Kyrgyzstan' },
    { code: 'lo', name: 'Lao', flags: '🇱🇦', countries: 'Laos' },
    { code: 'lv', name: 'Latvian', flags: '🇱🇻', countries: 'Latvia' },
    { code: 'lt', name: 'Lithuanian', flags: '🇱🇹', countries: 'Lithuania' },
    { code: 'lb', name: 'Luxembourgish', flags: '🇱🇺', countries: 'Luxembourg' },
    { code: 'mg', name: 'Malagasy', flags: '🇲🇬', countries: 'Madagascar' },
    { code: 'ms', name: 'Malay', flags: '🇧🇳🇲🇾', countries: 'Brunei, Malaysia' },
    { code: 'mt', name: 'Maltese', flags: '🇲🇹', countries: 'Malta' },
    { code: 'mn', name: 'Mongolian', flags: '🇲🇳', countries: 'Mongolia' },
    { code: 'no', name: 'Norwegian', flags: '🇳🇴', countries: 'Norway' },
    { code: 'ny', name: 'Nyanja', flags: '🇲🇼', countries: 'Malawi' },
    { code: 'ps', name: 'Pashto', flags: '🇦🇫', countries: 'Afghanistan' },
    { code: 'fa', name: 'Persian', flags: '🇮🇷', countries: 'Iran' },
    { code: 'pl', name: 'Polish', flags: '🇵🇱', countries: 'Poland' },
    { code: 'pt', name: 'Portuguese', flags: '🇧🇷🇦🇴🇨🇻+', countries: 'Brazil, Angola, Cape Verde, Guinea-Bissau, Mozambique, Portugal, São Tomé & Príncipe, Timor-Leste' },
    { code: 'ro', name: 'Romanian', flags: '🇲🇩🇷🇴', countries: 'Moldova, Romania' },
    { code: 'ru', name: 'Russian', flags: '🇷🇺', countries: 'Russia' },
    { code: 'sm', name: 'Samoan', flags: '🇼🇸', countries: 'Samoa' },
    { code: 'sr', name: 'Serbian', flags: '🇲🇪🇷🇸', countries: 'Montenegro, Serbia' },
    { code: 'si', name: 'Sinhala', flags: '🇱🇰', countries: 'Sri Lanka' },
    { code: 'sk', name: 'Slovak', flags: '🇸🇰', countries: 'Slovakia' },
    { code: 'sl', name: 'Slovenian', flags: '🇸🇮', countries: 'Slovenia' },
    { code: 'so', name: 'Somali', flags: '🇸🇴', countries: 'Somalia' },
    { code: 'st', name: 'Southern Sotho', flags: '🇱🇸', countries: 'Lesotho' },
    { code: 'es', name: 'Spanish', flags: '🇪🇸🇦🇷🇨🇱+', countries: 'Spain, Argentina, Chile, Bolivia, Colombia, Costa Rica, Cuba, Dominican Republic, Ecuador, El Salvador, Equatorial Guinea, Guatemala, Honduras, Mexico, Nicaragua, Panama, Paraguay, Peru, Uruguay, Venezuela' },
    { code: 'sw', name: 'Swahili', flags: '🇰🇪🇹🇿', countries: 'Kenya, Tanzania' },
    { code: 'sv', name: 'Swedish', flags: '🇸🇪', countries: 'Sweden' },
    { code: 'tg', name: 'Tajik', flags: '🇹🇯', countries: 'Tajikistan' },
    { code: 'th', name: 'Thai', flags: '🇹🇭', countries: 'Thailand' },
    { code: 'ti', name: 'Tigrinya', flags: '🇪🇷', countries: 'Eritrea' },
    { code: 'to', name: 'Tongan', flags: '🇹🇴', countries: 'Tonga' },
    { code: 'tr', name: 'Turkish', flags: '🇹🇷', countries: 'Türkiye' },
    { code: 'tk', name: 'Turkmen', flags: '🇹🇲', countries: 'Turkmenistan' },
    { code: 'uk', name: 'Ukrainian', flags: '🇺🇦', countries: 'Ukraine' },
    { code: 'ur', name: 'Urdu', flags: '🇵🇰', countries: 'Pakistan' },
    { code: 'uz', name: 'Uzbek', flags: '🇺🇿', countries: 'Uzbekistan' },
    { code: 'vi', name: 'Vietnamese', flags: '🇻🇳', countries: 'Vietnam' }
];

const getFlagUrl = (emoji: string) => {
    const chars = Array.from(emoji);
    if (chars.length < 2) return null;
    const codePoint1 = chars[0].codePointAt(0);
    const codePoint2 = chars[1].codePointAt(0);
    if (!codePoint1 || !codePoint2) return null;

    const c1 = codePoint1 - 0x1F1E6;
    const c2 = codePoint2 - 0x1F1E6;
    if (c1 >= 0 && c1 <= 25 && c2 >= 0 && c2 <= 25) {
        const code = String.fromCharCode(65 + c1, 65 + c2).toLowerCase();
        return `https://flagcdn.com/w40/${code}.png`;
    }
    return null;
};

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
                // Dispatch custom event for cross-component sync
                window.dispatchEvent(new CustomEvent('skygloss-lang-change', { detail: { langCode } }));
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
                    <div className="w-5 h-4 overflow-hidden rounded-sm flex items-center justify-center">
                        {getFlagUrl(currentFlag) ? (
                            <img src={getFlagUrl(currentFlag)!} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg leading-none">{currentFlag}</span>
                        )}
                    </div>
                    <span className="hidden sm:inline">{currentLang}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ maxHeight: "350px" }} className=" bg-white border-[#0EA0DC]/20 max-h-[300px] overflow-y-auto">
                {languages.map((lang, idx) => {
                    const flagUrl = getFlagUrl(lang.flags);
                    return (
                        <DropdownMenuItem
                            key={`${lang.code}-${idx}`}
                            onClick={() => changeLanguage(lang.code, lang.name, Array.from(lang.flags).slice(0, 2).join(''))}
                            className="cursor-pointer flex flex-col items-start gap-1 hover:bg-[#0EA0DC]/5 text-[#666666] py-2 h-auto"
                        >
                            <div className="flex items-center justify-between w-full min-w-[220px] gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-4 overflow-hidden rounded-sm border border-gray-100 flex items-center justify-center">
                                        {flagUrl ? (
                                            <img src={flagUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl leading-none">{Array.from(lang.flags).slice(0, 2).join('')}</span>
                                        )}
                                    </div>
                                    <span className="font-medium text-[#272727]">{lang.name}</span>
                                </div>
                                <span className="text-[10px] text-[#999999] font-mono">{lang.code.toUpperCase()}</span>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
