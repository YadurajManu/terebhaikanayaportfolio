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
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App relative min-h-screen bg-[var(--bg)] text-white">
      <Nav />
      <main>
        <Hero />
        <About />
        <NowBuilding />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            border: "1px solid #222",
            color: "#fff",
            fontFamily: "JetBrains Mono, monospace",
          },
        }}
      />
    </div>
  );
}

export default App;
