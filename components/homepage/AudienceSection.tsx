"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Briefcase, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

const AudienceCard = ({ icon: Icon, title, description, benefits, color, index }: {
  icon: any,
  title: string,
  description: string,
  benefits: string[],
  color: string,
  index: number
}) => {
  const t = useTranslations("AudienceSection");

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
            className={`w-16 h-16 ${color === "blue"
                ? "bg-gradient-to-br from-blue-100 to-blue-200"
                : "bg-gradient-to-br from-gray-100 to-gray-200"
              } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon
              className={`w-8 h-8 ${color === "blue" ? "text-blue-600" : "text-gray-600"}`}
            />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

          <ul className="space-y-3 mb-6">
            {benefits.map((benefit, benefitIndex) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: benefitIndex * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-gray-700"
              >
                <div
                  className={`w-2 h-2 ${color === "blue" ? "bg-blue-600" : "bg-gray-600"
                    } rounded-full`}
                />
                {benefit}
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {t('learn_more')}
            <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </CardContent>

        {/* Hover effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  );
};

export function AudienceSection() {
  const t = useTranslations("AudienceSection");

  const audiences = [
    {
      icon: Building2,
      title: t('audiences.0.title'),
      description: t('audiences.0.description'),
      benefits: [
        t('audiences.0.benefits.0'),
        t('audiences.0.benefits.1'),
        t('audiences.0.benefits.2')
      ],
      color: "blue",
    },
    {
      icon: Users,
      title: t('audiences.1.title'),
      description: t('audiences.1.description'),
      benefits: [
        t('audiences.1.benefits.0'),
        t('audiences.1.benefits.1'),
        t('audiences.1.benefits.2')
      ],
      color: "gray",
    },
    {
      icon: Briefcase,
      title: t('audiences.2.title'),
      description: t('audiences.2.description'),
      benefits: [
        t('audiences.2.benefits.0'),
        t('audiences.2.benefits.1'),
        t('audiences.2.benefits.2')
      ],
      color: "blue",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
            <Users className="w-4 h-4" />
            {t('section_title')}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('heading.line1')}  {" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t('heading.line2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subheading')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <AudienceCard
              key={index}
              icon={audience.icon}
              title={audience.title}
              description={audience.description}
              benefits={audience.benefits}
              color={audience.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
