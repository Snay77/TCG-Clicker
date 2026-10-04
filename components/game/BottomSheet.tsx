'use client';
import { useRef, type ReactNode } from 'react';
import Modal from './Modal';
export default function BottomSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const drag = useRef<number | null>(null);
  return <Modal title={title} onClose={onClose} className="bottom-sheet">
    <div className="sheet-grip" aria-hidden="true" onPointerDown={e => { drag.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerCancel={() => { drag.current = null; }} onPointerUp={e => { if (drag.current !== null && e.clientY - drag.current > 70) onClose(); drag.current = null; }}><span /></div>
    <h2 className="sheet-title">{title}</h2><div className="sheet-content">{children}</div>
  </Modal>;
}
