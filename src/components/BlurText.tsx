import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function BlurText({ text, className = '', style = {} }: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const words = text.split(' ');

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const delay = (i * 100) / 1000;
        return (
          <motion.span
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
            animate={
              isVisible
                ? {
                    filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                    opacity: [0, 0.5, 1],
                    y: [50, -5, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.7,
              times: [0, 0.5, 1],
              ease: 'easeOut',
              delay,
            }}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}
