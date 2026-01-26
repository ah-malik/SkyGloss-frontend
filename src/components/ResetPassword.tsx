import { motion } from "motion/react";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router";

export function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleBack = () => {
        navigate("/");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!token) {
            alert("Invalid or missing reset token");
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: password
            });
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err: any) {
            setIsLoading(false);
            alert(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        }
    };

    return (
        <div className="min-h-screen geometric-bg flex items-center justify-center p-4 pt-20 sm:pt-24">
            {/* Back Button */}
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
                    <span className="hidden sm:inline">Back</span>
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <Card className="skygloss-card p-8 rounded-2xl bg-white shadow-xl">
                    {!isSuccess ? (
                        <>
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-16 h-16 mx-auto rounded-lg bg-[#0EA0DC] flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(14,160,220,0.3)]"
                            >
                                <Lock className="text-white w-8 h-8" />
                            </motion.div>

                            {/* Title */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-[#272727] mb-2">Set New Password</h2>
                                <p className="text-[#666666]">Please enter your new password below</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#272727]">
                                            New Password
                                        </label>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg"
                                            required
                                            minLength={6}
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#272727]">
                                            Confirm Password
                                        </label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white border-[#0EA0DC]/30 focus:border-[#0EA0DC] focus:ring-[#0EA0DC] rounded-lg"
                                            required
                                            minLength={6}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !password || !confirmPassword}
                                    className="w-full skygloss-button h-12"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6"
                            >
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[#272727] mb-2">Success!</h2>
                            <p className="text-[#666666] mb-8">
                                Your password has been reset successfully. Redirecting you to login...
                            </p>
                            <Button
                                onClick={() => navigate("/")}
                                className="w-full skygloss-button h-12"
                            >
                                Go to Login Now
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
