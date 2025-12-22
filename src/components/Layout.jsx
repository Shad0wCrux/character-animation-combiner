import React from "react";
import GithubImage from "../assets/img/github.png";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="flex w-full items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold tracking-wide">
            Character Animation Combiner
          </div>

          <nav className="flex items-center gap-2">
            <a
              rel="noopener noreferrer"
              href="https://github.com/Shad0wCrux/character-animation-combiner"
              target="_blank"
              className="rounded p-2 hover:bg-white/10"
              aria-label="GitHub"
              title="GitHub"
            >
              <img src={GithubImage} alt="github logo" width="32" height="32" />
            </a>

          </nav>
        </div>
      </header>

      <main className="w-full px-4 py-4">{children}</main>
    </div>
  );
};

export default Layout;

