import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect, useMemo } from "react";
import { Country, State, City } from 'country-state-city';
import { ArrowLeft, Mail, Lock, User, MapPin, Phone, Globe, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { PartnerIcon } from "./CustomIcons";
import { Footer } from "./Footer";
import { useNavigate } from "react-router";

const normalizeName = (name: string) => {
    if (!name) return '';
    return name
        .normalize('NFD') // Separate characters from diacritics
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/ı/g, 'i') // Special handling for Turkish dotless i
        .replace(/İ/g, 'I'); // Special handling for Turkish dotted I
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
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "certified_shop",
        country: "",
        address: "",
        streetAddress: "",
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
    const [noPartnerId, setNoPartnerId] = useState(false);

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
            const { city, address, phoneNumber } = formData;
            return !!(city && address && phoneNumber);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const fullPhone = callingCode ? `${callingCode} ${formData.phoneNumber}` : formData.phoneNumber;
            const response = await api.post('/auth/register-shop', { ...formData, phoneNumber: fullPhone });

            // Send complete registration data to webhook
            const webhookPayload = { 
                ...formData, 
                phoneNumber: fullPhone,
                hearAboutUs: formData.hearAboutUs === 'Other' ? formData.hearAboutUsOther : formData.hearAboutUs
            };
            sendToWebhook('https://services.leadconnectorhq.com/hooks/0ECH0AoivQGV58EtMuli/webhook-trigger/db039a1b-f492-48b4-9433-3b82997bb1cf', webhookPayload);

            if (response.data?.stripeUrl) {
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
        const country = formData.country.toLowerCase().trim();
        const isFree = formData.couponCode === 'CERTIFICATIONONUS';

        if (isFree) {
            return { base: 0, tax: 0, total: 0, currency: '$', suffix: 'USD', hasTax: false, isFree: true };
        }

        if (country === 'australia' || country === 'new zealand') {
            return { base: 1800, tax: 180, total: 1980, currency: '$', suffix: 'AUD', hasTax: true };
        } else if (europeanCountries.includes(country)) {
            return { base: 250, tax: 0, total: 250, currency: '€', suffix: 'EUR', hasTax: false };
        }
        return { base: 250, tax: 0, total: 250, currency: '$', suffix: 'USD', hasTax: false };
    }, [formData.country]);

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
                    <span className="hidden sm:inline">{backButtonLabel}</span>
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

                        <div className="text-center mb-8">
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
                                    sendToWebhook('https://services.leadconnectorhq.com/hooks/0ECH0AoivQGV58EtMuli/webhook-trigger/e78768f0-50af-4496-8cd3-dede128410ef', webhookPayload);
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
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Shop Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Shop Name" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
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
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <select
                                                required
                                                name="country"
                                                value={formData.country}
                                                onChange={(e) => {
                                                    const countryName = e.target.value;
                                                    const countryObj = countries.find(c => c.name === countryName);
                                                    setFormData({ ...formData, country: countryName, city: '' });
                                                    if (countryObj) {
                                                        setCallingCode(`+${countryObj.phonecode}`);
                                                        const rawCities = City.getCitiesOfCountry(countryObj.isoCode) || [];
                                                        const rawStates = State.getStatesOfCountry(countryObj.isoCode) || [];

                                                        const combined = [...rawCities, ...rawStates]
                                                            .map(item => ({
                                                                ...item,
                                                                name: normalizeName(item.name)
                                                            }))
                                                            .filter((item, index, self) =>
                                                                index === self.findIndex((t) => t.name === item.name)
                                                            )
                                                            .sort((a, b) => a.name.localeCompare(b.name));

                                                        setCities(combined);
                                                    } else {
                                                        setCallingCode("");
                                                        setCities([]);
                                                    }
                                                }}
                                                className="w-full pl-10 pr-4 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none"
                                                disabled={isLoading}
                                            >
                                                <option value="">Select Country</option>
                                                {countries.map(country => (
                                                    <option key={country.isoCode} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
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
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Address <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address Line 1" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
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
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Street Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="Street / House No." className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
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
                                        <div className="flex gap-2">
                                            <select
                                                value={callingCode}
                                                onChange={(e) => setCallingCode(e.target.value)}
                                                className="w-[110px] shrink-0 px-2 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none text-sm"
                                                disabled={isLoading}
                                            >
                                                <option value="">Code</option>
                                                {countries.map(c => (
                                                    <option key={c.isoCode} value={`+${c.phonecode}`}>
                                                        {c.isoCode} +{c.phonecode}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="relative flex-1">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="234 567 8900" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Media Links */}
                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Facebook</label>
                                        <div className="relative">
                                            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="url" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://facebook.com/yourpage" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">Instagram</label>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="url" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/yourprofile" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">YouTube</label>
                                        <div className="relative">
                                            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="url" name="youtube" value={formData.youtube} onChange={handleChange} placeholder="https://youtube.com/yourchannel" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">TikTok</label>
                                        <div className="relative">
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                                            <Input type="url" name="tiktok" value={formData.tiktok} onChange={handleChange} placeholder="https://tiktok.com/@yourprofile" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-[#272727] mb-2 font-medium">LinkedIn</label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                            <Input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
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

                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
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
                                                step === 2 ? "Next Step" :
                                                    "Complete Registration"}
                                </Button>
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
