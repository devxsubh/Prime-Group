'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DiscoverHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0.3, 0.5, 0.3],
      scale: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative h-dvh w-screen overflow-hidden" style={{ position: 'relative', isolation: 'isolate' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'auto',
          pointerEvents: 'none'
        }}
      >
        <Image
          src="/img/discover.png"
          alt="Discover Your Perfect Match"
          fill
          priority
          className="object-cover"
          style={{ 
            objectPosition: 'center center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'translateZ(0)',
            willChange: 'auto',
            backfaceVisibility: 'hidden'
          }}
          sizes="100vw"
        />
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30 z-10" />
        {/* Subtle radial gradient for focus */}
        <div 
          className="absolute inset-0 z-10" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.15) 100%)'
          }}
        />
      </div>

      {/* Content Overlay - Centered */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading */}
            <motion.h1 
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-outfit font-black mb-4 sm:mb-6 md:mb-8 leading-[0.92] sm:leading-[0.9] text-gold-gradient ${isMobile ? '' : 'whitespace-nowrap'} tracking-tighter`}
              variants={itemVariants}
              style={{ 
                textShadow: '3px 3px 12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(226, 194, 133, 0.2)',
              }}
            >
              Discover Your Soulmate
            </motion.h1>

            {/* Sub-heading with catchy line */}
            <motion.div 
              className="inline-block relative"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                variants={glowVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: 'linear-gradient(135deg, rgba(226, 194, 133, 0.3), rgba(184, 148, 90, 0.2))'
                }}
              />
              <p 
                className="relative text-xs sm:text-sm font-general font-black uppercase leading-relaxed px-8 sm:px-10 py-4 sm:py-5 rounded-full backdrop-blur-lg transition-all duration-300 tracking-[0.3em]"
                style={{ 
                  color: 'var(--pure-white)',
                  backgroundColor: 'rgba(0, 51, 102, 0.8)',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 12px rgba(0, 0, 0, 0.6)',
                  border: '2px solid rgba(226, 194, 133, 0.4)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 40px rgba(226, 194, 133, 0.15)',
                }}
              >
                Where Hearts Meet & Dreams Begin
              </p>
            </motion.div>

            {/* Additional catchy tagline */}
            <motion.p
              className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg font-general font-medium leading-relaxed max-w-3xl mx-auto uppercase tracking-widest opacity-80"
              variants={itemVariants}
              style={{
                color: 'var(--pure-white)',
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              Connect with verified profiles and find your perfect life partner
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHero;

