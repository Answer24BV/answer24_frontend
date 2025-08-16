"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import HeroImageOne from "@/public/hero-image-one.jpg";
import HeroImageTwo from "@/public/hero-image-two.jpg";
import HeroImageThree from "@/public/hero-image-three.jpg";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function HeroSection() {
  const t = useTranslations("HeroSection");
  const router = useRouter();
  const locale = useLocale();

  const redirectToSignup = () => {
    router.push(`/${locale}/signup`);
  };

  const redirectToWebshop = () => {
    router.push(`/${locale}/webshop`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden pt-30">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200"
          >
            <Sparkles className="w-4 h-4" />
            {t("hero_badge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-relaxed"
          >
            {t("hero_title_1")}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block">
              {t("hero_title_2")}
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={redirectToSignup}
                className="bg-blue-600 hover:bg-blue-700 text-white !px-12 py-8! text-[17px] rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {t("hero_button_1")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={redirectToWebshop}
                size="lg"
                className="!px-12 py-8! text-[17px] rounded-full border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 bg-transparent"
              >
                <Play className="mr-2 w-5 h-5" />
                {t("hero_button_2")}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column - Visual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-6">
                <Image
                  src={HeroImageOne}
                  alt="Top image"
                  width={500}
                  height={300}
                  className="rounded-2xl w-full h-auto object-cover col-span-2"
                />

                <Image
                  src={HeroImageThree}
                  alt="Left bottom image"
                  width={500}
                  height={300}
                  className="rounded-2xl h-auto object-cover"
                />
              </div>

              <Image
                src={HeroImageTwo}
                alt="Right bottom image"
                width={250}
                height={700}
                className="rounded-2xl w-full h-auto object-cover mt-11 flex justify-center items-center"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
