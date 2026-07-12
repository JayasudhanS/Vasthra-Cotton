import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-2 bg-[#7B1E3A]/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 w-fit mx-auto">
          ✦ Concierge & Artisan Support
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>
          We're Here to Assist You
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A48] font-light leading-relaxed m-0">
          Whether you need bespoke bridal draping advice, Silk Mark verification details, or weaver onboarding guidance, our dedicated team is at your service.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-10 items-start">
        {/* Contact Information */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-5 space-y-6">
          <div className="card-base p-6 sm:p-8 pt-8 sm:pt-10 bg-white border border-[#D4AF37]/30 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7B1E3A] via-[#D4AF37] to-[#7B1E3A]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0 border-b border-[#D4AF37]/15 pb-3 mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Headquarters & Concierge
            </h2>
            <div className="space-y-4">
              {[
                { icon: <FiMapPin size={18} />, title: 'Vasthra Cotton Bazaar', text: '2nd Street, Kamaraj Nagar, Aundipatty - 625512, Tamil Nadu' },
                { icon: <FiPhone size={18} />, title: 'Bridal Helpline & WhatsApp', text: '+91 98765 43210 (Mon-Sat, 9am - 8pm)' },
                { icon: <FiMail size={18} />, title: 'Concierge Email Support', text: 'concierge@vasthracotton.com' },
                { icon: <FiClock size={18} />, title: 'Artisan Support Hours', text: 'Monday to Saturday: 9:00 AM – 8:00 PM IST' }
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FFF8F0]/60 border border-[#D4AF37]/15 hover:bg-[#FFF8F0] hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B1E3A] to-[#5A1028] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#7B1E3A] uppercase tracking-wider m-0 mb-1">{c.title}</p>
                    <p className="text-xs sm:text-sm text-[#4A2C2A] m-0 leading-relaxed font-normal break-words">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-7">
          <div className="card-base p-6 sm:p-10 pt-8 sm:pt-12 bg-white border border-[#D4AF37]/30 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#7B1E3A] to-[#D4AF37]" />
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#2D8F5E]/10 text-[#2D8F5E] flex items-center justify-center mx-auto text-3xl shadow-inner">
                  <FiCheckCircle />
                </div>
                <h3 className="text-2xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>Message Received!</h3>
                <p className="text-sm text-[#6B4A48] max-w-md mx-auto m-0 leading-relaxed font-light">
                  Thank you for reaching out to Vasthra Cotton. A dedicated textile stylist from our Aundipatty concierge will respond to your inquiry within 4 working hours.
                </p>
                <div className="pt-4">
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-golden !py-2.5 !px-8 !text-xs cursor-pointer">
                    Send Another Inquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0 pb-3 border-b border-[#D4AF37]/15" style={{ fontFamily: 'Playfair Display' }}>
                  Send an Inquiry to Our Stylists
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Your Full Name *</label>
                    <input type="text" required placeholder="e.g. Customer Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field !h-12 !text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Email Address *</label>
                    <input type="email" required placeholder="e.g. customer@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field !h-12 !text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Inquiry Subject *</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="select-field !h-12 !text-sm">
                    <option value="Bridal Styling">Bridal Saree & Trousseau Styling</option>
                    <option value="Silk Mark">Silk Mark Authenticity & Zari Purity</option>
                    <option value="Weaver Onboarding">Weaver House Onboarding & KYC</option>
                    <option value="Order Support">Existing Order & Express Shipping</option>
                    <option value="Other">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] block mb-1.5">Your Message / Specifications *</label>
                  <textarea required placeholder="Please describe your requirements, saree preferences, or order details..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5}
                    className="textarea-field !text-sm" />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-golden w-full justify-center !py-3.5 !text-sm cursor-pointer shadow-lg inline-flex items-center gap-2">
                    <FiSend size={18} /> Transmit Inquiry to Concierge
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

