import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface Subtitle {
    start: number;
    end: number;
    text: string;
}

interface SmartVideoPlayerProps {
    url: string;
    subtitles?: Record<string, Subtitle[]>; // Updated to multi-language object
    poster?: string;
    className?: string;
}

const LANGUAGE_MAP: Record<string, string> = {
    en: "English",
    ur: "Urdu (اردو)",
    ar: "Arabic (العربية)",
    fr: "French (Français)",
    es: "Spanish (Español)",
};

export function SmartVideoPlayer({ url, subtitles = {}, poster, className = "" }: SmartVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
    const [_isFullscreen, setIsFullscreen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const controlsTimeoutRef = useRef<any>(null);

        // Auto-sync with Google Translate language and custom events
        useEffect(() => {
            const syncLanguage = (e?: any) => {
                const newLang = e?.detail?.langCode || document.documentElement.lang?.split('-')[0];
                if (newLang && newLang !== selectedLanguage && LANGUAGE_MAP[newLang]) {
                    setSelectedLanguage(newLang);
                }
            };
    
            // Initial check
            syncLanguage();
    
            // Listen for custom toggle events from LanguageSwitcher
            window.addEventListener('skygloss-lang-change', syncLanguage as any);
    
            // Observe attribute changes on <html> as backup
            const observer = new MutationObserver(() => syncLanguage());
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    
            // Periodical polling as the most robust fallback
            const interval = setInterval(syncLanguage, 2000);

            return () => {
                window.removeEventListener('skygloss-lang-change', syncLanguage as any);
                observer.disconnect();
                clearInterval(interval);
            };
        }, [selectedLanguage]);

    // Memoize active subtitles to prevent unnecessary re-runs
    const activeSubtitleList = useMemo(() => {
        return subtitles[selectedLanguage] || subtitles["en"] || [];
    }, [subtitles, selectedLanguage]);

    // Sync Subtitles
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            const activeSubtitle = activeSubtitleList.find(
                (s) => currentTime >= s.start && currentTime <= s.end
            );

            if (activeSubtitle) {
                if (currentSubtitle !== activeSubtitle.text) {
                    setCurrentSubtitle(activeSubtitle.text);
                }
            } else {
                if (currentSubtitle !== null) {
                    setCurrentSubtitle(null);
                }
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }, [activeSubtitleList, currentSubtitle]);

    // Handle Controls Visibility
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleProgressChange = (values: number[]) => {
        const nextProgress = values[0];
        if (videoRef.current) {
            const time = (nextProgress / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setCurrentProgress(nextProgress);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative group bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={url}
                poster={poster}
                className="w-full h-full cursor-pointer"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                    if (videoRef.current) {
                        setCurrentProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
                    }
                }}
                playsInline
            />

            {/* Subtitles Overlay */}
            <AnimatePresence>
                {currentSubtitle && (
                    <motion.div
                        key={currentSubtitle} // Keyed by subtitle to trigger exit/entry animations
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[90%] text-center pointer-events-none z-[60] notranslate"
                    >
                        <span className="bg-black/90 backdrop-blur-xl text-white px-8 py-3 rounded-2xl text-xl md:text-2xl font-bold shadow-[0_0_40px_rgba(0,0,0,0.5)] inline-block border border-white/30 leading-tight notranslate">
                            {currentSubtitle}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Controls Overlay */}
            <motion.div
                animate={{ opacity: showControls ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 flex flex-col justify-end p-4 md:p-6 transition-opacity"
            >
                {/* Progress Bar */}
                <div className="mb-4">
                    <Slider
                        value={[currentProgress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleProgressChange}
                        className="cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={togglePlay}
                            className="text-white hover:bg-white/20 rounded-full h-10 w-10 md:h-12 md:w-12"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
                        </Button>

                        <div className="flex items-center group/volume gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMute}
                                className="text-white hover:bg-white/20 rounded-full"
                            >
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </Button>
                            <div className="w-0 group-hover/volume:w-20 transition-all duration-300 overflow-hidden">
                                <Slider
                                    value={[isMuted ? 0 : volume * 100]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => {
                                        const newVol = v[0] / 100;
                                        setVolume(newVol);
                                        if (videoRef.current) videoRef.current.volume = newVol;
                                        setIsMuted(newVol === 0);
                                    }}
                                    className="w-20"
                                />
                            </div>
                        </div>

                        <div className="text-white text-sm font-medium hidden sm:block">
                            {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} / {videoRef.current ? formatTime(videoRef.current.duration) : "0:00"}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Subtitles Language Indicator */}
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter bg-white/10 px-2 py-1 rounded notranslate">
                            {selectedLanguage}
                        </span>

                        {/* Settings */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <Settings className="w-5 h-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFullscreen}
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <Maximize className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Initial Play Button */}
            {!isPlaying && currentProgress === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-[#0EA0DC] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(14,160,220,0.5)] border-4 border-white/20"
                    >
                        <Play className="w-10 h-10 text-white fill-white translate-x-1" />
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
