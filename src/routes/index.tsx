import { createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  Check,
  CircleHelp,
  Clock3,
  History,
  ImagePlus,
  Info,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sprout,
  Upload,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { analyzePlantImage, type PlantAnalysis } from "../lib/plant-api";

type View = "home" | "scan" | "history" | "about";
type HistoryItem = {
  id: string;
  image: string;
  diagnosis: string;
  confidence: number;
  createdAt: string;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plant Disease Scanner | Smart Plant AI" },
      {
        name: "description",
        content: "Scan a plant leaf with your camera and receive an AI-assisted disease analysis.",
      },
      { property: "og:title", content: "Plant Disease Scanner | Smart Plant AI" },
      {
        property: "og:description",
        content: "Scan a plant leaf with your camera and receive an AI-assisted disease analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<View>("home");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("smart-plant-history");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as HistoryItem[];
      if (Array.isArray(parsed)) setHistory(parsed.slice(0, 12));
    } catch {
      window.localStorage.removeItem("smart-plant-history");
    }
  }, []);

  useEffect(() => {
    const updateConnection = () => setIsOnline(window.navigator.onLine);
    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  function saveHistory(nextItem: HistoryItem) {
    const nextHistory = [nextItem, ...history].slice(0, 12);
    setHistory(nextHistory);
    window.localStorage.setItem("smart-plant-history", JSON.stringify(nextHistory));
  }

  function openScan() {
    setError(null);
    setAnalysis(null);
    setView("scan");
  }

  function resetScan() {
    setImagePreview(null);
    setImageBlob(null);
    setAnalysis(null);
    setError(null);
    setIsAnalyzing(false);
    setView("scan");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPEG or PNG image.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setImageBlob(compressed.blob);
      setImagePreview(compressed.preview);
      setError(null);
    } catch {
      setError("That image could not be prepared. Please try another photo.");
    }
  }

  async function runAnalysis() {
    if (!imageBlob) return;
    if (!isOnline) {
      setError("You are offline. Reconnect to the internet before analysing a photo.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzePlantImage(imageBlob);
      setAnalysis(result);
      setView("scan");
      const diagnosis = result.diagnosis?.name ?? result.plant?.name ?? "Plant identified";
      saveHistory({
        id: crypto.randomUUID(),
        image: imagePreview ?? "",
        diagnosis,
        confidence: result.diagnosis?.confidence ?? 0,
        createdAt: new Date().toISOString(),
      });
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "The AI service could not analyse this photo.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="app-frame">
      <main className="app-container">
        <header className="topbar">
          <button className="brand-lockup brand-button" onClick={() => setView("home")} aria-label="Go to home">
            <span className="brand-mark"><Sprout size={21} strokeWidth={2.4} /></span>
            <span><span className="brand-name">Smart Plant AI</span><span className="brand-caption">Leaf health, made clear</span></span>
          </button>
          <span className={isOnline ? "status-dot online" : "status-dot offline"} title={isOnline ? "Online" : "Offline"} aria-label={isOnline ? "Online" : "Offline"} />
        </header>

        {!isOnline && <div className="online-strip"><WifiOff size={14} /> You're offline. Saved history is still available.</div>}

        {view === "home" && <Home onScan={openScan} />}
        {view === "scan" && (
          <ScanView
            imagePreview={imagePreview}
            analysis={analysis}
            error={error}
            isAnalyzing={isAnalyzing}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onAnalyze={runAnalysis}
            onReset={resetScan}
            onOpenFile={() => fileInputRef.current?.click()}
          />
        )}
        {view === "history" && <HistoryView history={history} />}
        {view === "about" && <AboutView />}
      </main>
      <BottomNav view={view} onChange={setView} onScan={openScan} />
    </div>
  );
}

function Home({ onScan }: { onScan: () => void }) {
  return (
    <section aria-labelledby="home-title">
      <div className="home-hero">
        <div>
          <p className="eyebrow">Plant health companion</p>
          <h1 id="home-title" className="display-title">Spot problems before they spread.</h1>
          <p className="display-copy">Take a clear photo of a leaf and get an AI-assisted starting point for what may be affecting your plant.</p>
          <div className="home-actions">
            <button className="primary-button" onClick={onScan}><Camera size={18} /> Start a scan</button>
            <span className="privacy-note"><LockKeyhole size={15} /> Your photo is sent securely for analysis and stays in this device's history.</span>
          </div>
        </div>
        <div className="hero-plant" aria-hidden="true"><Leaf size={150} strokeWidth={1.1} /></div>
      </div>

      <div className="section-heading"><div><h2>Three simple steps</h2><p>Designed for a quick check in the garden.</p></div><ScanLine size={20} className="section-icon" /></div>
      <div className="steps-grid">
        <div className="step-item"><span className="step-number">01</span><span><strong>Frame the leaf</strong><span>Use good daylight and keep the leaf in focus.</span></span></div>
        <div className="step-item"><span className="step-number">02</span><span><strong>Send the photo</strong><span>Our real analysis service compares visible patterns.</span></span></div>
        <div className="step-item"><span className="step-number">03</span><span><strong>Review the result</strong><span>Use the confidence score as a helpful starting point.</span></span></div>
      </div>
      <p className="disclaimer"><strong>Good to know:</strong> This is an educational aid, not a replacement for a local horticulturist or laboratory diagnosis.</p>
    </section>
  );
}

type ScanViewProps = {
  imagePreview: string | null;
  analysis: PlantAnalysis | null;
  error: string | null;
  isAnalyzing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onOpenFile: () => void;
};

function ScanView({ imagePreview, analysis, error, isAnalyzing, fileInputRef, onFileChange, onAnalyze, onReset, onOpenFile }: ScanViewProps) {
  return (
    <section aria-labelledby="scan-title">
      <p className="eyebrow">New analysis</p>
      <h1 id="scan-title" className="page-title">Capture a leaf photo</h1>
      <p className="page-copy">Fill the frame with one affected leaf. A sharp, well-lit image gives the clearest result.</p>
      <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png" capture="environment" onChange={onFileChange} />

      {isAnalyzing ? (
        <div className="analysis-state"><LoaderCircle className="loader-ring" size={58} /><h2>Reading your leaf…</h2><p>The AI service is comparing visible symptoms. This usually takes a few seconds.</p></div>
      ) : analysis && imagePreview ? (
        <ResultView analysis={analysis} imagePreview={imagePreview} onReset={onReset} />
      ) : imagePreview ? (
        <div className="photo-review"><img className="result-image" src={imagePreview} alt="The leaf photo ready for analysis" /><div className="preview-actions"><button className="secondary-button" onClick={onReset}><RotateCcw size={17} /> Retake</button><button className="primary-button" onClick={onAnalyze}><ScanLine size={17} /> Analyse photo</button></div></div>
      ) : (
        <>
          <div className="camera-stage camera-empty"><div className="camera-empty-icon"><Camera size={30} /></div><h2>Ready when you are</h2><p>Use your camera or choose a clear photo from your device.</p><button className="primary-button" onClick={onOpenFile}><Camera size={18} /> Open camera</button><button className="secondary-button" onClick={onOpenFile}><Upload size={17} /> Choose photo</button></div>
          <div className="camera-help"><span><Check size={15} /> One leaf, close and in focus</span><span><Check size={15} /> Natural daylight works best</span><span><Check size={15} /> JPEG or PNG, up to 10 MB</span></div>
        </>
      )}
      {error && <div className="error-panel" role="alert"><strong>Analysis unavailable</strong><p>{error}</p><button className="text-button" onClick={onReset}>Try another photo</button></div>}
    </section>
  );
}

function ResultView({ analysis, imagePreview, onReset }: { analysis: PlantAnalysis; imagePreview: string; onReset: () => void }) {
  const diagnosis = analysis.diagnosis?.name ?? analysis.plant?.name ?? "Plant identified";
  const confidence = analysis.diagnosis?.confidence ?? 0;
  return <div className="result-view"><img className="result-image" src={imagePreview} alt="Analysed plant leaf" /><div className="result-intro"><span className="result-kicker">Analysis complete</span><h2 className="result-name">{diagnosis}</h2></div><div className="result-card"><h3>Confidence</h3><div className="confidence-row"><span className="confidence-score">{Math.round(confidence * 100)}%</span><span className="confidence-state">{confidence >= .75 ? "Strong match" : confidence >= .45 ? "Possible match" : "Low confidence"}</span></div><div className="confidence-track"><div className="confidence-fill" style={{ width: `${Math.min(100, Math.max(0, confidence * 100))}%` }} /></div></div>{analysis.alternatives.length > 0 && <div className="plain-card"><h2>Other possibilities</h2><div className="alternative-list">{analysis.alternatives.slice(0, 4).map((item) => <div className="alternative-item" key={item.name}><span>{item.name}</span><span>{Math.round(item.confidence * 100)}%</span></div>)}</div></div>}<p className="disclaimer result-disclaimer"><strong>Next step:</strong> Compare this result with the leaf and seek expert advice before treating a valuable crop.</p><button className="secondary-button full-button" onClick={onReset}><RotateCcw size={17} /> Scan another leaf</button></div>;
}

function HistoryView({ history }: { history: HistoryItem[] }) {
  return <section aria-labelledby="history-title"><p className="eyebrow">Your device</p><h1 id="history-title" className="page-title">Scan history</h1><p className="page-copy">Your recent results are stored only in this browser.</p>{history.length === 0 ? <div className="empty-state"><History size={30} className="empty-icon" /><h2>No scans yet</h2><p>Completed analyses will appear here so you can compare them later.</p></div> : <div className="history-list">{history.map((item) => <div className="history-item" key={item.id}>{item.image ? <img className="history-thumb" src={item.image} alt="" /> : <span className="history-thumb history-thumb-empty"><Leaf size={18} /></span>}<span><strong>{item.diagnosis}</strong><span>{formatDate(item.createdAt)}</span></span><span className="history-score">{Math.round(item.confidence * 100)}%</span></div>)}</div>}</section>;
}

function AboutView() {
  return <section aria-labelledby="about-title"><p className="eyebrow">About the project</p><h1 id="about-title" className="page-title">A clearer first look at leaf health.</h1><p className="page-copy">Smart Plant AI connects a simple phone photo with a real plant identification service, helping you notice possible issues earlier.</p><div className="about-list"><div className="about-row"><span className="about-icon"><ShieldCheck size={18} /></span><span><h2>Real results, not demo data</h2><p>Each scan is sent to the configured Pl@ntNet disease endpoint. If the service cannot analyse a photo, you will see the honest reason.</p></span></div><div className="about-row"><span className="about-icon"><LockKeyhole size={18} /></span><span><h2>Private by default</h2><p>Photos are used for the request and only the results you complete are kept in this device's local history.</p></span></div><div className="about-row"><span className="about-icon"><CircleHelp size={18} /></span><span><h2>Use it as a starting point</h2><p>Lighting, image quality, and similar symptoms can affect confidence. Confirm important decisions with a plant professional.</p></span></div></div><p className="footer-note">Smart Plant AI · Built as a mobile-first college project · Analysis requires an internet connection.</p></section>;
}

function BottomNav({ view, onChange, onScan }: { view: View; onChange: (view: View) => void; onScan: () => void }) {
  return <nav className="bottom-nav" aria-label="Main navigation"><div className="bottom-nav-inner"><button className={`nav-item ${view === "home" ? "active" : ""}`} onClick={() => onChange("home")}><Sprout size={19} /><span>Home</span></button><button className="nav-item nav-scan" onClick={onScan}><Camera size={21} /><span>Scan</span></button><button className={`nav-item ${view === "history" ? "active" : ""}`} onClick={() => onChange("history")}><History size={19} /><span>History</span></button><button className={`nav-item ${view === "about" ? "active" : ""}`} onClick={() => onChange("about")}><Info size={19} /><span>About</span></button></div></nav>;
}

async function compressImage(file: File): Promise<{ blob: Blob; preview: string }> {
  const source = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image preparation failed");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Image preparation failed")), "image/jpeg", .84));
  return { blob, preview: canvas.toDataURL("image/jpeg", .78) };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
