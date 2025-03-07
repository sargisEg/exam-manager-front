import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  title?: string;
}

export default function Modal(props: ModalType) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [props.isOpen]);

  if (!props.isOpen) return null;

  return (
      <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={props.toggle}
      >
        <div
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-background border shadow-lg duration-200 sm:rounded-lg"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-background p-6 border-b shrink-0">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">{props.title}</h2>
              <button
                  onClick={props.toggle}
                  className="rounded-full p-1.5 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            {props.children}
          </div>
        </div>
      </div>
  );
}