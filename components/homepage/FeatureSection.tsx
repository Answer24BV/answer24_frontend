"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Key, BarChart3, Eye, FileText, Lightbulb, Bell, ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  color: string;
  index: number;
  isActive: boolean;
  handleClick: (index: number) => void;
}

const FeatureCard = ({ icon: Icon, title, description, color, index, isActive, handleClick }: FeatureCardProps) => {
  const t = useTranslations("FeatureSection");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      className="group snap-center min-w-[300px] md:min-w-[350px] flex-shrink-0 px-2"
      layout
    >
      <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative ${isActive ? 'border-blue-500' : ''}`}>
        <CardContent className="p-8 relative z-10">
          <motion.div layout="position" className="flex items-center mb-6">
            <div
              className={`w-14 h-14 ${
                color === "blue" ? "bg-blue-100" : "bg-gray-100"
              } rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon
                className={`w-7 h-7 ${color === "blue" ? "text-primary-teal" : "text-gray-600"}`}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 ml-4 group-hover:text-primary-teal transition-colors duration-300">
              {title}
            </h3>
          </motion.div>
          <motion.p layout="position" className="text-gray-600 leading-relaxed mb-6">{description}</motion.p>
          <button 
            onClick={() => handleClick(index)}
            className="flex items-center text-primary-teal font-medium text-sm hover:text-primary-teal"
          >
            {isActive ? t('show_less') : t('learn_more')}
            <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const CarouselButton = ({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 text-gray-700 hover:bg-white hover:text-primary-teal transition-all disabled:opacity-30"
    aria-label="Carousel navigation"
  >
    {children}
  </button>
)

export function FeaturesSection() {
  const t = useTranslations("FeatureSection")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    scrollToIndex(index, true);
  };
  
  const scrollToIndex = (index: number, isButtonClick: boolean = false) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentIndex(index);
      if (isButtonClick && contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  const nextSlide = () => scrollToIndex((currentIndex + 1) % features.length)
  const prevSlide = () => scrollToIndex((currentIndex - 1 + features.length) % features.length)
  
  const features = [
    {
      icon: Key,
      title: t('features.0.title'),
      description: t('features.0.description'),
      content: t('features.0.content'),
      color: "blue",
    },
    {
      icon: BarChart3,
      title: t('features.1.title'),
      description: t('features.1.description'),
      content: t('features.1.content'),
      color: "blue",
    },
    {
      icon: Eye,
      title: t('features.2.title'),
      description: t('features.2.description'),
      content: t('features.2.content'),
      color: "blue",
    },
    {
      icon: FileText,
      title: t('features.3.title'),
      description: t('features.3.description'),
      content: t('features.3.content'),
      color: "blue",
    },
    {
      icon: Lightbulb,
      title: t('features.4.title'),
      description: t('features.4.description'),
      content: t('features.4.content'),
      color: "blue",
    },
    {
      icon: Bell,
      title: t('features.5.title'),
      description: t('features.5.description'),
      content: t('features.5.content'),
      color: "gray",
    },
  ]

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-2 hidden md:block">
          <CarouselButton onClick={prevSlide} disabled={currentIndex === 0}>
            <ChevronLeft className="w-5 h-5" />
          </CarouselButton>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-2 hidden md:block">
          <CarouselButton onClick={nextSlide} disabled={currentIndex >= features.length - 3}>
            <ChevronRight className="w-5 h-5" />
          </CarouselButton>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-primary-teal px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <Lightbulb className="w-4 h-4" />
            {t('section_title')}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('heading.line1')}
            <span className="text-primary-teal block">
              {t('heading.line2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subheading')}
          </p>
        </motion.div>

        <div className="relative">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto py-8 px-4 -mx-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex space-x-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  ref={el => { if (el) cardRefs.current[index] = el }}
                  className="flex-shrink-0 snap-center w-[calc(100vw-4rem)] sm:w-[calc(50vw-4rem)] lg:w-[calc(33.333vw-4rem)] px-2"
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    color={feature.color}
                    index={index}
                    isActive={expandedIndex === index}
                    handleClick={handleCardClick}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentIndex === index ? 'bg-primary-teal w-6' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div ref={contentRef}>
          <AnimatePresence mode="wait">
            {expandedIndex !== null && (
              <motion.div
                key={expandedIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-16 prose prose-blue max-w-4xl mx-auto"
              >
                {features[expandedIndex].content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('**')) {
                    const text = paragraph.replace(/\*\*/g, '')
                    return <p key={i} className="font-semibold text-gray-900 mt-4 mb-2">{text}</p>
                  }
                  return <p key={i} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
