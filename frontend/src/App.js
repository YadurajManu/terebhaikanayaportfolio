import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
const ToastHost = lazy(() => import("./components/ToastHost"));
import Nav from "./components/Nav";
import Hero from "./components/Hero";
const About = lazy(() => import("./components/About"));
const NowBuilding = lazy(() => import("./components/NowBuilding"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Research = lazy(() => import("./components/Research"));
const Stack = lazy(() => import("./components/Stack"));
const Contact = lazy(() => import("./components/Contact"));
import Stats from "./components/Stats";
import Footer from "./components/Footer";
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const ProjectModal = lazy(() => import("./components/ProjectModal"));
import CursorSpotlight from "./components/CursorSpotlight";
const BootScreen = lazy(() => import("./components/BootScreen"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { ThemeProvider } from "./contexts/ThemeContext";

function HomePage() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [booted, setBooted] = useState(true);
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && tag !== "input" && tag !== "textarea" && !e.target?.isContentEditable) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const playIntro = () => {
    try { sessionStorage.removeItem("yr-booted"); } catch { /* Storage may be unavailable. */ }
    setBooted(false);
  };

  const openProject = (p) => setActiveProject(p);
  const closeProject = (open) => {
    if (!open) setActiveProject(null);
  };

  return (
    <>
      {!booted && <Suspense fallback={null}><BootScreen onDone={() => setBooted(true)} /></Suspense>}
      <CursorSpotlight />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero onPlayIntro={playIntro} />
        <Stats />
        <Suspense fallback={<section id="experience" className="min-h-screen" />}><Experience /></Suspense>
        <Suspense fallback={<section id="now-building" className="min-h-screen" />}><NowBuilding onOpenProject={openProject} /></Suspense>
        <Suspense fallback={<section id="projects" className="min-h-screen" />}><Projects onOpenProject={openProject} /></Suspense>
        <Suspense fallback={<section id="research" className="min-h-screen" />}><Research /></Suspense>
        <Suspense fallback={<section id="about" className="min-h-screen" />}><About /></Suspense>
        <Suspense fallback={<section id="stack" className="min-h-screen" />}><Stack /></Suspense>
        <Suspense fallback={<section id="contact" className="min-h-screen" />}><Contact /></Suspense>
      </main>
      <Footer />

      {paletteOpen && <Suspense fallback={null}><CommandPalette
        open={paletteOpen}
        setOpen={setPaletteOpen}
        onOpenProject={openProject}
      /></Suspense>}
      {activeProject && <Suspense fallback={null}><ProjectModal
        project={activeProject}
        open={!!activeProject}
        onOpenChange={closeProject}
      /></Suspense>}
    </>
  );
}

function App() {
  const [toasts, setToasts] = useState(false);
  useEffect(() => {
    const onToast = () => setToasts(true);
    window.addEventListener("portfolio:toast", onToast);
    return () => window.removeEventListener("portfolio:toast", onToast);
  }, []);
  return (
    <ThemeProvider>
      <div className="App relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* /cv and /resume are HTTP 308 redirects to the PDF (see vercel.json).
                They never reach the router — a client-side redirect is invisible
                to agents that do not execute JavaScript. */}
            <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
        {toasts && <Suspense fallback={null}><ToastHost /></Suspense>}
      </div>
    </ThemeProvider>
  );
}

export default App;
