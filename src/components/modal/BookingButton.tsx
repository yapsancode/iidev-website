"use client";
import React, { useState } from "react";
import { BookingModal } from "./BookingModal";

interface BookingButtonProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Self-contained booking CTA: renders a button and owns its own modal state.
 * Lets pages stay Server Components (so they can export per-page metadata)
 * while still offering the interactive booking flow.
 */
export function BookingButton({ className, children }: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        {children}
      </button>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
