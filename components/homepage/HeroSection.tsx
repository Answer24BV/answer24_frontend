"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import HeroImage from "@/public/image.png"
import { useTranslations } from "next-intl";
import Link from "next/link"
import ENGLANDLOGO from "@/public/united-kingdom.png"
import NETHERLANDLOGO from "@/public/netherlands.png"

export function HeroSection() {
  const t = useTranslations("HeroSection");
  const languages = [
    { code: 'en', name: '🇬🇧', icon: ENGLANDLOGO.src }, // Placeholder for flag icon
    { code: 'nl', name: '🇳🇱', icon: NETHERLANDLOGO.src }, // Placeholder for flag icon
  ];
  const common_t = useTranslations("common");

  const currentLang = languages.find(lang => lang.code === common_t('locale'));


  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden pt-30">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="text-center lg:text-left">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200"
          >
            <Sparkles className="w-4 h-4" />
            {t('hero_badge')}
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold text-gray-900 mb-20 leading-tight"
          >
            {t('hero_title_1')}
            <span className="text-primary-teal block mt-8 text-3xl lg:text-6xl">
              {t('hero_title_2')}
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/${common_t('locale')}/signup`}>
                <Button
                  size="lg"
                  className="!px-12 !py-8 bg-[#046598] hover:bg-[#046598]/90 text-white text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t('hero_cta_1')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/${common_t('locale')}/webshop`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="!px-12 !py-8 text-lg rounded-full border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                >
                  <Play className="mr-2 w-5 h-5" />
                  {t('hero_cta_2')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full h-full flex items-center justify-center"
        >
          <div className="w-[55%] h-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="w-full h-[35%] mb-10 rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src="/images/landing/hero-1.jpeg"
                alt="Feature showcase 1"
                width={400}
                height={200}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </motion.div>

            {/* Bottom left image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
              className="w-full h-[65%] rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src="/images/landing/hero-3.jpeg"
                alt="Feature showcase 2"
                width={400}
                height={300}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* Right side image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ scale: 1.05, rotateX: 5 }}
            className="w-[45%] h-full mt-20 ml-10 rounded-2xl overflow-hidden shadow-sm"
          >
            <Image
              src="/images/landing/hero-2.jpeg"
              alt="Feature showcase 3"
              width={350}
              height={400}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
