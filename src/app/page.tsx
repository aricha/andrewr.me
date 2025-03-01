'use client'

import React from 'react';
import { motion } from 'framer-motion'
import { Card, CardLink } from '@/components/Card'
import { InlineSocialLinks } from '@/components/InlineSocialLinks'
import { PageBackground } from '@/components/layout/PageBackground'
import { Animations } from '@/lib/animations'
import { CldImage } from 'next-cloudinary'
import { Layout } from '@/components/layout/Layout';
import { Footer } from '@/components/layout/Footer';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0
    }
  }
}

export default function Home() {
  return (
    <Layout>
      <PageBackground image="home/home-background" sticky={false} />
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center px-2 sm:px-4 py-4 sm:py-8 dark">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 max-w-md sm:max-w-4xl mx-auto w-full"
          >
            <motion.div
              variants={Animations.appearVariants}
              className="col-span-2 sm:col-span-1 sm:h-auto"
            >
              <Card className="flex flex-col items-center justify-center text-2xl">
                <div className="relative w-full aspect-[16/9] md:max-h-[236px] overflow-hidden rounded-t-3xl">
                  <CldImage
                    src='home/profile'
                    alt="Andrew Richardson"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 896px) 50vw, 420px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
                    {`👋, you've reached the home of`}
                  </h3>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 text-zinc-950 dark:text-zinc-100">Andrew Richardson</h1>
                  <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-200">
                    {`I'm a software engineer and travel addict from Vancouver 🇨🇦.
                    I live to explore, try new things, and get out in nature. I've been lucky to spend 2024 on sabbatical traveling the world.
                    When I'm working, I love to build cool things and specialize in UI for  platforms.`}
                  </p>
                  <InlineSocialLinks className="mt-4" />
                </div>
              </Card>
            </motion.div>
            <div className="col-span-2 sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-4 sm:h-full">
              <motion.div variants={Animations.appearVariants}>
                <CardLink
                  href="/work" label="Work"
                  imageSrc='home/wwdc-talk-zoom' imageAlt="Work"
                />
              </motion.div>
              <motion.div variants={Animations.appearVariants}>
                <CardLink
                  href="/travel" label="Travel"
                  imageSrc='home/travel' imageAlt="Travel"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
        <Footer className="pt-2 pb-3" />
      </div>
    </Layout>
  )
}
