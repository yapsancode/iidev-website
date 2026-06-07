"use client";
import React, { useState } from "react";
import { BookingModal } from "./BookingModal";

interface BookingButtonProps {
  className?: string;
  children: React.ReactNode;
  /** Optional context passed to the modal (e.g. the service the user is viewing). */
  service?: string;
}

/**
 * Self-contained booking CTA: renders a button and owns its own modal state.
 * Lets pages stay Server Components (so they can export per-page metadata)
 * while still offering the interactive booking flow.
 */
export function BookingButton({ className, children, service }: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        {children}
      </button>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
      />
    </>
  );
}
