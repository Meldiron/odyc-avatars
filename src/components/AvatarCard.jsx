import { memo, useEffect, useRef, useState } from 'react';
import AvatarPixels from './AvatarPixels.jsx';
import { toSVG, toTXT, toPNGBlob } from '../lib/avatar.js';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function AvatarCard({ model, applied, onApply, onToast }) {
  const base = `odyc-avatar-${model.seed}`;
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const dlSVG = () => {
    downloadBlob(`${base}.svg`, new Blob([toSVG(model)], { type: 'image/svg+xml' }));
    onToast?.(`Downloaded ${base}.svg`);
  };
  const dlTXT = () => {
    downloadBlob(`${base}.txt`, new Blob([toTXT(model)], { type: 'text/plain' }));
    onToast?.(`Downloaded ${base}.txt`);
  };
  const dlPNG = async () => {
    const blob = await toPNGBlob(model, 64);
    downloadBlob(`${base}.png`, blob);
    onToast?.(`Downloaded ${base}.png`);
  };

  const pick = (fn) => () => {
    setOpen(false);
    fn();
  };

  return (
    <article className={`card${applied ? ' card--applied' : ''}`}>
      <div className="card__stage">
        <AvatarPixels model={model} className="card__art" />
        {applied && <span className="card__badge">Applied</span>}
      </div>

      <div className="card__actions">
        <div className="dl" ref={menuRef}>
          <button
            className="dl__trigger"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            title="Download"
          >
            <DownloadIcon />
          </button>
          {open && (
            <div className="dl__menu" role="menu">
              <button role="menuitem" onClick={pick(dlSVG)}>SVG</button>
              <button role="menuitem" onClick={pick(dlPNG)}>PNG</button>
              <button role="menuitem" onClick={pick(dlTXT)}>TXT</button>
            </div>
          )}
        </div>
        <button className="apply" onClick={() => onApply(model)}>
          {applied ? 'Applied' : 'Apply'}
        </button>
      </div>
    </article>
  );
}

export default memo(AvatarCard);
