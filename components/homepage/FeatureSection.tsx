"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search, BarChart3, Users, FileText, Lightbulb, Bell, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

const FeatureCard = ({ icon: Icon, title, description, color, index }: {
  icon: any,
  title: string,
  description: string,
  color: string,
  index: number
}) => {
  const t = useTranslations("FeatureSection");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative">
        <CardContent className="p-8 relative z-10">
          <div
            className={`w-14 h-14 ${
              color === "blue" ? "bg-blue-100" : "bg-gray-100"
            } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon
              className={`w-7 h-7 ${color === "blue" ? "text-blue-600" : "text-gray-600"}`}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
          <div className="flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {t('learn_more')}
            <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function FeaturesSection() {
  const t = useTranslations("FeatureSection");
  
  const features = [
    {
      icon: Search,
      title: t('features.0.title'),
      description: t('features.0.description'),
      color: "blue",
    },
    {
      icon: BarChart3,
      title: t('features.1.title'),
      description: t('features.1.description'),
      color: "gray",
    },
    {
      icon: Users,
      title: t('features.2.title'),
      description: t('features.2.description'),
      color: "blue",
    },
    {
      icon: FileText,
      title: t('features.3.title'),
      description: t('features.3.description'),
      color: "gray",
    },
    {
      icon: Lightbulb,
      title: t('features.4.title'),
      description: t('features.4.description'),
      color: "blue",
    },
    {
      icon: Bell,
      title: t('features.5.title'),
      description: t('features.5.description'),
      color: "gray",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <Lightbulb className="w-4 h-4" />
            {t('section_title')}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('heading.line1')}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block">
              {t('heading.line2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subheading')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
