import { useEffect, useRef, type ReactNode } from 'react';
import { trapDialogTab } from '../../lib/dialog-focus';
export default function Modal({title,onClose,children,className=''}:{title:string;onClose:()=>void;children:ReactNode;className?:string}){
 const ref=useRef<HTMLDialogElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  const opener=document.activeElement,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';ref.current?.showModal();
  return()=>{document.body.style.overflow=overflow;if(opener instanceof HTMLElement&&opener.isConnected)opener.focus();};
 },[]);
 return <dialog ref={ref} onKeyDown={trapDialogTab} className={`ux-modal ${className}`} aria-label={title} onCancel={e=>{e.preventDefault();close.current();}}><button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>{children}</dialog>;
}
