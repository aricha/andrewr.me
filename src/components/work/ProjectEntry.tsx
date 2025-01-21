import { motion } from 'framer-motion';
import { Animations } from '@/lib/animations';

interface ProjectEntryProps {
  title: string;
  description: string | React.ReactNode;
  orientation?: 'left' | 'right';
  children: React.ReactNode;
}

export function ProjectEntry({
  title,
  description,
  orientation = 'left',
  children,
}: ProjectEntryProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={Animations.appearVariants}
      transition={Animations.appearVariants.transition}
      className={`flex flex-col sm:flex-row py-2 sm:py-4 sm:gap-8 justify-${orientation} items-center ${orientation === 'right' ? 'sm:flex-row-reverse' : ''}`}
    >
      <div className="flex-shrink-0 w-full sm:basis-2/5">
        {children}
      </div>
      <div className='my-4 max-w-md'>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-zinc-200 max-w-lg">
          {description}
        </p>
      </div>
    </motion.div>
  );
}; 