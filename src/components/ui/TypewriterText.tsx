import React from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  pauseAfter?: string; // Character to pause after
  pauseDuration?: number; // Duration of pause in seconds
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const getRandomChar = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

const getSequence = (target: string): string[] => {
  const count = 10;
  const isUpper = target === target.toUpperCase();
  const startChar = isUpper ? 'A' : 'a';

  const sequence = [target];
  for (let i = 0; i < count - 2; i++) {
    sequence.push(getRandomChar());
  }
  sequence.push(startChar);

  return sequence;
};

const SlotChar = ({
  char,
  index,
  baseDelay,
  extraDelay = 0
}: {
  char: string;
  index: number;
  baseDelay: number;
  extraDelay?: number;
}) => {
  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  const sequence = React.useMemo(() => getSequence(char), [char]);
  const heightInEms = sequence.length - 1;
  const effectiveDelay = baseDelay + (index * 0.05) + extraDelay;

  return (
    <span className="inline-block overflow-hidden h-[1em] leading-none align-bottom relative text-inherit">
      <motion.span
        className="absolute left-0 right-0 bottom-0 flex flex-col text-center"
        initial={{ y: "0em", opacity: 0 }}
        whileInView={{ y: `${heightInEms}em`, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          y: {
            duration: 1.25,
            ease: [0.16, 1, 0.3, 1],
            delay: effectiveDelay,
          },
          opacity: {
            duration: 0.01,
            delay: effectiveDelay,
          }
        }}
      >
        {sequence.map((s, i) => {
          const isTarget = i === 0;
          return (
            <span
              key={i}
              className={`flex h-[1em] items-center justify-center font-inherit ${isTarget ? "opacity-100" : "opacity-40"}`}
            >
              {s}
            </span>
          );
        })}
      </motion.span>
      <span className="invisible">{char}</span>
    </span>
  );
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = "",
  delay = 0,
  pauseAfter = ",",
  pauseDuration = 2
}) => {
  const words = text.split(" ");
  let charCount = 0;
  let pauseApplied = false;

  return (
    <h1 className={`flex flex-wrap justify-center gap-[0.25em] ${className}`}>
      {words.map((word, wIndex) => (
        <span key={wIndex} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, cIndex) => {
            const currentDelayIndex = charCount;
            charCount++;

            // Check if we should add pause after this character
            let extraDelay = 0;
            if (char === pauseAfter && !pauseApplied) {
              pauseApplied = true;
            } else if (pauseApplied) {
              extraDelay = pauseDuration;
            }

            return (
              <SlotChar
                key={cIndex}
                char={char}
                index={currentDelayIndex}
                baseDelay={delay}
                extraDelay={extraDelay}
              />
            );
          })}
        </span>
      ))}
    </h1>
  );
}