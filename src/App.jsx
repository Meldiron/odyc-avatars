import { useCallback, useEffect, useRef, useState } from 'react';
import { generate, toTXT, parseAvatarString } from './lib/avatar.js';
import {
  getAccount,
  handleOAuthCallback,
  readOAuthError,
  signInWithOdyc,
  signOut,
  getOidcAccessToken,
  fetchRemoteAvatar,
  updateRemoteAvatar,
} from './lib/appwrite.js';
import AvatarCard from './components/AvatarCard.jsx';
import AvatarPixels from './components/AvatarPixels.jsx';
import Logo from './components/Logo.jsx';

const PAGE = 24;

// New seed prefix every page load (current time) so each reload yields a fresh
// infinite list. Seeds are still deterministic strings, so an applied avatar
// stored in localStorage reproduces exactly regardless of the session.
const SESSION = Date.now().toString(36);

function buildModels(from, count) {
  const out = [];
  for (let i = from; i < from + count; i++) out.push(generate(`${SESSION}-${i}`));
  return out;
}

function isSameAvatar(model, serverAvatar) {
  if (!serverAvatar) return false;
  return toTXT(model).trim() === serverAvatar.trim();
}

export default function App() {
  const [models, setModels] = useState(() => buildModels(0, PAGE));
  const [serverAvatar, setServerAvatar] = useState(null);
  const [toast, setToast] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingSeed, setApplyingSeed] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const sentinelRef = useRef(null);
  const appliedRef = useRef(null);
  const toastTimer = useRef(null);

  // Handle OAuth callback and fetch user + avatar on mount.
  useEffect(() => {
    (async () => {
      if (readOAuthError()) setErrorModalOpen(true);
      await handleOAuthCallback();
      const account = await getAccount();
      setUser(account);

      if (account) {
        try {
          const token = await getOidcAccessToken();
          if (token) {
            const avatar = await fetchRemoteAvatar(token);
            setServerAvatar(avatar);
          }
        } catch {
          // ignore fetch errors
        }
      }
      setLoading(false);
    })();
  }, []);

  // Close modals on Escape.
  useEffect(() => {
    if (!authModalOpen && !errorModalOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setAuthModalOpen(false);
      setErrorModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [authModalOpen, errorModalOpen]);

  // Close user menu on outside click or Escape.
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e) => userMenuRef.current && !userMenuRef.current.contains(e.target) && setUserMenuOpen(false);
    const onKey = (e) => e.key === 'Escape' && setUserMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

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
    async (model) => {
      if (!user) {
        setAuthModalOpen(true);
        return;
      }

      setApplyingSeed(model.seed);
      const token = await getOidcAccessToken();
      if (!token) {
        setApplyingSeed(null);
        showToast('Could not get access token. Please sign in again.');
        return;
      }

      const avatarString = toTXT(model).trim();
      try {
        await updateRemoteAvatar(token, avatarString);
        setServerAvatar(avatarString);
        showToast(`Applied "${model.name}" as your avatar`);
      } catch {
        showToast('Failed to save avatar. Please try again.');
      } finally {
        setApplyingSeed(null);
      }
    },
    [user, showToast]
  );

  const handleSignIn = useCallback(() => {
    setSigningIn(true);
    showToast('Redirecting to Odyc.js…');
    signInWithOdyc();
  }, [showToast]);

  const applied = serverAvatar ? parseAvatarString(serverAvatar) : null;

  // Show the floating copy only once the inline card scrolls under the header.
  useEffect(() => {
    const el = appliedRef.current;
    if (!el) { setPinned(false); return; }
    const io = new IntersectionObserver(([e]) => setPinned(!e.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px', // header height
    });
    io.observe(el);
    return () => io.disconnect();
  }, [serverAvatar]);

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
            {loading ? (
              <div className="skeleton skeleton--nav" />
            ) : user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="user-menu__trigger"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="user-menu__name">{user.name || user.email}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="user-menu__dropdown" role="menu">
                    <button
                      role="menuitem"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                        setUser(null);
                        setServerAvatar(null);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-signin" onClick={handleSignIn} disabled={signingIn}>
                {signingIn ? (
                  <>
                    <span className="btn-signin__spinner" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <img className="btn-signin__logo" src="/odyc-logo.png" alt="" />
                    Sign in with Odyc.js
                  </>
                )}
              </button>
            )}
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
          {loading ? (
            <aside className="hero__applied hero__applied--skeleton">
              <div className="skeleton skeleton--label" />
              <div className="skeleton skeleton--avatar" />
            </aside>
          ) : (
            user && applied && appliedCard('hero__applied', appliedRef)
          )}
        </section>

        <section className="grid">
          {models.map((m) => (
            <AvatarCard
              key={m.seed}
              model={m}
              applied={isSameAvatar(m, serverAvatar)}
              applying={applyingSeed === m.seed}
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
                onClick={handleSignIn}
                disabled={signingIn}
              >
                {signingIn ? (
                  <>
                    <span className="modal__action__spinner" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <img src="/odyc-logo.png" alt="" />
                    Sign in with Odyc.js
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {errorModalOpen && (
        <div className="modal-backdrop" onClick={() => setErrorModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__body">
              <button
                className="modal__close"
                onClick={() => setErrorModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="modal__logo">
                <Logo size={48} radius={12} />
              </div>
              <h2 className="modal__title">Can't sign in</h2>
              <p className="modal__desc">
                Guest accounts can't use external sign-ins because they don't have
                an email address. Please use an account with an email address to
                continue.
              </p>
              <button className="modal__action" onClick={() => setErrorModalOpen(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
