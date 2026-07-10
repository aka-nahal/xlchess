import { useRef } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import Hero from "./components/Hero";

export default function App() {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <>
      <a
        href="#main"
        onClick={() => mainRef.current?.focus()}
        className="skip-link focus-brand sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]"
      >
        <span aria-hidden className="text-base leading-none">{"\u265E"}</span>
        Skip to content
      </a>
      <LoadingScreen />
      <Header />
      {/* tabIndex -1 lets the skip link hand focus into the content region */}
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
        <Hero />
      </main>
    </>
  );
}
