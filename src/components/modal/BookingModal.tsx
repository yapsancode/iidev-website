import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, Briefcase, DollarSign, MessageSquare } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        projectType: 'Website Development',
        budget: '< RM 5,000',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic Validation
        if (!formData.name || !formData.phone) {
            alert('Please fill in your name and phone number to continue.');
            return;
        }

        const whatsappMessage = `
*New Consultation Request* 🚀

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Type:* ${formData.projectType}
*Budget:* ${formData.budget}

*Details:*
${formData.message || 'No additional details provided'}
    `.trim();

        const whatsappUrl = `https://wa.me/60167093543?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-50 transition-all"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50 px-4"
                    >
                        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-neutral-100">
                            {/* Header Decoration */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />

                            <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">

                                {/* Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                Free Consultation
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Let's build it.</h2>
                                        <p className="text-neutral-500 mt-2 font-medium">Tell us about your project and we'll reply instantly.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Name & Phone Group */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide ml-1">Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                                <input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your Name"
                                                    className="w-full bg-neutral-50 border border-transparent hover:bg-neutral-100 focus:bg-white focus:border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide ml-1">Phone</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+60 12-345 6789"
                                                    className="w-full bg-neutral-50 border border-transparent hover:bg-neutral-100 focus:bg-white focus:border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide ml-1">Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="hello@company.com"
                                                className="w-full bg-neutral-50 border border-transparent hover:bg-neutral-100 focus:bg-white focus:border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide ml-1">Project Type</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                                                    <Briefcase size={18} />
                                                </div>
                                                <select
                                                    name="projectType"
                                                    value={formData.projectType}
                                                    onChange={handleChange}
                                                    className="w-full bg-neutral-50 border border-transparent hover:bg-neutral-100 focus:bg-white focus:border-neutral-200 rounded-xl py-3.5 pl-11 pr-8 text-neutral-900 appearance-none focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all font-medium cursor-pointer"
                                                >
                                                    <option>Website Development</option>
                                                    <option>Web Application</option>
                                                    <option>E-commerce Store</option>
                                                    <option>UI/UX Design</option>
                                                    <option>Custom System</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide ml-1">Budget</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                                                    <DollarSign size={18} />
                                                </div>
                                                <select
                                                    name="budget"
                                                    value={formData.budget}
                                                    onChange={handleChange}
                                                    className="w-full bg-neutral-50 border border-transparent hover:bg-neutral-100 focus:bg-white focus:border-neutral-200 rounded-xl py-3.5 pl-11 pr-8 text-neutral-900 appearance-none focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all font-medium cursor-pointer"
                                                >
                                                    <option>{'< RM 5,000'}</option>
                                                    <option>{'RM 5k - 10k'}</option>
                                                    <option>{'RM 10k - 25k'}</option>
                                                    <option>{'RM 25k+'}</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide ml-1">Anything else?</label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-4 top-5 text-neutral-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={3}
                                                placeholder="Tell us a bit about your goals, timeline, or current challenges..."
                                                className="w-full bg-neutral-50 border border-transparent hover:bg-neutral-100 focus:bg-white focus:border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all font-medium resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-neutral-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-black hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-neutral-900/10"
                                        >
                                            <span>Start WhatsApp Discussion</span>
                                            <Send size={20} />
                                        </button>
                                        <p className="text-center text-xs text-neutral-400 mt-4">
                                            We respect your privacy. No spam, ever.
                                        </p>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
