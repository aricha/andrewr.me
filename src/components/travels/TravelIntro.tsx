import React from "react"
import { Card } from "../Card"
import { StickyBackground } from "../layout/StickyBackground"
import { motion } from "framer-motion";
import { Animations } from "@/lib/animations";

import BackgroundImage from '@/assets/travel/intro-hero.jpg';

export default function TravelIntro() {
  return (
    <div className="snap-start relative w-full min-h-screen">
      <StickyBackground
        image={BackgroundImage}
        hasBlur={false}
        imageStyle={{ objectPosition: '80% 50%' }}
      />

      {/* Content */}
      <div className="page-max-width-wide">
        <div className="relative z-10 max-w-md min-h-screen flex flex-col sm:justify-center mx-auto sm:mx-0 pb-8 pt-[calc(100vh-10rem)] sm:pt-0">
          <div>
            {/* Headings */}
            <div className="flex flex-col gap-8 text-zinc-50 mb-8">
              <div className="flex flex-col gap-1 ml-4">
                <h1 className="text-7xl font-bold" style={{ textShadow: '1px 2px 2px rgba(0, 0, 0, 0.5)' }}>2024</h1>
                <h2 className="text-3xl font-medium" style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)' }}>A Gap Year to Remember</h2>
              </div>
            </div>
            
            {/* Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={Animations.appearVariants} className="">
              <Card className="p-4">
                <p className="text-md">
                  At the start of 2024, I quit my job, gave up my apartment in San Francisco and hit the road, with the goal of
                  backpacking through Southeast Asia and South America for an entire year. Although plans changed and I
                  encountered bumps on the road, it was without a doubt the greatest adventure of my life. It's hard to sum up
                  living a year of seeing incredible nature, getting to know new cultures and people, and all kinds of
                  new experiences – but I've put together this page to try.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}