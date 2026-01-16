'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CreditCard, Lock, Check, ShieldCheck, Wallet, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../../component/Navbar';
import Footer from '../../component/footer';

// 1. MATCH THESE PLANS TO YOUR PRICING PAGE EXACTLY
const plans = [
    {
        id: 'apprentice',
        name: 'Apprentice',
        credits: '10 Gens',
        price: 0,
        features: ['Personal License', 'Standard Res']
    },
    {
        id: 'couturier',
        name: 'Couturier',
        credits: 'Unlimited',
        price: 29,
        popular: true,
        features: ['Commercial License', '4K Export']
    },
    {
        id: 'atelier',
        name: 'Atelier',
        credits: 'Unlimited + Team',
        price: 99,
        features: ['API Access', 'Dedicated Support']
    }
];

function CheckoutContent() {
    const searchParams = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Couturier
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // 2. AUTO-SELECT PLAN BASED ON URL PARAMETER
    useEffect(() => {
        const planParam = searchParams.get('plan');
        if (planParam) {
            const foundPlan = plans.find(p => p.name.toLowerCase() === planParam.toLowerCase());
            if (foundPlan) setSelectedPlan(foundPlan);
        }
    }, [searchParams]);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* LEFT COLUMN: PLAN SUMMARY */}
            <div className="w-full lg:w-5/12 space-y-8">
                <div>
                    <Link href="/pricing" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 mb-4 inline-flex items-center gap-2">
                        <ArrowLeft size={12} /> Back to Plans
                    </Link>
                    <h1 className="font-serif text-4xl text-stone-900 mb-2">Checkout</h1>
                    <p className="text-stone-500 text-sm">Complete your subscription setup.</p>
                </div>

                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${selectedPlan.id === plan.id
                                    ? 'bg-stone-900 border-stone-900 text-white shadow-xl'
                                    : 'bg-white border-stone-200 text-stone-900 hover:border-purple-300'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-serif text-lg">{plan.name}</span>
                                {selectedPlan.id === plan.id && <Check size={18} className="text-purple-300" />}
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div className="text-xs opacity-70">{plan.features[0]}</div>
                                <div className="font-mono">${plan.price}/mo</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOTAL */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-serif text-lg text-stone-900">Total Due Today</span>
                        <span className="font-mono text-2xl font-bold text-stone-900">${selectedPlan.price}.00</span>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: FORM */}
            <div className="w-full lg:w-7/12">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-stone-200/50 rounded-3xl p-6 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-serif text-2xl text-stone-900">Payment Details</h2>
                        <div className="flex gap-2 text-stone-400">
                            <ShieldCheck size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider">Secure</span>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex p-1 bg-stone-100 rounded-lg mb-8">
                        <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 rounded-md text-sm font-medium transition-all flex justify-center gap-2 ${paymentMethod === 'card' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}><CreditCard size={16} /> Card</button>
                        <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-3 rounded-md text-sm font-medium transition-all flex justify-center gap-2 ${paymentMethod === 'paypal' ? 'bg-white text-[#003087] shadow-sm' : 'text-stone-500'}`}><Wallet size={16} /> PayPal</button>
                    </div>

                    <AnimatePresence mode="wait">
                        {paymentMethod === 'card' ? (
                            <motion.form
                                key="card"
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                onSubmit={handlePayment} className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <input type="text" placeholder="Cardholder Name" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400" />
                                    <div className="relative">
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-400" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1"><div className="w-6 h-4 bg-stone-300 rounded"></div></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <input type="text" placeholder="MM / YY" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-400" />
                                        <div className="relative">
                                            <input type="text" placeholder="CVC" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-400" />
                                            <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                        </div>
                                    </div>
                                </div>
                                <button disabled={isProcessing} className="w-full h-14 bg-stone-900 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-lg disabled:opacity-70">
                                    {isProcessing ? 'Processing...' : <>Confirm Subscription <ArrowRight size={18} /></>}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div key="paypal" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl">
                                <Wallet size={48} className="text-[#003087] mb-4" />
                                <button className="px-8 py-3 bg-[#003087] text-white rounded-full font-bold shadow-lg hover:bg-[#00256b]">Pay with PayPal</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="bg-stone-50 min-h-screen font-sans selection:bg-purple-200 selection:text-purple-900">
            <Navbar />
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px] mix-blend-multiply"></div>
                <div className="absolute bottom-[0%] left-[-5%] w-[500px] h-[500px] bg-orange-50/60 rounded-full blur-[80px] mix-blend-multiply"></div>
            </div>
            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    <CheckoutContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}