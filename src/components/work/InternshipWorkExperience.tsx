import { WorkExperience } from "@/components/work/WorkExperience";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { PhonePocketImage } from "@/components/work/PhonePocketImage";
import { Smartphone } from "lucide-react";

import iOSInternBackgroundImage from '@/assets/ios7-wallpaper.png'
import SettingsSearchImage from '@/assets/settings-search.png'
import CalculatorPhoneImage from '@/assets/calculator.png'

export default function InternshipWorkExperience() {
  return (
    <WorkExperience
      company="Apple"
      role="iOS Apps & Frameworks Intern"
      period="2013 - 2014"
      description="
      I first joined Apple as an intern in 2013 on the iOS Apps & Frameworks team, where I was able to help fix a variety of bugs for the release of iOS 7. Across my two internships in 2013 and 2014, I was able to work on a number of different projects and prototypes and demo them to senior leadership. Here are two of them that wound up shipping:
      "
      Icon={Smartphone}
      backgroundImage={iOSInternBackgroundImage}
    >
      <ProjectEntry
        title="Search in Settings"
        description="
      I built the first version of the search feature in the Settings app on iOS, which later shipped in iOS 9. This meant building both the UI and the search index across all settings, which required building new APIs and sprawling adoption across hundreds of settings pages.
      ">
        <PhonePocketImage src={SettingsSearchImage} alt="Settings" />
      </ProjectEntry>
      <ProjectEntry
        title="Interactive Calculator"
        description="
        I rewrote large parts of the Calculator app in Swift, making it one of the first Apple apps using the language in iOS 9. I also built a new design that supported visualizing and editing expressions, and viewing a calculation history. While these did not ship in iOS 9, they did eventually get resurrected with the Calculator redesign in iOS 18!
        "
        orientation="right"
      >
        <PhonePocketImage src={CalculatorPhoneImage} alt="Calculator" className="sm:-mb-8 sm:border-hidden" />
      </ProjectEntry>
    </WorkExperience>
  )
}