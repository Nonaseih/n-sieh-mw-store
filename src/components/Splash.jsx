import { FiShoppingBag } from "react-icons/fi";
import { useEffect, useState } from "react";
import "../styles/Splash.css";

export default function Splash() {
  const [progress, setProgress] = useState(0);
  const loadingSteps = [
    "Intergrating componenet",
    "loading functions",
    "Syncing user state",
    "Preparing storefront",
    "Finalizing experience"
  ];
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let start = Date.now();
    let duration = 4200;
    let raf;
    function animate() {
      let elapsed = Date.now() - start;
      let percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(percent);
      if (percent < 100) raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((value) => (value + 1) % loadingSteps.length);
    }, 900);

    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  return (
    <div className="splash-mw-theme">
      <div className="splash-mw-card glass-card">
        <div className="splash-mw-bounce-wrap">
          <FiShoppingBag size={60} className="splash-mw-icon" />
          <span className="splash-mw-title font-serif bounce">MW Store</span>
        </div>
        <div className="splash-mw-loader-bar">
          <div
            className="splash-mw-loader-bar-inner"
            style={{ width: `${progress}%`, transition: "width 0.2s linear" }}
          ></div>
        </div>
        <div key={stepIndex} className="splash-mw-status splash-mw-status-animate">{loadingSteps[stepIndex]}</div>
        <div className="splash-mw-tagline">Quiet luxury for modern living</div>
      </div>
    </div>
  );
}
