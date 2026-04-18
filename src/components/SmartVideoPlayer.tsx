import { useState, useRef, useEffect } from "react";

interface Subtitle {
    start: number;
    end: number;
    text: string;
}

interface SmartVideoPlayerProps {
    url: string;
    subtitles?: Record<string, Subtitle[]>;
    poster?: string;
    className?: string;
}

export function SmartVideoPlayer({ url, poster, className = "" }: SmartVideoPlayerProps) {
    const [isDriveVideo, setIsDriveVideo] = useState(false);
    const [driveUrl, setDriveUrl] = useState("");

    useEffect(() => {
        if (url.includes("drive.google.com")) {
            setIsDriveVideo(true);
            let id = "";
            if (url.includes("id=")) {
                id = url.split("id=")[1].split("&")[0];
            } else if (url.includes("open?id=")) {
                id = url.split("open?id=")[1].split("&")[0];
            } else if (url.includes("/file/d/")) {
                id = url.split("/file/d/")[1].split("/")[0];
            }
            if (id) {
                setDriveUrl(`https://drive.google.com/file/d/${id}/preview`);
            }
        } else {
            setIsDriveVideo(false);
        }
    }, [url]);

    return (
        <div className={`relative bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl ${className}`}>
            {isDriveVideo ? (
                <iframe
                    src={driveUrl}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    title="Video Player"
                />
            ) : (
                <video
                    src={url}
                    poster={poster}
                    className="w-full h-full"
                    controls
                    playsInline
                />
            )}
        </div>
    );
}
