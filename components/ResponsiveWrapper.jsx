"use client";
import { useState, useEffect } from "react";

export default function ResponsiveWrapper({ mobileComponent: MobileComp, desktopContent: DesktopComp }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return isMobile ? <MobileComp /> : <DesktopComp />;
}
