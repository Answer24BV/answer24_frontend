import React from 'react'
import { HeroSection } from './HeroSection'
import { AudienceSection } from './AudienceSection'
import { FeaturesSection } from './FeatureSection'

const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <FeaturesSection />
            <AudienceSection />
        </div>
    )
}

export default HomePage