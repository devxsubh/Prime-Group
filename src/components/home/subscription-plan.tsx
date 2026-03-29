'use client'

import { motion } from "framer-motion";
import { Check, Coins, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const creditPlans = [
  {
    name: "Starter",
    slug: "starter",
    credits: 200,
    price: 499,
    originalPrice: 799,
    icon: Zap,
    features: [
      "200 contact unlocks",
      "Credits never expire",
      "Instant access",
    ],
    badge: null,
    gradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    name: "Popular",
    slug: "popular",
    credits: 500,
    price: 999,
    originalPrice: 1999,
    icon: Sparkles,
    features: [
      "500 contact unlocks",
      "Credits never expire",
      "Best value per credit",
      "Priority support",
    ],
    badge: "Best Value",
    gradient: "from-yellow-500/10 to-amber-500/5",
  },
  {
    name: "Premium",
    slug: "premium-pack",
    credits: 1000,
    price: 1799,
    originalPrice: 3999,
    icon: Crown,
    features: [
      "1000 contact unlocks",
      "Credits never expire",
      "Lowest cost per credit",
      "Priority support",
      "Dedicated assistance",
    ],
    badge: "Max Savings",
    gradient: "from-purple-500/10 to-indigo-500/5",
  },
];

export default function SubscriptionPlan() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: 'var(--pure-white)' }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ backgroundColor: 'var(--accent-gold)' }}></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ backgroundColor: 'var(--primary-blue)' }}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-block mb-4 px-6 py-2 rounded-full font-general" style={{ backgroundColor: 'var(--primary-blue)' }}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-gradient">
              Credits
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-outfit font-black mb-4 text-gold-gradient tracking-tighter" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)' }}>
            Buy Credits
          </h2>
          <p className="text-lg sm:text-xl font-general font-medium max-w-2xl mx-auto" style={{ color: 'var(--primary-blue)', opacity: 0.8 }}>
            Purchase credits to instantly unlock contact details — phone, address & email — on any profile
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {creditPlans.map((plan, index) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * index }}
              className="relative group"
            >
               {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-5 py-2 rounded-full text-[10px] font-general font-black uppercase tracking-[0.2em] text-black bg-gold-gradient shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div
                className={`rounded-2xl p-7 sm:p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br ${plan.gradient}`}
                style={{
                  border: plan.badge
                    ? '2px solid var(--accent-gold)'
                    : '1px solid rgba(212, 175, 55, 0.2)',
                  boxShadow: plan.badge
                    ? '0 10px 40px rgba(212, 175, 55, 0.15)'
                    : '0 4px 20px rgba(0, 0, 0, 0.06)',
                }}
              >
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-blue)' }}>
                    <plan.icon className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <h3 className="text-xl font-outfit font-black uppercase tracking-widest" style={{ color: 'var(--primary-blue)' }}>
                    {plan.name}
                  </h3>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-2 mb-2 font-general">
                  <Coins className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
                  <span className="text-4xl font-outfit font-black tracking-tighter" style={{ color: 'var(--primary-blue)' }}>
                    {plan.credits.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary-blue)', opacity: 0.7 }}>
                    credits
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6 font-general">
                  <span className="text-xs font-medium line-through" style={{ color: 'var(--primary-blue)', opacity: 0.5 }}>
                    ₹{plan.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-outfit font-black tracking-tighter" style={{ color: 'var(--primary-blue)' }}>
                    ₹{plan.price.toLocaleString()}
                  </span>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3 mb-8 font-general">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-gradient flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--primary-blue)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link href={`/checkout?plan=${plan.slug}`}>
                  <Button
                    className={`w-full py-7 text-xs font-general font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-none ${
                      plan.badge
                        ? 'bg-gold-gradient text-black'
                        : ''
                    }`}
                    style={
                      !plan.badge
                        ? { backgroundColor: 'var(--primary-blue)', color: 'var(--pure-white)' }
                        : undefined
                    }
                  >
                    SELECT {plan.name}
                  </Button>
                </Link>

                {/* Per-credit price */}
                <p className="text-center text-xs font-montserrat mt-3" style={{ color: 'var(--primary-blue)', opacity: 0.6 }}>
                  ₹{(plan.price / plan.credits).toFixed(2)} per credit
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-general font-black uppercase tracking-[0.4em]" style={{ color: 'var(--primary-blue)', opacity: 0.6 }}>
            ✓ Secure Payment &nbsp; • &nbsp; ✓ Credits Never Expire &nbsp; • &nbsp; ✓ Instant Activation
          </p>
        </motion.div>
      </div>
    </section>
  );
}
