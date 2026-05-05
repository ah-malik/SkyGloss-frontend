import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect, useMemo, useRef } from "react";
import { Country, State, City } from 'country-state-city';
import { ArrowLeft, Mail, Lock, User, MapPin, Phone, Globe, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { PartnerIcon } from "./CustomIcons";
import { Footer } from "./Footer";
import { useNavigate } from "react-router";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { normalizeUrl } from "./ui/utils";


const normalizeName = (name: string) => {
    if (!name) return '';
    return name
        .normalize('NFD') // Separate characters from diacritics
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/ı/g, 'i') // Special handling for Turkish dotless i
        .replace(/İ/g, 'I'); // Special handling for Turkish dotted I
};

const getFlagUrl = (isoCode: string) => {
    if (!isoCode) return null;
    return `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`;
};


const europeanCountries = [
    'austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czech republic', 'denmark',
    'estonia', 'finland', 'france', 'germany', 'greece', 'hungary', 'ireland', 'italy',
    'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal',
    'romania', 'slovakia', 'slovenia', 'spain', 'sweden', 'united kingdom',
    'switzerland', 'norway', 'iceland', 'liechtenstein', 'monaco', 'san marino', 'andorra'
];

export function ShopRegistration() {
    const navigate = useNavigate();

    const [cities, setCities] = useState<any[]>([]);
    const [step, setStep] = useState(1);
    const countries = useMemo(() => Country.getAllCountries(), []);

    const [callingCode, setCallingCode] = useState("");
    const [countryISO, setCountryISO] = useState<any>("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "certified_shop",
        country: "",
        address: "",
        city: "",
        zipCode: "",
        phoneNumber: "",
        shopName: "",
        hearAboutUs: "",
        hearAboutUsOther: "",
        referredByPartnerCode: "",
        couponCode: "",
        website: "",
        facebook: "",
        instagram: "",
        youtube: "",
        tiktok: "",
        linkedin: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedFee, setFetchedFee] = useState<{ feeAmount: number, currency: string } | null>(null);
    const [isFetchingFee, setIsFetchingFee] = useState(false);
    const [noPartnerId, setNoPartnerId] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const countryDropdownRef = useRef<HTMLDivElement>(null);

    const sendToWebhook = async (url: string, data: any) => {
        try {
            const webhookData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    webhookData.append(key, value.toString());
                }
            });
            await fetch(url, {
                method: 'POST',
                body: webhookData,
            });
        } catch (err) {
            console.error('[Webhooks] Failed to send data:', err);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    // Close country dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setCountryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = useMemo(() => {
        if (!countrySearch) return countries;
        const search = countrySearch.toLowerCase();
        return countries.filter(c => c.name.toLowerCase().includes(search));
    }, [countries, countrySearch]);

    useEffect(() => {
        const fetchFee = async () => {
            if (!formData.country) return;
            setIsFetchingFee(true);
            try {
                const res = await api.get(`/registration-fees/public/by-country/${formData.country}`);
                setFetchedFee(res.data);
            } catch (err) {
                console.error('Failed to fetch fee:', err);
                setFetchedFee({ feeAmount: 250, currency: 'USD' });
            } finally {
                setIsFetchingFee(false);
            }
        };
        fetchFee();
    }, [formData.country]);

    const handleBack = () => {
        if (step === 3) setStep(2);
        else if (step === 2) setStep(1);
        else navigate("/");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isStepValid = useMemo(() => {
        if (step === 1) {
            const { firstName, lastName, email, password, country, hearAboutUs, referredByPartnerCode, couponCode } = formData;
            const basicInfo = firstName && lastName && email && password.length >= 6 && country;
            const isCouponValid = couponCode === 'CERTIFICATIONONUS';

            // If they don't have a partner ID, hearAboutUs is required.
            // If hearAboutUs is "Other", hearAboutUsOther is also required.
            const referralInfo = noPartnerId
                ? (formData.hearAboutUs && (formData.hearAboutUs !== 'Other' || formData.hearAboutUsOther))
                : (referredByPartnerCode && referredByPartnerCode.length >= 4) || isCouponValid;

            return !!(basicInfo && referralInfo);
        } else if (step === 2) {
            const { city, phoneNumber } = formData;
            return !!(city && phoneNumber);
        } else {
            return true;
        }
    }, [formData, step, noPartnerId]);

    const validateStep = () => {
        if (!isStepValid) {
            alert("Please fill in all required fields correctly.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e?: React.FormEvent, payLater: boolean = false) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        try {
            // If callingCode exists, it might be from the old system or manually set
            // PhoneInput usually provides the full number starting with +
            const fullPhone = formData.phoneNumber.startsWith('+')
                ? formData.phoneNumber
                : (callingCode ? `${callingCode} ${formData.phoneNumber}` : formData.phoneNumber);

            const normalizedData = {
                ...formData,
                // If user has no partner ID, clear it so backend defaults to GLOBAL77
                referredByPartnerCode: noPartnerId ? '' : formData.referredByPartnerCode,
                phoneNumber: fullPhone,
                website: normalizeUrl(formData.website),
                facebook: normalizeUrl(formData.facebook),
                instagram: normalizeUrl(formData.instagram),
                youtube: normalizeUrl(formData.youtube),
                tiktok: normalizeUrl(formData.tiktok),
                linkedin: normalizeUrl(formData.linkedin)
            };

            const response = await api.post('/auth/register-shop', normalizedData);

            // Send complete registration data to webhook
            const webhookPayload = {
                ...normalizedData,
                hearAboutUs: formData.hearAboutUs === 'Other' ? formData.hearAboutUsOther : formData.hearAboutUs
            };
            sendToWebhook('https://services.leadconnectorhq.com/hooks/0ECH0AoivQGV58EtMuli/webhook-trigger/f05dd651-e2f4-46c1-8cb4-8ae07a33e75f', webhookPayload);


            if (payLater) {
                alert("Registration successful! You can pay the activation fee later from your dashboard.");
                navigate('/login/shop');
            } else if (response.data?.stripeUrl) {
                window.location.href = response.data.stripeUrl;
            } else if (response.data?.user && formData.couponCode === 'CERTIFICATIONONUS') {
                alert("Registration successful via Certification Bonus! Redirecting to login...");
                navigate('/login/shop?payment_success=true');
            } else {
                alert("Registration successful but payment link is missing.");
                setIsLoading(false);
            }
        } catch (err: any) {
            setIsLoading(false);
            alert(err.response?.data?.message || 'Registration failed. Please check your details.');
        }
    };

    const registrationFee = useMemo(() => {
        const isFree = formData.couponCode === 'CERTIFICATIONONUS';
        if (isFree) {
            return { base: 0, tax: 0, total: 0, currency: '$', suffix: 'USD', hasTax: false, isFree: true };
        }

        const fee = fetchedFee?.feeAmount ?? 250;
        const cur = (fetchedFee?.currency || 'USD').toUpperCase();
        
        // Comprehensive Symbols mapping
        const symbols: any = { 
            'USD': '$', 'EUR': '€', 'GBP': '£', 'AUD': '$', 'CAD': '$', 'JPY': '¥', 
            'CNY': '¥', 'INR': '₹', 'AED': 'د.إ', 'AFN': '؋', 'ALL': 'L', 'AMD': '֏', 
            'ANG': 'ƒ', 'AOA': 'Kz', 'ARS': '$', 'AZN': '₼', 'BAM': 'KM', 'BBD': '$', 
            'BDT': '৳', 'BGN': 'лв', 'BHD': '.د.ب', 'BIF': 'FBu', 'BMD': '$', 'BND': '$', 
            'BOB': '$b', 'BRL': 'R$', 'BSD': '$', 'BTN': 'Nu.', 'BWP': 'P', 'BYN': 'Br', 
            'BZD': 'BZ$', 'CHF': 'CHF', 'CLP': '$', 'COP': '$', 'CRC': '₡', 'CUP': '₱', 
            'CVE': '$', 'CZK': 'Kč', 'DJF': 'Fdj', 'DKK': 'kr', 'DOP': 'RD$', 'DZD': 'دج', 
            'EGP': '£', 'ETB': 'Br', 'FJD': '$', 'GEL': '₾', 'GHS': 'GH₵', 'GMD': 'D', 
            'GNF': 'FG', 'GTQ': 'Q', 'GYD': '$', 'HKD': '$', 'HNL': 'L', 'HRK': 'kn', 
            'HTG': 'G', 'HUF': 'Ft', 'IDR': 'Rp', 'ILS': '₪', 'IQD': 'ع.د', 'IRR': '﷼', 
            'ISK': 'kr', 'JMD': 'J$', 'JOD': 'JD', 'KES': 'KSh', 'KGS': 'лв', 'KHR': '៛', 
            'KMF': 'CF', 'KPW': '₩', 'KRW': '₩', 'KWD': 'KD', 'KYD': '$', 'KZT': '₸', 
            'LAK': '₭', 'LBP': '£', 'LKR': '₨', 'LRD': '$', 'LSL': 'L', 'LYD': 'LD', 
            'MAD': 'MAD', 'MDL': 'lei', 'MGA': 'Ar', 'MKD': 'ден', 'MMK': 'K', 'MNT': '₮', 
            'MOP': 'MOP$', 'MRU': 'UM', 'MUR': '₨', 'MVR': '.ر', 'MWK': 'MK', 'MXN': '$', 
            'MYR': 'RM', 'MZN': 'MT', 'NAD': '$', 'NGN': '₦', 'NIO': 'C$', 'NOK': 'kr', 
            'NPR': '₨', 'NZD': '$', 'OMR': '﷼', 'PAB': 'B/.', 'PEN': 'S/.', 'PGK': 'K', 
            'PHP': '₱', 'PKR': '₨', 'PLN': 'zł', 'PYG': 'Gs', 'QAR': '﷼', 'RON': 'lei', 
            'RSD': 'Дин.', 'RUB': '₽', 'RWF': 'R₣', 'SAR': '﷼', 'SBD': '$', 'SCR': '₨', 
            'SDG': 'ج.س.', 'SEK': 'kr', 'SGD': '$', 'SLL': 'Le', 'SOS': 'S', 'SRD': '$', 
            'SSP': '£', 'STN': 'Db', 'SYP': '£', 'SZL': 'L', 'THB': '฿', 'TJS': 'SM', 
            'TMT': 'T', 'TND': 'د.ت', 'TOP': 'T$', 'TRY': '₺', 'TTD': 'TT$', 'TWD': 'NT$', 
            'TZS': 'TSh', 'UAH': '₴', 'UGX': 'USh', 'UYU': '$U', 'UZS': 'лв', 'VES': 'Bs.S', 
            'VND': '₫', 'VUV': 'VT', 'WST': 'WS$', 'XAF': 'FCFA', 'XCD': '$', 'XOF': 'CFA', 
            'XPF': '₣', 'YER': '﷼', 'ZAR': 'R', 'ZMW': 'ZK', 'ZWL': '$'
        };

        let symbol = symbols[cur] || '$';
        
        // Fallback: Use Intl.NumberFormat if available and symbol is still default for non-USD
        if (symbol === '$' && cur !== 'USD') {
            try {
                const parts = new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).formatToParts(1);
                const foundSymbol = parts.find(p => p.type === 'currency')?.value;
                if (foundSymbol) symbol = foundSymbol;
            } catch (e) {
                // Keep default $
            }
        }

        return { base: fee, tax: 0, total: fee, currency: symbol, suffix: cur, hasTax: false };
    }, [formData.country, formData.couponCode, fetchedFee]);

    const stepLabels = ["Basic Information", "Shop Details", "Payment"];

    const backButtonLabel = step === 1 ? "Back to Access Selection" : `Back to Step ${step - 1}`;

    return (
        <div className="min-h-screen geometric-bg flex flex-col">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-20 sm:top-24 left-4 sm:left-6 z-40"
            >
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="group text-[#272727] hover:text-[#0EA0DC] hover:bg-white hover:shadow-[0_0_20px_rgba(14,160,220,0.25)] transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-md border-2 border-[#0EA0DC]/30 hover:border-[#0EA0DC] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 gap-2"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="hidden sm:inline" key={`back-label-${step}`}>{backButtonLabel}</span>
                    <span className="sm:hidden">Back</span>
                </Button>
            </motion.div>

            <div className="flex-1 flex items-center justify-center p-4 pt-20 sm:pt-24 mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl"
                >
                    <Card className="skygloss-card p-8 rounded-2xl bg-white border-2 border-[#0EA0DC]/10 shadow-[0_8px_30px_rgba(14,160,220,0.1)]">
                        <div className="flex justify-between items-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA0DC] to-[#0EA0DC]/80 flex items-center justify-center shadow-[0_4px_16px_rgba(14,160,220,0.3)]"
                            >
                                <PartnerIcon className="text-white w-6 h-6" />
                            </motion.div>
                            <div className="flex gap-2">
                                <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#0EA0DC]' : 'bg-[#0EA0DC]/20'}`} />
                                <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#0EA0DC]' : 'bg-[#0EA0DC]/20'}`} />
                                <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#0EA0DC]' : 'bg-[#0EA0DC]/20'}`} />
                            </div>
                        </div>

                        <div className="text-center mb-8" key={`step-header-${step}`}>
                            <h2 className="text-2xl text-[#272727] mb-2 font-semibold">Shop Registration - Step {step}</h2>
                            <p className="text-[#666666]">{stepLabels[step - 1]}</p>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (step === 1) {
                                if (validateStep()) {
                                    const webhookPayload = {
                                        ...formData,
                                        hearAboutUs: formData.hearAboutUs === 'Other' ? formData.hearAboutUsOther : formData.hearAboutUs
                                    };
                                    sendToWebhook('https://services.leadconnectorhq.com/hooks/0ECH0AoivQGV58EtMuli/webhook-trigger/afe01ddb-f238-4d55-9243-3716a98b6505', webhookPayload);
                                    setStep(2);
                                }
                            } else if (step === 2) {
                                if (formData.couponCode === 'CERTIFICATIONONUS') {
                                    handleSubmit(e);
                                } else if (validateStep()) {
                                    setStep(3);
                                }
                            } else {
                                handleSubmit(e);
                            }
                        }} className="space-y-5">

                            {/* ===== STEP 1: Basic Information ===== */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-5"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">First Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">Last Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Shop Name <span className="text-xs text-[#999]">(max 30 characters)</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="shopName" value={formData.shopName} onChange={(e) => { if (e.target.value.length <= 30) handleChange(e); }} maxLength={30} placeholder="Shop Name" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                        <p className={`text-[11px] mt-1 text-right ${formData.shopName.length >= 30 ? 'text-red-500 font-medium' : 'text-[#999]'}`}>{formData.shopName.length}/30</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Email Address <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create secure password" minLength={6} className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Country <span className="text-red-500">*</span></label>
                                        <div className="relative" ref={countryDropdownRef}>
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] z-10" />
                                            {/* Selected country display / search input */}
                                            <div
                                                className="w-full pl-10 pr-4 h-11 bg-white border border-[#0EA0DC]/30 focus-within:border-[#0EA0DC] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                                                onClick={() => { if (!isLoading) setCountryDropdownOpen(!countryDropdownOpen); }}
                                            >
                                                {formData.country && countryISO && !countryDropdownOpen ? (
                                                    <>
                                                        <img src={getFlagUrl(countryISO)!} alt="" className="w-5 h-4 object-cover rounded-sm border border-gray-100" />
                                                        <span className="text-[#272727] text-sm truncate">{formData.country}</span>
                                                    </>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={countrySearch}
                                                        onChange={(e) => { setCountrySearch(e.target.value); setCountryDropdownOpen(true); }}
                                                        onFocus={() => setCountryDropdownOpen(true)}
                                                        placeholder={formData.country || "Search country..."}
                                                        className="w-full bg-transparent outline-none text-sm text-[#272727] placeholder:text-[#999]"
                                                        disabled={isLoading}
                                                    />
                                                )}
                                            </div>
                                            {/* Hidden required input for form validation */}
                                            <input type="hidden" name="country" value={formData.country} required />
                                            {/* Dropdown list */}
                                            {countryDropdownOpen && (
                                                <div className="absolute z-50 top-12 left-0 right-0 bg-white border border-[#0EA0DC]/20 rounded-lg shadow-lg max-h-[250px] overflow-y-auto">
                                                    {filteredCountries.length === 0 ? (
                                                        <div className="px-4 py-3 text-sm text-[#999]">No countries found</div>
                                                    ) : (
                                                        filteredCountries.map(country => (
                                                            <div
                                                                key={country.isoCode}
                                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0EA0DC]/5 cursor-pointer transition-colors"
                                                                onClick={() => {
                                                                    const countryName = country.name;
                                                                    setFormData({ ...formData, country: countryName, city: '' });
                                                                    setCountryISO(country.isoCode);
                                                                    setCallingCode(`+${country.phonecode}`);
                                                                    const rawCities = City.getCitiesOfCountry(country.isoCode) || [];
                                                                    const rawStates = State.getStatesOfCountry(country.isoCode) || [];
                                                                    const combined = [...rawCities, ...rawStates]
                                                                        .map(item => ({ ...item, name: normalizeName(item.name) }))
                                                                        .filter((item, index, self) => index === self.findIndex((t) => t.name === item.name))
                                                                        .sort((a, b) => a.name.localeCompare(b.name));
                                                                    setCities(combined);
                                                                    setCountryDropdownOpen(false);
                                                                    setCountrySearch('');
                                                                }}
                                                            >
                                                                <img src={getFlagUrl(country.isoCode)!} alt="" className="w-5 h-4 object-cover rounded-sm border border-gray-100 shrink-0" />
                                                                <span className="text-sm text-[#272727] font-medium">{country.name}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">


                                        {noPartnerId ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                            >
                                                <label className="block text-sm text-[#272727] mb-2 font-medium">How did you hear about us? <span className="text-red-500">*</span></label>
                                                <select
                                                    name="hearAboutUs"
                                                    value={formData.hearAboutUs}
                                                    onChange={handleChange}
                                                    className="w-full px-4 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none"
                                                    disabled={isLoading}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="X">X (Twitter)</option>
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="Friend">Friend</option>
                                                    <option value="Internet">Internet</option>
                                                    <option value="Other">Other</option>
                                                </select>

                                                {formData.hearAboutUs === 'Other' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-3"
                                                    >
                                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Please specify <span className="text-red-500">*</span></label>
                                                        <Input
                                                            required
                                                            type="text"
                                                            name="hearAboutUsOther"
                                                            value={formData.hearAboutUsOther}
                                                            onChange={handleChange}
                                                            placeholder="Please specify how you heard about us"
                                                            className="h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors"
                                                            disabled={isLoading}
                                                        />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                            >
                                                <label className="block text-sm text-[#272727] mb-2 font-medium">
                                                    Partner ID (4-10 characters) {formData.couponCode !== 'CERTIFICATIONONUS' && <span className="text-red-500">*</span>}
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                    <Input
                                                        required={!noPartnerId && formData.couponCode !== 'CERTIFICATIONONUS'}
                                                        type="text"
                                                        name="referredByPartnerCode"
                                                        minLength={4}
                                                        maxLength={10}
                                                        pattern="[a-zA-Z0-9]{4,10}"
                                                        value={formData.referredByPartnerCode}
                                                        onChange={handleChange}
                                                        placeholder="Enter the 4-10 digit Partner ID"
                                                        className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="noPartnerId"
                                                checked={noPartnerId}
                                                onChange={(e) => setNoPartnerId(e.target.checked)}
                                                className="w-4 h-4 text-[#0EA0DC] rounded border-[#0EA0DC]/30 accent-[#0EA0DC]"
                                            />
                                            <label htmlFor="noPartnerId" className="text-sm font-medium text-[#272727]">
                                                Don't have Partner ID?
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-4 ">
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Coupon Code (Optional)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input
                                                type="text"
                                                name="couponCode"
                                                value={formData.couponCode}
                                                onChange={handleChange}
                                                placeholder="Enter coupon code"
                                                className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors uppercase"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        {formData.couponCode === 'CERTIFICATIONONUS' && (
                                            <p className="text-[12px] text-emerald-600 mt-1 font-medium">✨ Certification Bonus Applied: 100% Discount!</p>
                                        )}
                                    </div>

                                </motion.div>
                            )}

                            {/* ===== STEP 2: Shop Details ===== */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street / House No." className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">City <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <select
                                                required
                                                name="city"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full pl-10 pr-4 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none"
                                                disabled={isLoading}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((city, index) => (
                                                    <option key={`${city.name}-${index}`} value={city.name}>
                                                        {city.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">ZIP Code</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="ZIP / Postal Code" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Phone Number <span className="text-red-500">*</span></label>
                                        <div className="skygloss-phone-input-wrapper">
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                value={formData.phoneNumber}
                                                onChange={(val) => setFormData({ ...formData, phoneNumber: val || "" })}
                                                defaultCountry={countryISO || undefined}
                                                international
                                                withCountryCallingCode
                                                className="skygloss-phone-input"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>


                                    {/* Social Media Links */}
                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="yourwebsite.com" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Facebook</label>
                                        <div className="relative">
                                            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="facebook.com/yourpage" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Instagram</label>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="instagram.com/yourprofile" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">YouTube</label>
                                        <div className="relative">
                                            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="youtube" value={formData.youtube} onChange={handleChange} placeholder="youtube.com/yourchannel" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">TikTok</label>
                                        <div className="relative">
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                                            <Input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} placeholder="tiktok.com/@yourprofile" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">LinkedIn</label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourprofile" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                </motion.div>
                            )}

                            {/* ===== STEP 3: Payment ===== */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center">
                                            <Lock className="w-8 h-8 text-[#0EA0DC]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#272727] mb-2">Secure Payment</h3>
                                        <div className="my-6 p-4 bg-white rounded-xl border-2 border-[#0EA0DC]/20 shadow-sm inline-block min-w-[240px]">
                                            <div className="flex flex-col gap-1">
                                                {registrationFee.isFree ? (
                                                    <div className="py-2">
                                                        <div className="text-emerald-600 font-bold text-lg mb-1">Coupon Applied!</div>
                                                        <div className="text-slate-500 text-sm italic">"CERTIFICATIONONUS"</div>
                                                        <div className="h-px bg-slate-100 my-3"></div>
                                                        <div className="flex justify-between items-center text-emerald-700">
                                                            <span className="text-sm font-bold uppercase tracking-wider">Total Payment:</span>
                                                            <span className="text-2xl font-black">FREE</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between text-sm text-[#666666]">
                                                            <span>Base Fee:</span>
                                                            <span className="font-bold">{registrationFee.currency}{registrationFee.base}</span>
                                                        </div>
                                                        {registrationFee.hasTax && (
                                                            <div className="flex justify-between text-sm text-emerald-600">
                                                                <span>GST (10%):</span>
                                                                <span className="font-bold">+{registrationFee.currency}{registrationFee.tax}</span>
                                                            </div>
                                                        )}
                                                        <div className="h-px bg-slate-100 my-2"></div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-[#272727] uppercase tracking-wider">Total Payment:</span>
                                                            <div className="text-3xl font-black text-[#272727]">
                                                                {registrationFee.currency}{registrationFee.total}
                                                                <span className="text-sm ml-1 text-[#0EA0DC]">{registrationFee.suffix}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[#666666] mb-4">You will be redirected to our secure payment page to complete your registration.</p>
                                        <div className="flex flex-col gap-2 text-sm text-[#666666]">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span>SSL Secured Payment</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span>Powered by Stripe</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-6 flex flex-col gap-4" key={`step-buttons-${step}`}>
                                {step === 3 ? (
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <Button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            disabled={isLoading}
                                            variant="outline"
                                            className="flex-1 h-14 text-lg border-2 border-[#0EA0DC] text-[#0EA0DC] hover:bg-[#0EA0DC]/5 shadow-sm transition-all duration-300"
                                        >
                                            Back
                                        </Button>
                                        {/* <Button
                                            type="button"
                                            onClick={(e) => handleSubmit(e, true)}
                                            disabled={isLoading || !isStepValid}
                                            variant="outline"
                                            className="flex-[1.5] h-14 text-lg border-2 border-slate-300 text-white hover:bg-[#0EA0DC]/10 shadow-sm transition-all duration-300 hover:text-[#0EA0DC]"
                                        >
                                            {isLoading ? "Processing..." : "Pay Later"}
                                        </Button> */}
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !isStepValid}
                                            className="flex-[2] h-14 text-lg bg-[#0EA0DC] hover:bg-[#0EA0DC]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            {isLoading ? "Processing..." : "Pay Now"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        {step > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => setStep(step - 1)}
                                                disabled={isLoading}
                                                variant="outline"
                                                className="flex-1 h-14 text-lg border-2 border-[#0EA0DC] text-[#0EA0DC] hover:bg-[#0EA0DC]/5 shadow-sm transition-all duration-300"
                                            >
                                                Back to Step {step - 1}
                                            </Button>
                                        )}
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !isStepValid}
                                            className={`h-14 text-lg bg-[#0EA0DC] hover:bg-[#0EA0DC]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${step > 1 ? 'flex-[2]' : 'w-full'}`}
                                        >
                                            {isLoading ? "Processing..." :
                                                step === 1 ? "Next Step" :
                                                    (step === 2 && formData.couponCode === 'CERTIFICATIONONUS') ? "Complete Registration" :
                                                        "Next Step"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="text-center mt-6">
                                <button type="button" onClick={() => navigate('/login/shop')} className="text-[#0EA0DC] hover:text-[#0EA0DC]/80 font-medium hover:underline transition-colors duration-200">
                                    Already a registered shop? Login here
                                </button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
