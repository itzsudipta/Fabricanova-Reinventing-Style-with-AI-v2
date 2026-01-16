'use client';

import { useState } from 'react';
import Navbar from '../../component/Navbar';
import Footer from '../../component/footer';
import Link from 'next/link';
import { Check, Sparkles, X, ArrowRight } from 'lucide-react';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const plans = [
        {
            name: 'Apprentice',
            price: billingCycle === 'monthly' ? '0' : '0',
            desc: 'Essential tools for students and hobbyists starting their journey.',
            features: [
                { text: '10 AI Generations / mo', included: true },
                { text: 'Standard Resolution Downloads', included: true },
                { text: 'Personal License', included: true },
                { text: 'Community Access', included: true },
                { text: 'Commercial License', included: false },
                { text: 'API Access', included: false },
            ]
        },
        {
            name: 'Couturier',
            price: billingCycle === 'monthly' ? '29' : '24',
            desc: 'Advanced power for freelance designers and professionals.',
            active: true,
            features: [
                { text: 'Unlimited AI Generations', included: true },
                { text: '4K Ultra-Res Export', included: true },
                { text: 'Commercial License', included: true },
                { text: 'Priority Processing', included: true },
                { text: 'Advanced Layer Control', included: true },
                { text: 'API Access', included: false },
            ]
        },
        {
            name: 'Atelier',
            price: billingCycle === 'monthly' ? '99' : '89',
            desc: 'Complete infrastructure for fashion houses and brands.',
            features: [
                { text: 'Everything in Couturier', included: true },
                { text: 'Full API Access', included: true },
                { text: 'Team Collaboration (5 Seats)', included: true },
                { text: 'Tech Pack Generation', included: true },
                { text: 'Dedicated Account Manager', included: true },
                { text: 'Custom Model Training', included: true },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 selection:bg-purple-200 selection:text-purple-900">
            <Navbar />

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-100/40 blur-[100px] rounded-full mix-blend-multiply opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-stone-200/40 blur-[100px] rounded-full mix-blend-multiply opacity-50"></div>
            </div>

            <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-purple-600 font-bold tracking-widest text-xs uppercase mb-3 block">Membership</span>
                    <h2 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6 tracking-tight">
                        Craft your <span className="italic text-stone-500">legacy.</span>
                    </h2>
                    <p className="text-stone-500 text-lg leading-relaxed mb-10">
                        Choose the toolkit that matches your creative ambition. <br className="hidden md:block" />
                        Change plans or cancel at any time.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center bg-white border border-stone-200 rounded-full p-1 shadow-sm">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-900'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-900'}`}
                        >
                            Yearly <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">-20%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 items-start relative z-10 mb-20">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`
                                relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2
                                ${plan.active
                                    ? 'bg-stone-900 text-white shadow-2xl shadow-stone-900/20 ring-1 ring-stone-900 md:scale-105 z-10'
                                    : 'bg-white text-stone-900 border border-stone-200 shadow-sm hover:shadow-lg hover:border-stone-300'
                                }
                            `}
                        >
                            {/* Popular Badge */}
                            {plan.active && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                    <Sparkles size={12} fill="currentColor" /> MOST POPULAR
                                </div>
                            )}

                            {/* Card Header */}
                            <div className="mb-8 border-b border-stone-200/10 pb-8">
                                <h3 className={`font-serif text-2xl font-bold mb-2 ${plan.active ? 'text-white' : 'text-stone-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mb-6 min-h-[40px] ${plan.active ? 'text-stone-400' : 'text-stone-500'}`}>
                                    {plan.desc}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tight">${plan.price}</span>
                                    <span className={`text-sm font-medium ${plan.active ? 'text-stone-500' : 'text-stone-400'}`}>/month</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className={`flex items-start gap-3 text-sm ${!feat.included && 'opacity-50'}`}>
                                        {feat.included ? (
                                            <div className={`mt-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center ${plan.active ? 'bg-purple-500 text-white' : 'bg-stone-200 text-stone-600'}`}>
                                                <Check size={10} strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <div className="mt-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                                                <X size={14} className="text-stone-300" />
                                            </div>
                                        )}
                                        <span className={plan.active ? 'text-stone-300' : 'text-stone-600'}>
                                            {feat.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button - LINKED TO CHECKOUT */}
                            <Link
                                href={{
                                    pathname: '/checkout',
                                    query: {
                                        plan: plan.name,
                                        cycle: billingCycle
                                    }
                                }}
                                className={`
                                    w-full py-4 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 block text-center
                                    ${plan.active
                                        ? 'bg-white text-stone-900 hover:bg-stone-200 hover:scale-[1.02]'
                                        : 'bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02]'
                                    }
                                `}
                            >
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="text-center border-t border-stone-200 pt-10">
                    <p className="text-stone-400 text-sm font-medium uppercase tracking-widest mb-6">Trusted by designers at</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                        <span className="font-serif text-xl font-bold italic">VOGUE</span>
                        <span className="font-serif text-xl font-bold">LVMH</span>
                        <span className="font-serif text-xl font-bold italic">Prada</span>
                        <span className="font-serif text-xl font-bold">FIT NYC</span>
                    </div>
                </div>

            </main>

            {/* --- CTA SECTION --- */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden px-8 py-20 md:p-20 text-center border border-white shadow-2xl shadow-purple-900/5">
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50"></div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-60">
                            <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-300 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-300 rounded-full blur-[120px] mix-blend-multiply"></div>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-6">
                                Ready to weave the <br /> <span className="italic text-purple-600">future?</span>
                            </h2>
                            <p className="text-stone-600 text-lg mb-10 leading-relaxed">
                                Join 10,000+ designers using Fabricanova to redefine their creative process. No credit card required for beta access.
                            </p>
                            <Link href="/auth" className="inline-flex h-14 px-8 bg-stone-900 text-white rounded-full font-bold items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-stone-900/20">
                                Get Started Free <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}