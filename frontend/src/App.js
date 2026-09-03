import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import NowBuilding from "./components/NowBuilding";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import ProjectModal from "./components/ProjectModal";
import CursorSpotlight from "./components/CursorSpotlight";
import BootScreen from "./components/BootScreen";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

function HomePage() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [booted, setBooted] = useState(() =>
    typeof window !== "undefined" && !!sessionStorage.getItem("yr-booted")
  );

  const openProject = (p) => setActiveProject(p);
  const closeProject = (open) => {
    if (!open) setActiveProject(null);
  };

  return (
    <>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <CursorSpotlight />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <Stats />
        <About />
        <NowBuilding onOpenProject={openProject} />
        <Experience />
        <Projects onOpenProject={openProject} />
        <Stack />
        <Contact />
      </main>
      <Footer />

      <CommandPalette
        open={paletteOpen}
        setOpen={setPaletteOpen}
        onOpenProject={openProject}
      />
      <ProjectModal
        project={activeProject}
        open={!!activeProject}
        onOpenChange={closeProject}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="App relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* /cv and /resume are HTTP 308 redirects to the PDF (see vercel.json).
                They never reach the router — a client-side redirect is invisible
                to agents that do not execute JavaScript. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "JetBrains Mono, monospace",
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
