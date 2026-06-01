import { useCallback, useEffect, useRef, useState } from 'react';
import { generate } from './lib/avatar.js';
import { getAccount, handleOAuthCallback, signInWithOdyc } from './lib/appwrite.js';
import AvatarCard from './components/AvatarCard.jsx';
import AvatarPixels from './components/AvatarPixels.jsx';
import Logo from './components/Logo.jsx';

const PAGE = 24;
const APPLIED_KEY = 'odyc.appliedSeed';

// New seed prefix every page load (current time) so each reload yields a fresh
// infinite list. Seeds are still deterministic strings, so an applied avatar
// stored in localStorage reproduces exactly regardless of the session.
const SESSION = Date.now().toString(36);

function buildModels(from, count) {
  const out = [];
  for (let i = from; i < from + count; i++) out.push(generate(`${SESSION}-${i}`));
  return out;
}

export default function App() {
  const [models, setModels] = useState(() => buildModels(0, PAGE));
  const [appliedSeed, setAppliedSeed] = useState(() => localStorage.getItem(APPLIED_KEY));
  const [toast, setToast] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const sentinelRef = useRef(null);
  const appliedRef = useRef(null);
  const toastTimer = useRef(null);

  // Handle OAuth callback and check login state on mount.
  useEffect(() => {
    (async () => {
      await handleOAuthCallback();
      getAccount().then(setUser).catch(() => setUser(null));
    })();
  }, []);

  // Close modal on Escape.
  useEffect(() => {
    if (!authModalOpen) return;
    const onKey = (e) => e.key === 'Escape' && setAuthModalOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [authModalOpen]);

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
      if (!user) {
        setAuthModalOpen(true);
        return;
      }
      setAppliedSeed(model.seed);
      localStorage.setItem(APPLIED_KEY, model.seed);
      showToast(`Applied "${model.name}" as your avatar`);
    },
    [user, showToast]
  );

  // appliedSeed is the model.seed (e.g. "odyc-12"); generate() reproduces it exactly.
  const applied = appliedSeed ? generate(appliedSeed) : null;

  // Show the floating copy only once the inline card scrolls under the header.
  useEffect(() => {
    const el = appliedRef.current;
    if (!el) { setPinned(false); return; }
    const io = new IntersectionObserver(([e]) => setPinned(!e.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px', // header height
    });
    io.observe(el);
    return () => io.disconnect();
  }, [appliedSeed]);

  const appliedCard = (className, ref) => (
    <aside className={className} ref={ref}>
      <span className="hero__appliedLabel">Current avatar</span>
      <div className="hero__appliedArt">
        <AvatarPixels model={applied} className="card__art" />
      </div>
    </aside>
  );

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
            <button className="btn-signin" onClick={signInWithOdyc}>
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
          {user && applied && appliedCard('hero__applied', appliedRef)}
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

      {user && applied && pinned && appliedCard('hero__applied hero__applied--float')}

      <div className={`toast${toast ? ' toast--show' : ''}`}>{toast}</div>

      {authModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__body">
              <button
                className="modal__close"
                onClick={() => setAuthModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="modal__logo">
                <Logo size={48} radius={12} />
              </div>
              <h2 className="modal__title">Sign in</h2>
              <p className="modal__desc">
                Save your avatar to your Odyc.js profile and keep it synced across devices.
              </p>
              <button
                className="modal__action"
                onClick={() => {
                  setAuthModalOpen(false);
                  signInWithOdyc();
                }}
              >
                <img src="/odyc-logo.png" alt="" />
                Sign in with Odyc.js
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
