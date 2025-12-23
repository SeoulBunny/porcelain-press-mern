import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import InlineSearchResults from "./InlineSearchResults.jsx";

export default function Hero() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /* ---------- mouse glow ---------- */
  const [glow, setGlow] = useState({ x: 50, y: 40 });

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y });
  };

  /* ---------- refs ---------- */
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative overflow-hidden border-b border-white/20"
    >
      {/* 🔮 mouse-follow glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            circle at ${glow.x}% ${glow.y}%,
            rgba(255,255,255,0.18),
            rgba(255,255,255,0) 20%
          )`,
        }}
      />

      {/* subtle vertical wash */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0))]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid min-h-[520px] md:min-h-[600px] grid-cols-1 md:grid-cols-2 items-center gap-12">

          {/* LEFT */}
          <div ref={containerRef} className="relative">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Academic research,{" "}
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                without the clutter
              </span>
              .
            </h1>

            <p className="mt-4 max-w-md text-slate-300 leading-relaxed">
              Browse journals and articles on a range of topics and discover the
              next great thing.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!q.trim()) return;
                navigate(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1 rounded-2xl border-2 border-white/80 bg-black/65 px-4 py-2">
                <label className="block text-xs text-slate-300">
                  Search the entire site
                </label>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setOpen(true);
                  }}
                  className="mt-1 w-full bg-transparent text-white outline-none"
                />
              </div>

              <Button
                type="submit"
                className="h-[52px] rounded-2xl px-6 my-2"
              >
                Search
              </Button>
            </form>

            {open && (
              <div className="absolute left-0 right-0 mt-4 rounded-2xl border border-white/15 bg-black/60 backdrop-blur max-h-[420px] overflow-y-auto z-20">
                <InlineSearchResults
                  q={q}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  onSelect={(path) => navigate(path)}
                  onViewAll={() =>
                    navigate(`/search?q=${encodeURIComponent(q)}`)
                  }
                />
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center items-center h-[430px] md:h-[500px] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent blur-3xl opacity-60" />

            <img
              src="/images/academia-transparent.png"
              alt=""
              className="relative w-[320px] md:w-[420px] lg:w-[480px] opacity-90 pl-12"
            />

            <div className="absolute bottom-8 right-12 h-48 w-48 rounded-full bg-white/20 blur-2xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}
