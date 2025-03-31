
import React from "react";

interface SidebarOverlayProps {
  isVisible: boolean;
  overlayRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

const SidebarOverlay = ({
  isVisible,
  overlayRef,
  onClose,
}: SidebarOverlayProps) => {
  if (!isVisible) return null;
  
  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden"
      onClick={onClose}
    />
  );
};

export default SidebarOverlay;
