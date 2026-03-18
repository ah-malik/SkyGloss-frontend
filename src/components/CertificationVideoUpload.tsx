import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, CheckCircle, Video, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';
import api from '../api/axios';

export function CertificationVideoUpload() {
    const { user, setUser } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const COURSE_STEPS: Record<string, number> = {
        UNDERSTANDING_SKYGLOSS: 9,
        FUSION: 13,
        RESIN_FILM: 4,
        SHINE: 3,
        MATTE: 3,
        SEAL: 3,
    };

    const getCompletedCount = () => {
        if (!user) return 0;
        let count = 0;
        const legacyCount = user.completedCourses?.length || 0;
        if (user.courseProgress) {
            Object.entries(COURSE_STEPS).forEach(([courseKey, totalSteps]) => {
                const progress = user.courseProgress[courseKey] || user.courseProgress[courseKey.replace('_', ' ')] || [];
                if (progress && progress.length >= totalSteps) {
                    count++;
                }
            });
        }
        return Math.max(count, legacyCount);
    };

    // Only Self-Registered distributors with 6 completed courses are eligible
    const isSelfRegistered = user?.isSelfRegistered === true;
    const completedCount = getCompletedCount();
    const isEligible = isSelfRegistered && completedCount >= 6;
    const alreadyUploaded = !!user?.certificationVideoUrl;

    // Render Nothing if they are eligible but not matching criteria, unless they already uploaded!
    // Wait, if they are self-registered but haven't finished courses, show a locked state?
    // Let's just return null if not self-registered. 
    if (!isSelfRegistered) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleFiles = (files: FileList | null) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            if (selectedFile.size > 100 * 1024 * 1024) {
                toast.error("File size must be under 100MB");
                return;
            }
            if (!selectedFile.type.startsWith('video/')) {
                toast.error("Please select a valid video file.");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('video', file);

        try {
            const res = await api.post('/users/upload-certification-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            });
            toast.success("Certification video uploaded successfully!");
            if (res.data.videoUrl && user) {
                setUser({ ...user, certificationVideoUrl: res.data.videoUrl });
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to upload video");
        } finally {
            setIsUploading(false);
            setFile(null);
        }
    };

    if (alreadyUploaded) {
        return (
            <Card className="p-8 mt-10 border-2 border-green-500/20 bg-green-50/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-50 flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#272727] mb-1">Video Submitted</h3>
                        <p className="text-[#666666] text-sm">Your certification video has been successfully uploaded and is pending final review.</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="border-green-200 text-green-700 bg-white hover:bg-green-50"
                    onClick={() => window.open(user.certificationVideoUrl, '_blank')}
                >
                    Watch Video
                </Button>
            </Card>
        );
    }

    return (
        <Card className="p-8 mt-10 border border-gray-100 shadow-xl shadow-gray-200/40 rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0EA0DC]/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

            <div className="mb-8 pl-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#272727] mb-3 flex items-center gap-3">
                    <Video className="w-8 h-8 text-[#0EA0DC]" />
                    Final Certification Video
                </h2>
                <p className="text-[#666666] leading-relaxed max-w-2xl">
                    To finalize your Master Distributor status, please upload a short unedited video (max 100MB) demonstrating your application technique on a test panel.
                </p>
            </div>

            {!isEligible ? (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-amber-900 mb-1">Complete all courses to unlock</h4>
                        <p className="text-sm text-amber-700">You have completed {completedCount} out of 6 required courses. You must achieve 100% completion before you can submit your practical video.</p>
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${isDragging ? 'border-[#0EA0DC] bg-[#0EA0DC]/5 scale-[1.02]' : 'border-gray-200 hover:border-[#0EA0DC]/50 hover:bg-gray-50/50'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                <Video className="w-10 h-10 text-[#0EA0DC]" />
                            </div>
                            <h4 className="font-bold text-[#272727] text-lg mb-1 truncate px-4">{file.name}</h4>
                            <p className="text-sm text-[#999999] mb-8">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>

                            {isUploading ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-[#0EA0DC]">Uploading...</span>
                                        <span className="text-[#272727]">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            className="h-full bg-gradient-to-r from-[#0EA0DC] to-[#0bcaf8]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setFile(null)}
                                        className="border-gray-200 text-[#666666] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpload}
                                        className="bg-[#0EA0DC] text-white hover:bg-[#272727] px-8"
                                    >
                                        <UploadCloud className="w-4 h-4 mr-2" />
                                        Submit Video
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="w-24 h-24 bg-[#0EA0DC]/10 rounded-full flex items-center justify-center mx-auto mb-2 pointer-events-none">
                                <UploadCloud className="w-10 h-10 text-[#0EA0DC]" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-[#272727] mb-2">Drag & Drop your video here</h4>
                                <p className="text-sm text-[#999999]">MP4, MOV, or WEBM up to 100MB</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="video/mp4,video/quicktime,video/webm"
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="rounded-xl border-gray-200 font-bold hover:bg-[#0EA0DC] hover:text-white hover:border-[#0EA0DC] transition-colors"
                                disabled={isUploading}
                            >
                                Browse Files
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
