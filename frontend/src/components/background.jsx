import React from 'react';

const Background = () => {
  const watermarks = [
    { text: 'clk', top: '12%', left: '8%', animationClass: 'animate-float-1' },
    { text: 'Memory Safety', top: '15%', right: '10%', animationClass: 'animate-float-2' },
    { text: 'Interrupts', top: '48%', left: '5%', animationClass: 'animate-float-3' },
    { text: 'Low-Level Optimization', bottom: '15%', left: '12%', animationClass: 'animate-float-2' },
    { text: 'Transfers', bottom: '8%', right: '35%', animationClass: 'animate-float-1' }
  ];

  return (
    <div className="fixed inset-0 w-full h-full grid-bg -z-10 overflow-hidden pointer-events-none select-none">
      {watermarks.map((wm, idx) => {
        const style = {
          position: 'absolute',
          top: wm.top,
          left: wm.left,
          right: wm.right,
          bottom: wm.bottom,
        };
        
        return (
          <div
            key={idx}
            style={style}
            className={`watermark-tag pointer-events-none hidden md:block ${wm.animationClass}`}
          >
            {wm.text}
          </div>
        );
      })}
    </div>
  );
};

export default Background;
