"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BarChart3, Users, FileText, Lightbulb, Bell, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import * as Dialog from '@radix-ui/react-dialog'

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  color: string;
  index: number;
  onOpen: () => void;
}

const FeatureCard = ({ icon: Icon, title, description, color, index, onOpen }: FeatureCardProps) => {
  const t = useTranslations("FeatureSection");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      whileHover={{ y: -5 }}
      className="group snap-center min-w-[300px] md:min-w-[350px] flex-shrink-0 px-2"
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
          <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
          <button 
            onClick={onOpen}
            className="flex items-center text-blue-600 font-medium text-sm group-hover:opacity-100 transition-opacity duration-300 hover:text-blue-700"
          >
            {t('learn_more')}
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const FeatureModal = ({ isOpen, onClose, title, content }: FeatureModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50 p-6 focus:outline-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
            <Dialog.Title className="text-2xl font-bold text-gray-900">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 -mr-2"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>
          <div className="prose prose-blue max-w-none">
            {content.split('\n\n').map((paragraph, i) => {
              // Check if paragraph is a heading
              if (paragraph.startsWith('**')) {
                const text = paragraph.replace(/\*\*/g, '');
                return <p key={i} className="font-semibold text-gray-900 mt-6 mb-2">{text}</p>;
              }
              return <p key={i} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const CarouselButton = ({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 text-gray-700 hover:bg-white hover:text-blue-600 transition-all disabled:opacity-30"
    aria-label="Carousel navigation"
  >
    {children}
  </button>
);

export function FeaturesSection() {
  const t = useTranslations("FeatureSection");
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const handleOpenModal = (index: number) => {
    setSelectedFeatureIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedFeatureIndex(null);
  };
  
  const scrollToIndex = (index: number) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => scrollToIndex((currentIndex + 1) % features.length);
  const prevSlide = () => scrollToIndex((currentIndex - 1 + features.length) % features.length);
  
  const features = [
    {
      icon: Search,
      title: "🔍 Slimme Trefwoordgenerator",
      description: "Genereer automatisch zoekwoorden met hoog zoekvolume, lage CPC en weinig concurrentie. Zo haal je klanten binnen die anderen vergeten — en bespaar je op elk klikbudget.",
      content: "De meeste ondernemers adverteren op dure en concurrerende zoekwoorden die weinig opleveren. Bureaus vragen al snel €500–1000 per maand om af en toe in je zoekwoorden te duiken, vaak slechts 1–2 uur per week. Onze AI daarentegen scant je website, campagnes en trends élke dag en zoekt naar verborgen zoekwoorden met hoog potentieel, weinig concurrentie en lage klikprijzen.\n\n**Voordeel:** je bespaart aanzienlijk op kosten per klik en krijgt relevanter verkeer.\n**Uniek:** in plaats van éénmalige handmatige suggesties van een marketeer, draait onze AI 24/7 mee op je data.\n**Het beste:** je betaalt pas als het werkt — pure no-cure-no-pay.",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "📊 Campagne-auditor",
      description: "Laat onze AI je campagnes scannen op verspilling, dure of irrelevante zoekwoorden en gemiste kansen. Zo verdienen wij onszelf eigenlijk altijd terug — met onze no-cure-no-pay aanpak.",
      content: "80% van de bedrijven verspilt ongemerkt honderden euro's per maand aan advertenties. Een bureau kijkt hier hooguit wekelijks naar en baseert beslissingen vaak op gevoel of verouderde data. Onze AI analyseert élke dag jouw campagnes: van zoekwoorden tot prestaties, biedingen en advertentieteksten. Hij signaleert verspilling direct, stelt verbeteringen voor en voorkomt herhaling.\n\n**Voordeel:** je haalt meer rendement uit je bestaande budget.\n**Uniek:** 24/7 automatische analyse én optimalisatie zonder dat je zelf iets hoeft te doen.\n**Het beste:** geen loze rapporten achteraf, maar directe actie op het moment dat het telt.",
      color: "gray",
    },
    {
      icon: Users,
      title: "🕵️ Concurrentievolging",
      description: "Zie welke advertenties jouw concurrenten tonen, hoe vaak ze wijzigen en waar ze hun focus leggen. Ons slimme AI-systeem laat jou op plekken scoren waar niemand anders adverteert — met lagere kosten en meer verkeer.",
      content: "Concurrenten veranderen vaak meerdere keren per week hun advertenties, zoekwoorden of biedstrategieën — en de meeste bedrijven hebben geen idee. Onze AI volgt deze bewegingen 24/7 en laat precies zien waar ze op adverteren, wat ze wijzigen en waar kansen ontstaan. Zo voorkom je dat je achterloopt en kun je direct adverteren op plekken waar zij nog níet zitten.\n\n**Voordeel:** je blijft voor op concurrenten en adverteert slimmer en goedkoper.\n**Uniek:** in tegenstelling tot bureaus hoef je bij ons niet te wachten op handmatige concurrentie-analyses — alles gebeurt live.\n**Het beste:** de AI koppelt inzichten direct aan jouw campagnes en geeft toepasbare adviezen.",
      color: "blue",
    },
    {
      icon: FileText,
      title: "📄 White-Label Rapportages",
      description: "Download professionele rapporten in je eigen huisstijl. Perfect voor bureaus, salesgesprekken of presentaties aan klanten. Zo kun je jouw impact onderbouwen met echte data — zonder extra werk.",
      content: "Veel ondernemers krijgen onduidelijke rapporten van hun marketingbureau of een standaard Google Ads-export zonder context. Met Answer24 krijg je met één klik een professioneel rapport in jouw huisstijl, inclusief leads, prestaties, trends en aanbevelingen.\n\n**Voordeel:** je ziet in één oogopslag waar je winst behaalt en waar ruimte ligt.\n**Uniek:** volledig automatisch gegenereerd, zonder handmatig werk of wachttijd.\n**Het beste:** je kunt dit gebruiken richting je klanten, collega's of management — overtuigend en meetbaar bewijs dat je online marketing werkt.",
      color: "gray",
    },
    {
      icon: Lightbulb,
      title: "💡 AI-optimalisatietips",
      description: "Dagelijks persoonlijk advies over biedingen, keywords en verbeteringen. We kennen al je producten, pagina's en klanten — en optimaliseren alles voor je.",
      content: "Campagnes hebben dagelijks aandacht nodig. Bureaus werken vaak met maandelijkse optimalisaties of 'wat handmatig bijschaven'. Maar in een wereld waar prijzen, concurrentie en gedrag constant veranderen, verlies je dan snel rendement. Onze AI scant dagelijks je website, advertenties en bezoekersgedrag, en geeft concrete tips: wat pauzeren, verhogen of verbeteren.\n\n**Voordeel:** je optimaliseert continu en laat geen winst liggen.\n**Uniek:** de AI kent jouw producten, teksten en doelgroep — en stemt daar alle adviezen perfect op af.\n**Het beste:** je hoeft niets handmatig te doen. Alles draait vanzelf.",
      color: "blue",
    },
    {
      icon: Bell,
      title: "🔔 Slimme Meldingen",
      description: "Ontvang direct meldingen als prestaties dalen of concurrenten versnellen. Zo haal jij het maximale uit je website — iets wat geen enkel marketingbureau 24/7 kan garanderen.",
      content: "Veel bedrijven merken pas dagen later dat hun prestaties dalen of dat een concurrent ineens prominent aanwezig is. Tegen die tijd is het leed vaak al geleden. Onze AI houdt alles realtime in de gaten — en stuurt direct een melding bij opvallende veranderingen. Of dat nu een scherpe daling is, een nieuwe advertentie van een concurrent, of een plotselinge budgetverspilling.\n\n**Voordeel:** je grijpt in vóórdat het je geld kost.\n**Uniek:** 24/7 monitoring van al je prestaties — zonder dat je hoeft in te loggen of dashboards hoeft te checken.\n**Het beste:** geen ander bureau biedt deze snelheid, diepgang én realtime actie tegelijkertijd.",
      color: "gray",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <FeatureModal 
        isOpen={selectedFeatureIndex !== null}
        onClose={handleCloseModal}
        title={selectedFeatureIndex !== null ? features[selectedFeatureIndex].title : ''}
        content={selectedFeatureIndex !== null ? features[selectedFeatureIndex].content : ''}
      />
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
                    onOpen={() => handleOpenModal(index)}
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
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
