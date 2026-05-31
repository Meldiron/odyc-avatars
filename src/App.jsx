import { useCallback, useEffect, useRef, useState } from 'react';
import { generate } from './lib/avatar.js';
import AvatarCard from './components/AvatarCard.jsx';
import AvatarPixels from './components/AvatarPixels.jsx';
import Logo from './components/Logo.jsx';

const PAGE = 24;
const APPLIED_KEY = 'odyc.appliedSeed';

// Deterministic models for a contiguous range of seeds.
function buildModels(from, count) {
  const out = [];
  for (let i = from; i < from + count; i++) out.push(generate(`odyc-${i}`));
  return out;
}

export default function App() {
  const [models, setModels] = useState(() => buildModels(0, PAGE));
  const [appliedSeed, setAppliedSeed] = useState(() => localStorage.getItem(APPLIED_KEY));
  const [toast, setToast] = useState(null);
  const sentinelRef = useRef(null);
  const toastTimer = useRef(null);

  const loadMore = useCallback(() => {
    setModels((prev) => [...prev, ...buildModels(prev.length, PAGE)]);
  }, []);

  // Infinite scroll via IntersectionObserver.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleApply = useCallback(
    (model) => {
      setAppliedSeed(model.seed);
      localStorage.setItem(APPLIED_KEY, model.seed);
      showToast(`Applied “${model.name}” as your avatar`);
    },
    [showToast]
  );

  // appliedSeed is the model.seed (e.g. "odyc-12"); generate() reproduces it exactly.
  const applied = appliedSeed ? generate(appliedSeed) : null;

  return (
    <div className="app">
      <header className="nav">
        <div className="nav__inner">
          <a className="brand" href="#">
            <span className="brand__mark"><Logo size={30} radius={9} /></span>
            <span className="brand__name">Odyc.js Avatars</span>
          </a>
          <nav className="nav__links">
            <a className="active" href="#">Gallery</a>
          </nav>
          <div className="nav__right">
            <button className="btn-signin">
              <img className="btn-signin__logo" src="/odyc-logo.png" alt="" />
              Sign in with Odyc.js
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero__text">
            <h1>Odyc.js Avatars Gallery</h1>
            <p>
              A never-ending parade of tiny heroes for your Odyc.js avatar. Keep scrolling, grab one you like, and level-up your Odyc.js profile.
            </p>
          </div>
          {applied && (
            <div className="hero__applied">
              <div className="hero__appliedArt">
                <AvatarPixels model={applied} className="card__art" />
              </div>
              <div>
                <span className="hero__appliedLabel">Your avatar</span>
                <span className="hero__appliedName">{applied.name}</span>
              </div>
            </div>
          )}
        </section>

        <section className="grid">
          {models.map((m) => (
            <AvatarCard
              key={m.seed}
              model={m}
              applied={appliedSeed === m.seed}
              onApply={handleApply}
              onToast={showToast}
            />
          ))}
        </section>

        <div ref={sentinelRef} className="sentinel">
          <span className="spinner" /> loading more…
        </div>
      </main>

      <div className={`toast${toast ? ' toast--show' : ''}`}>{toast}</div>
    </div>
  );
}
