"use client";

import {
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

interface BookingButtonProps {
  className?: string;
  children: ReactNode;
  service?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: string;
}

export function BookingButton({
  className,
  children,
  service,
}: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Modal, setModal] = useState<ComponentType<BookingModalProps> | null>(null);

  const handleOpen = async () => {
    setIsModalOpen(true);
    if (Modal) return;
    const bookingModule = await import("./BookingModal");
    setModal(() => bookingModule.BookingModal);
  };

  return (
    <>
      <button onClick={handleOpen} className={className}>
        {children}
      </button>
      {Modal && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={service}
        />
      )}
    </>
  );
}
