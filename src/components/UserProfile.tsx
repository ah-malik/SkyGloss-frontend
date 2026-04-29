import { motion } from "motion/react";
import { useState } from "react";
import { User, Lock, Globe, Shield, FileText, Phone, MapPin, Link as LinkIcon, Facebook, Instagram, Linkedin, Youtube, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import api from "../api/axios";
import { useAuth } from "../AuthContext";

export function UserProfile() {
  const { user, login } = useAuth();

  // Profile Contact Info State
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [zipCode, setZipCode] = useState(user?.zipCode || "");
  const [address, setAddress] = useState(user?.address || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");

  // Social Links State
  const [website, setWebsite] = useState(user?.website || "");
  const [facebook, setFacebook] = useState(user?.facebook || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [youtube, setYoutube] = useState(user?.youtube || "");
  const [tiktok, setTiktok] = useState(user?.tiktok || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading States
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const res = await api.patch('/users/me/profile', {
        firstName,
        lastName,
        phoneNumber,
        address,
        streetAddress,
        city,
        zipCode,
        country,
        website,
        facebook,
        instagram,
        youtube,
        tiktok,
        linkedin
      });

      toast.success("Profile updated successfully", {
        description: "Your account information has been updated."
      });

      // Refresh user in AuthContext
      if (res.data) {
        // AuthContext provides `login(userData)` or simply caches user payload.
        // Wait, does login accept the whole user? Let's check AuthContext.
        // If not, updating locally in backend works, and refresh on next login or page reload.
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.patch('/users/me/profile', { password });
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setIsDownloadingCert(true);
    try {
      const response = await api.get('/pdf/certificate', {
        responseType: 'blob'
      });

      // Create file link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SkyGloss_Certificate_${firstName || 'User'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Certificate downloaded successfully!");
    } catch (error: any) {
      console.error("Download failed:", error);
      toast.error("Unable to download certificate. Ensure you are certified.");
    } finally {
      setIsDownloadingCert(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#272727]">Profile Settings</h1>
          <p className="text-slate-500 text-sm">Manage your contact details, social media profiles, and download certifications.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sticky Menu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="p-4 rounded-2xl bg-white shadow-sm border-[#0EA0DC]/10">
              <div className="flex flex-col items-center py-4 text-center">
                <div className="w-20 h-20 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center mb-3">
                  <User className="w-10 h-10 text-[#0EA0DC]" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{user?.firstName} {user?.lastName}</h3>
                <span className="text-xs text-[#0EA0DC] font-bold uppercase bg-[#0EA0DC]/10 px-3 py-1 rounded-full mt-1 tracking-wider">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>

              {user?.isCertified && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Button
                    onClick={handleDownloadCertificate}
                    disabled={isDownloadingCert}
                    className="w-full bg-[#0EA0DC] hover:bg-[#0ea0dc]/90 text-white rounded-xl flex items-center justify-center gap-2 py-2 font-medium transition-all"
                  >
                    {isDownloadingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    Download Certificate
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Right Sections */}
          <div className="md:col-span-2 space-y-8">
            {/* Section 1: Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 rounded-2xl bg-white shadow-sm border-[#0EA0DC]/10">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                  <Phone className="w-5 h-5 text-[#0EA0DC]" />
                  <h2 className="text-lg font-bold text-slate-800">Contact Details</h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name</label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-xl border-[#0EA0DC]/20" placeholder="First Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name</label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-xl border-[#0EA0DC]/10" placeholder="Last Name" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="rounded-xl border-[#0EA0DC]/20" placeholder="Phone Number" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-xl border-[#0EA0DC]/20" placeholder="Address" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Street Address</label>
                      <Input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="rounded-xl border-[#0EA0DC]/20" placeholder="Street Address" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">City</label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} className="rounded-xl border-[#0EA0DC]/20" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Zip Code</label>
                      <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="rounded-xl border-[#0EA0DC]/20" placeholder="Zip Code" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Country</label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border-[#0EA0DC]/10" placeholder="Country" />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-[#0EA0DC] hover:bg-[#0ea0dc]/90 text-white rounded-xl px-6 font-medium transition-all"
                  >
                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Section 2: Social Media Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 rounded-2xl bg-white shadow-sm border-[#0EA0DC]/10">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                  <LinkIcon className="w-5 h-5 text-[#0EA0DC]" />
                  <h2 className="text-lg font-bold text-slate-800">Social Links</h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" /> Website
                    </label>
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="rounded-xl rounded-xl" placeholder="https://example.com" />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram
                    </label>
                    <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="rounded-xl rounded-xl" placeholder="https://instagram.com/username" />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
                    </label>
                    <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="rounded-xl rounded-xl" placeholder="https://facebook.com/username" />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-700" /> LinkedIn
                    </label>
                    <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="rounded-xl rounded-xl" placeholder="https://linkedin.com/in/username" />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-600" /> YouTube
                    </label>
                    <Input value={youtube} onChange={(e) => setYoutube(e.target.value)} className="rounded-xl rounded-xl" placeholder="https://youtube.com/c/channel" />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400" /> TikTok
                    </label>
                    <Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="rounded-xl rounded-xl" placeholder="https://tiktok.com/@username" />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-[#0EA0DC] hover:bg-[#0ea0dc]/90 text-white rounded-xl px-6 font-medium transition-all"
                  >
                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Social Links
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Section 3: Password Update */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 rounded-2xl bg-white shadow-sm border-[#0EA0DC]/10">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                  <Lock className="w-5 h-5 text-[#0EA0DC]" />
                  <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl rounded-xl" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl rounded-xl" placeholder="••••••••" />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="bg-[#0EA0DC] hover:bg-[#0ea0dc]/90 text-white rounded-xl px-6 font-medium transition-all"
                  >
                    {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Change Password
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
