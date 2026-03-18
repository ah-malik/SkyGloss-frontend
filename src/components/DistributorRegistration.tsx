import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect, useMemo } from "react";
import { Country, State, City } from 'country-state-city';
import { ArrowLeft, Mail, Lock, User, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { DistributorIcon } from "./CustomIcons";
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

export function DistributorRegistration() {
    const navigate = useNavigate();

    const [cities, setCities] = useState<any[]>([]);
    const countries = useMemo(() => Country.getAllCountries(), []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "regional_distributor",
        country: "",
        address: "",
        city: "",
        phoneNumber: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleBack = () => {
        navigate("/");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register-distributor', formData);
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
                    <span className="hidden sm:inline">Back to Access Selection</span>
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
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-[#0EA0DC] to-[#0EA0DC]/80 flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(14,160,220,0.3)]"
                        >
                            <DistributorIcon className="text-white" />
                        </motion.div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl text-[#272727] mb-2 font-semibold">Distributor Registration</h2>
                            <p className="text-[#666666]">Complete your details to become a partner. A $250 fee applies.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                    <Input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create secure password" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                            disabled={!formData.country || isLoading}
                                        >
                                            <option value="">{formData.country ? 'Select City' : 'Select Country First'}</option>
                                            {cities.map((city, index) => (
                                                <option key={`${city.name}-${index}`} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-[#272727] mb-2 font-medium">Street Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                        <Input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full street address" className="pl-10 h-11 bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors" disabled={isLoading} />
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

                            <div className="pt-6">
                                <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg bg-[#0EA0DC] hover:bg-[#0EA0DC]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                    {isLoading ? "Processing Registration..." : "Continue to Payment ($250)"}
                                </Button>
                            </div>
                            <div className="text-center mt-6">
                                <button type="button" onClick={() => navigate('/login/distributor')} className="text-[#0EA0DC] hover:text-[#0EA0DC]/80 font-medium hover:underline transition-colors duration-200">
                                    Already a registered distributor? Login here
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
