import { useEffect, useRef, useState } from "react";
import "./App.css";
import { FaPlay } from "react-icons/fa6";
import { listen } from "@tauri-apps/api/event";

function ProgressBar() {
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const barRef = useRef<HTMLDivElement | null>(null);

    const updateProgressFromEvent = (e: any) => {
        if (!barRef.current) {
            return;
        }

        const rect = barRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const fraction = Math.min(Math.max(x / rect.width, 0), 1);
        setProgress(fraction);
    };

    const handleMouseDown = (e: any) => {
        setIsDragging(true);
        updateProgressFromEvent(e);
    };

    const handleMouseMove = (e: any) => {
        if (isDragging) {
            updateProgressFromEvent(e);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    })

    return (
        <div className="pbar" ref={barRef} onMouseDown={handleMouseDown}>
            <div className="pbardrag" style={{ width: `${progress * 100}%`, transition: isDragging ? "none" : "width 0.1s" }} />
        </div>
    );
}


function App() {
    const [frame, setFrame] = useState<[number, string]>([0, "null"]);

    useEffect(() => {
        const unlisten = listen<[number, string]>("video-frame", (e) => {
            setFrame(e.payload);
        });
        
        return () => {
            unlisten.then(t => t());
        };
    });

    return (
        <>
            <img id={frame[1]} title="Video" />
            <div className="options">
                <div className="playpause">
                    <FaPlay className="playpause" size="100%" />
                </div>
                <ProgressBar />
            </div>
        </>
    );
}

export default App;
