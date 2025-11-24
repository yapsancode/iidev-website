"use client";
import { MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Position = 'bottom-right' | 'bottom-left';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
    position?: Position;
    forceOpen?: boolean;   // ← now properly declared
    onClose?: () => void;   // ← now properly declared
}

export default function WhatsAppButton({
    phoneNumber = "60123456789",
    message = "Hi! I'm interested in your web development services.",
    position = "bottom-right",
    forceOpen = false,      // ← default value
    onClose,                // ← destructured correctly
}: WhatsAppButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [customMessage, setCustomMessage] = useState(message);

    // Open popup when forceOpen becomes true (from CTA button)
    useEffect(() => {
        if (forceOpen) {
            setIsOpen(true);
        }
    }, [forceOpen]);

    const positionClasses: Record<Position, string> = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6"
    };

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(customMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);           // close popup after sending
        onClose?.();                // notify parent (WhyChooseUs) that popup closed
    };

    return (
        <>
            {/* Floating Button */}
            <div className={`fixed ${positionClasses[position]} z-50`}>
                {/* Chat Popup */}
                {isOpen && (
                    <div className="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="bg-[#25D366] p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-[#25D366]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold">Chat with us</h3>
                                <p className="text-white/90 text-sm">We typically reply instantly</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onClose?.();          // ← correctly call onClose here
                                }}
                                className="text-white/90 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    Hi there! How can we help you today?
                                </p>
                            </div>

                            <textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#25D366] dark:bg-gray-700 dark:text-white text-sm"
                                rows={3}
                            />

                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full mt-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group"
                            >
                                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Start WhatsApp Chat
                            </button>

                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                                Powered by WhatsApp
                            </p>
                        </div>
                    </div>
                )}

                {/* Floating Trigger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group relative w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                    aria-label="Open WhatsApp chat"
                >
                    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
                    <MessageCircle className="relative w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                        1
                    </span>
                </button>
            </div>
        </>
    );
}