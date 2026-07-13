import React from 'react';

const TiltedMarquee = () => {
  const text1 = "WRITE BEAUTIFULLY 🌐 READ EFFORTLESSLY 🌐 BLOGIFY JOURNAL 🌐 EDITORIAL ESSAYS 🌐 ";
  const text2 = "🌐 THE BRAIN DUMP 🌐 IDEAS WORTH SHARING 🌐 DEVELOPER INSIGHTS 🌐 CREATIVE MINDS 🌐 ";

  // Repeat text to make it loop infinitely
  const repeatedText1 = text1.repeat(3);
  const repeatedText2 = text2.repeat(3);

  return (
    <div className="w-full h-32 sm:h-36 overflow-hidden relative my-8 select-none pointer-events-none">
      {/* Tape 1: Slanted Tape Left (rotated -3.5deg) - Rendered underneath (z-0) */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[125vw] bg-accent-primary text-slate-950 py-3.5 shadow-md transform rotate-[-3.5deg] z-0 border-y border-border-base/15">
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee-reverse whitespace-nowrap font-brand font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center">
            <span className="inline-block pr-4">{repeatedText2}</span>
            <span className="inline-block pr-4">{repeatedText2}</span>
          </div>
        </div>
      </div>

      {/* Tape 2: Slanted Tape Right (rotated 3.5deg) - Rendered on top (z-10) */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[125vw] bg-text-primary text-bg-base py-3.5 shadow-md transform rotate-[3.5deg] z-10 border-y border-border-base/20">
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee whitespace-nowrap font-brand font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center">
            <span className="inline-block pr-4">{repeatedText1}</span>
            <span className="inline-block pr-4">{repeatedText1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiltedMarquee;
