import { useEffect, useId, useRef, useState, type ImgHTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  collection?: { src: string; alt: string }[];
  initialIndex?: number;
};

export default function ZoomImage({ alt = '', className = '', collection, initialIndex = 0, ...image }: ZoomImageProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const label = useId();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const currentPhoto = collection?.[index] ?? { src: image.src, alt };
  const canNavigate = collection && collection.length > 1;
  function navigate(direction: number) {
    if (collection?.length) setIndex((current) => (current + direction + collection.length) % collection.length);
  }

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
      <button type="button" className="image-preview group" aria-label={`${alt} — fotoğrafı büyüt`} aria-haspopup="dialog" onClick={() => { setIndex(initialIndex); setOpen(true); }}>
        <img {...image} alt={alt} className={className} />
        <span className="image-preview-hint" aria-hidden="true"><Expand size={16} /> İncele</span>
      </button>
      <dialog ref={dialog} className="image-dialog" aria-labelledby={label} onKeyDown={(event) => { if (canNavigate && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); navigate(event.key === 'ArrowLeft' ? -1 : 1); } }} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        {open && (
          <div className="image-dialog-content">
            <button type="button" autoFocus className="image-dialog-close" aria-label="Fotoğrafı kapat" onClick={() => setOpen(false)}><X size={24} /></button>
            <img src={currentPhoto.src} alt={currentPhoto.alt} className="image-dialog-photo" onTouchStart={(event) => {
              touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
            }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start || !canNavigate || event.touches.length > 0) return;
              const dx = event.changedTouches[0].clientX - start.x;
              const dy = event.changedTouches[0].clientY - start.y;
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1);
            }} />
            <p id={label} aria-live="polite" className="image-dialog-caption">{currentPhoto.alt}</p>
            {canNavigate && <div className="flex items-center justify-center gap-4 mt-3 text-white"><button type="button" onClick={() => navigate(-1)} aria-label="Önceki fotoğraf" className="rounded-full bg-sage-700 p-3 hover:bg-sage-800"><ChevronLeft size={22} /></button><span aria-live="polite">{index + 1} / {collection.length}</span><button type="button" onClick={() => navigate(1)} aria-label="Sonraki fotoğraf" className="rounded-full bg-sage-700 p-3 hover:bg-sage-800"><ChevronRight size={22} /></button></div>}
          </div>
        )}
      </dialog>
    </>
  );
}
