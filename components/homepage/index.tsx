"use client"
import React from 'react'
import { HeroSection } from './HeroSection'
import { AudienceSection } from './AudienceSection'
import { FeaturesSection } from './FeatureSection'
import SectionDownloadApp from './DownloadApp'

const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <FeaturesSection />
            <AudienceSection />
            <SectionDownloadApp />
        </div>
    )
}

export default HomePage