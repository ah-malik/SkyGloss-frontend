import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, ShoppingCart, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAuth } from '../AuthContext';
import { useLocation } from 'react-router';

const REGIONAL_ISO_CODES = [
    // USA, Canada, Australia, New Zealand
    'US', 'CA', 'AU', 'NZ',

    // Europe (excluding Belarus, Russia, and Turkey)
    'AL', 'AD', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA',

    // Africa
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'
];

// Helper to check if country matches regions
// Note: We might have country names or ISO codes depending on how they are stored.
// If stored as names, we'll need a mapping or just check names.
const EUROPE_NAMES = [
    'Albania', 'Andorra', 'Austria', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'
];

const AFRICA_NAMES = [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Congo (DRC)', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

const ALLOWED_COUNTRIES = [
    'United States', 'USA', 'US', 'Canada', 'Australia', 'New Zealand',
    ...EUROPE_NAMES,
    ...AFRICA_NAMES
];

export function RegionalWelcomePopup() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (!user || !user._id || !user.country) return;
        
        // Only show the popup when the user is actually on the dashboard
        if (!location.pathname.includes('dashboard')) return;

        // 1. Check if user country is in the allowed list
        const countryName = user.country;
        const isAllowed = ALLOWED_COUNTRIES.some(c =>
            countryName.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(countryName.toLowerCase())
        );

        if (!isAllowed) return;

        // 2. Check login/show count from localStorage
        const storageKey = `skygloss_welcome_popup_count_${user._id}`;
        const showCount = parseInt(localStorage.getItem(storageKey) || "0");

        if (showCount < 1) {
            setIsVisible(true);
            localStorage.setItem(storageKey, (showCount + 1).toString());
        }
    }, [user, location.pathname]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-[#0EA0DC]/10"
                >
                    {/* Header with Background Pattern */}
                    <div className="relative h-32 bg-[#0EA0DC] flex items-center 
                    justify-center overflow-hidden">
                        {/* <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="1" />
                            </svg>
                        </div> */}
                        <div className="relative z-10  p-4 rounded-full ">
                            {/* <GraduationCap className="w-10 h-10 text-white" /> */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#ffffff] mb-3">
                                Welcome to the SkyGloss Portal
                            </h2>
                            <p className="text-white text-center font-semibold mb-6">We’re excited to have you here.</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-2 sm:p-6 text-center">


                        <div className="space-y-4 text-[#666666] text-sm sm:text-base leading-relaxed text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p>
                                Before you begin the training, we <span className="text-[#272727] font-bold">strongly recommend</span> placing your first product order.
                            </p>
                            <p>
                                Certification is built around real application, and having product on the way ensures you can apply what you’re learning without delay.
                            </p>
                            <p className="italic">
                                Start your training, and by the time you’re ready for your first application, your product will be ready too.
                            </p>
                            <p className="mt-2 text-slate-500">If you need anything, visit the Support tab or contact your representative.</p>
                            <p className="mt-2 font-bold text-slate-500">Best Regards,<br />SkyGloss Team</p>
                        </div>

                        {/* <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-400">
                            <p>If you need anything, visit the Support tab or contact your representative.</p>
                            <p className="mt-2 font-medium text-slate-500">Best Regards,<br />SkyGloss Team</p>
                        </div> */}

                        <div className="mt-4">
                            <Button
                                onClick={handleClose}
                                className="w-full bg-[#0EA0DC] hover:bg-[#0b89bc] text-white py-6 rounded-2xl font-bold text-lg shadow-lg shadow-[#0EA0DC]/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Got it, Let's Start!
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
