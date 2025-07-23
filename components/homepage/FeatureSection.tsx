"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search, BarChart3, Users, FileText, Lightbulb, Bell, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Search,
    title: "Smart Keyword Generator",
    description: "AI-powered keyword suggestions with search volume, CPC, and competition analysis for maximum impact.",
    color: "blue",
  },
  {
    icon: BarChart3,
    title: "Campaign Auditor",
    description: "Comprehensive audits that identify budget waste, low-quality keywords, and missed opportunities.",
    color: "gray",
  },
  {
    icon: Users,
    title: "Competitor Tracking",
    description: "Monitor competitor ads, track changes, and gain insights into their performance strategies.",
    color: "blue",
  },
  {
    icon: FileText,
    title: "White-Label Reporting",
    description: "Custom-branded reports and downloadable PDFs perfect for agencies and client presentations.",
    color: "gray",
  },
  {
    icon: Lightbulb,
    title: "AI Optimization Tips",
    description: "Daily AI-generated recommendations for bid changes, keyword pausing, and performance improvements.",
    color: "blue",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Instant notifications for performance drops and significant changes to react quickly.",
    color: "gray",
  },
]

export function FeaturesSection() {
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
            Powerful Features
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block">
              dominate Google Ads
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful AI-driven features designed to optimize every aspect of your Google Ads campaigns
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
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
                      feature.color === "blue" ? "bg-blue-100" : "bg-gray-100"
                    } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon
                      className={`w-7 h-7 ${feature.color === "blue" ? "text-blue-600" : "text-gray-600"}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </CardContent>

                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
