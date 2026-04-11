import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect, useMemo } from "react";
import { Country, State, City } from 'country-state-city';
import { ArrowLeft, Mail, Lock, User, MapPin, Phone } from "lucide-react";
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

export function ShopRegistration() {
    const navigate = useNavigate();

    const [cities, setCities] = useState<any[]>([]);
    const [step, setStep] = useState(1);
    const countries = useMemo(() => Country.getAllCountries(), []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "certified_shop", // Updated default
        country: "",
        address: "",
        streetAddress: "",
        city: "",
        zipCode: "",
        phoneNumber: "",
        shopName: "",
        hearAboutUs: "",
        referredByPartnerCode: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const handleBack = () => {
        if (step === 2) setStep(1);
        else navigate("/");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isSpain = formData.country.toLowerCase() === "spain";
    const pricingText = isSpain ? "225€" : "$250";

    const isStepValid = useMemo(() => {
        if (step === 1) {
            const { firstName, lastName, email, password, country, hearAboutUs, referredByPartnerCode } = formData;
            const basicInfo = firstName && lastName && email && password.length >= 6 && country;
            const referralInfo = hearAboutUs || (referredByPartnerCode && referredByPartnerCode.length >= 4);
            return !!(basicInfo && referralInfo);
        } else {
            const { city, address, zipCode, phoneNumber } = formData;
            return !!(city && address && zipCode && phoneNumber);
        }
    }, [formData, step]);

    const validateStep1 = () => {
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
            const response = await api.post('/auth/register-shop', formData);
            if (response.data?.stripeUrl) {
                window.location.href = response.data.stripeUrl;
            } else {
                alert("Registration successful but payment link is missing.");
                setIsLoading(false);
            }
        } catch (err: any) {
            setIsLoading(false);
            alert(err.response?.data?.message || 'Registration failed. Please check your details.');
        }
    };

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
                    <span className="hidden sm:inline">{step === 1 ? "Back to Access Selection" : "Back to Step 1"}</span>
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
                                <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-[#0EA0DC]' : 'bg-[#0EA0DC]/20'}`} />
                                <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-[#0EA0DC]' : 'bg-[#0EA0DC]/20'}`} />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl text-[#272727] mb-2 font-semibold">Shop Registration - Step {step}</h2>
                            <p className="text-[#666666]">
                                {step === 1 ? "Start with your basic information." : "Provide your shop address details."} 
                                {/* <span className="block mt-1 font-medium text-[#0EA0DC]">A {pricingText} fee applies.</span> */}
                            </p>
                        </div>

                        <form onSubmit={(e) => {
                            if (step === 1) {
                                e.preventDefault();
                                if (validateStep1()) setStep(2);
                            } else {
                                handleSubmit(e);
                            }
                        }} className="space-y-5">
                            {step === 1 ? (
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">Shop Name (Optional)</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Shop Name" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">How did you hear about us?</label>
                                            <select
                                                name="hearAboutUs"
                                                value={formData.hearAboutUs}
                                                onChange={handleChange}
                                                className="w-full px-4 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none"
                                                disabled={isLoading}
                                            >
                                                <option value="">Select (Optional - Shows Partner ID)</option>
                                                <option value="Facebook">Facebook</option>
                                                <option value="X">X (Twitter)</option>
                                                <option value="Instagram">Instagram</option>
                                                <option value="Friend">Friend</option>
                                                <option value="Internet">Internet</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {!formData.hearAboutUs && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">Partner ID (4-8 characters) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input
                                                    required={!formData.hearAboutUs}
                                                    type="text"
                                                    name="referredByPartnerCode"
                                                    minLength={4}
                                                    maxLength={8}
                                                    pattern="[a-zA-Z0-9]{4,8}"
                                                    value={formData.referredByPartnerCode}
                                                    onChange={handleChange}
                                                    placeholder="Enter the Partner ID"
                                                    className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

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
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-5"
                                >
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">Address <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address Line 1" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">Street Address (Optional)</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="Street / House No." className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">ZIP Code <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="ZIP / Postal Code" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-[#272727] mb-2 font-medium">Phone Number <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <Input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 234 567 8900" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                {step === 2 && (
                                    <Button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        disabled={isLoading}
                                        variant="outline"
                                        className="flex-1 h-14 text-lg border-2 border-[#0EA0DC] text-[#0EA0DC] hover:bg-[#0EA0DC]/5 shadow-sm transition-all duration-300"
                                    >
                                        Back to Step 1
                                    </Button>
                                )}
                                <Button 
                                    type="submit" 
                                    disabled={isLoading || !isStepValid} 
                                    className={`h-14 text-lg bg-[#0EA0DC] hover:bg-[#0EA0DC]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${step === 2 ? 'flex-[2]' : 'w-full'}`}
                                >
                                    {isLoading ? "Processing..." : step === 1 ? "Next Step" : `Complete Registration (${pricingText})`}
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
