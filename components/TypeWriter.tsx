import { motion } from 'framer-motion'

interface TypeWriterProps {
  text: string
  className?: string
  delay?: number
}

export default function TypeWriter({ text, className, delay = 0 }: TypeWriterProps) {
  const characters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  }

  const child = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={child}>
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}
