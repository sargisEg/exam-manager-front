
import React, { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  title?: string;
}

export default function Modal(props: ModalType) {
  if (!props.isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">{props.title}</h2>
          <button onClick={props.toggle} className="rounded-full p-1.5 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}
