import React, { Suspense } from "react";

import ExperienceButtonWrapper from "./expreince-button-wrapper";
import { HomeExperiencesSection } from "./home-experiences-section";
import { HomeExperiencesSectionLoader } from "./home-experiences-section-loader";

export default function ExperienceButton() {
  return (
    <ExperienceButtonWrapper>
      <Suspense fallback={<HomeExperiencesSectionLoader />}>
        <HomeExperiencesSection />
      </Suspense>
    </ExperienceButtonWrapper>
  )
}
