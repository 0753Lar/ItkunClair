import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

const duration = 500;
interface ModalProps {
  open?: boolean;
  onClose?: () => void;
}
const Modal = ({ open, onClose, children }: PropsWithChildren<ModalProps>) => {
  const [isFadeOut, setIsFadeOut] = useState(false);

  const closeWithFadeOut = useCallback(() => {
    setIsFadeOut(true);
    setTimeout(() => {
      setIsFadeOut(false);
      onClose?.();
    }, duration);
  }, [onClose]);

  useEffect(() => {
    const modal = document.getElementById("portal-modal");
    if (modal) {
      const keydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeWithFadeOut();
        }
      };
      const mouseDown = (event: MouseEvent) => {
        let isTriggerredByBox = false;
        let wip: HTMLElement | null = event.target as HTMLDivElement;
        while (wip) {
          if (wip.getAttribute("id") === "portal-modal-box") {
            isTriggerredByBox = true;
            wip = null;
          } else {
            wip = wip.parentElement;
          }
        }
        if (!isTriggerredByBox) {
          closeWithFadeOut();
        }
      };

      window.addEventListener("keydown", keydown);
      modal.addEventListener("mousedown", mouseDown);
      return () => {
        window.removeEventListener("keydown", keydown);
        modal.removeEventListener("mousedown", mouseDown);
      };
    }
  }, [closeWithFadeOut]);

  if (!open) return null;
  const portal = document.getElementById("portal");
  if (!portal) return null;

  const modalContent = (
    <div
      id="portal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        id="portal-modal-box"
        className={`animate__animated ${isFadeOut ? "animate__fadeOut" : "animate__fadeIn"} animate__faster relative z-20 min-h-40 w-4/5 max-w-md rounded-lg border-[1px] border-slate-50 border-opacity-20 bg-slate-400/30 bg-clip-padding px-4 pb-2 pt-6 shadow-lg backdrop-blur-xl backdrop-filter md:px-4`}
      >
        <button
          onClick={closeWithFadeOut}
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 font-bold text-slate-300 hover:text-slate-500 focus:outline-none md:text-transparent"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, portal);
};

export default Modal;
