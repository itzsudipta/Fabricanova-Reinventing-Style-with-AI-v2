'use client';
// FIX: Use relative path '../..' to go back to root, then into 'component' (singular)
import Navbar from '../../component/Navbar';
import { Check } from 'lucide-react';

export default function PricingPage() {
    const plans = [
        { name: 'Apprentice', price: '0', desc: 'For students.', features: ['10 AI Generations', 'Standard Res'] },
        { name: 'Couturier', price: '29', desc: 'For professionals.', active: true, features: ['Unlimited AI', '4K Export', 'Comm. License'] },
        { name: 'Atelier', price: '99', desc: 'For fashion houses.', features: ['API Access', 'Team Collab', 'Tech Packs'] }
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-5xl text-stone-900 mb-4">Studio Membership</h2>
                    <p className="text-stone-500 text-lg">Choose the tier that fits your production volume.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div key={i} className={`p-8 rounded-xl border ${plan.active ? 'bg-stone-900 text-white border-stone-900 shadow-2xl' : 'bg-white text-stone-900 border-stone-200'}`}>
                            <h3 className="font-serif text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-sm opacity-60">/month</span>
                            </div>
                            <p className="text-sm mb-8 opacity-70">{plan.desc}</p>
                            <button className={`w-full py-3 rounded text-sm font-medium mb-8 transition-colors ${plan.active ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'}`}>Get Started</button>
                            <ul className="space-y-4">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm"><Check size={16} />{feat}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}