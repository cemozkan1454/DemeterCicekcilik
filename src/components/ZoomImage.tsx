import { useEffect, useId, useRef, useState, type ImgHTMLAttributes } from 'react';
import { Expand, X } from 'lucide-react';

export default function ZoomImage({ alt = '', className = '', ...image }: ImgHTMLAttributes<HTMLImageElement>) {
  const dialog = useRef<HTMLDialogElement>(null);
  const label = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button type="button" className="image-preview group" aria-label={`${alt} — fotoğrafı büyüt`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <img {...image} alt={alt} className={className} />
        <span className="image-preview-hint" aria-hidden="true"><Expand size={16} /> İncele</span>
      </button>
      <dialog ref={dialog} className="image-dialog" aria-labelledby={label} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        {open && (
          <div className="image-dialog-content">
            <button type="button" autoFocus className="image-dialog-close" aria-label="Fotoğrafı kapat" onClick={() => setOpen(false)}><X size={24} /></button>
            <img src={image.src} alt={alt} className="image-dialog-photo" />
            <p id={label} className="image-dialog-caption">{alt}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
