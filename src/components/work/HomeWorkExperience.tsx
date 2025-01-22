import { ProjectEntry } from "./ProjectEntry";
import automationImage from "@/assets/homekit-location-automation.png";
import cameraImage from "@/assets/home-cameras-iphone-2.png";
import Link from "next/link";
import { PhonePocketImage } from "./PhonePocketImage";
import { WorkExperience } from "./WorkExperience";

import HomeKitIcon from '@/assets/homekit-icon.svg'
import HomeBackgroundImage from "@/assets/home-green-wallpaper.png";

export default function HomeWorkExperience() {
  return (
    <WorkExperience
      company="Apple"
      role="Home app"
      period="2015 - 2019"
      description="
      I worked on the Home app team for almost 5 years, from the beginning of the first version of the app in iOS 10. I had the opportunity to work on many different parts of the app, from the core appearance to accessory 
      "
      Icon={HomeKitIcon}
      backgroundImage={HomeBackgroundImage}
    >
      <ProjectEntry
        title="HomeKit Secure Video"
        description="
        HomeKit Secure Video enables HomeKit cameras to automatically record footage based on events like when a person is detected at the door and save it to the cloud, securely and privately. I helped build the Home app UI and design the architecture for the feature. I focused in particular on the data model and streaming camera clips via HTTP Live Streaming (HLS), but had a hand in many aspects of the feature, as well as project management.
        "
      >
        <PhonePocketImage
          src={cameraImage}
          alt="HomeKit Secure Video"
        />
      </ProjectEntry>
      <ProjectEntry
        title="Home Presence Automations"
        description={
          <>
            Home presence automations allow actions to be run automatically when people in the home arrive or leave, using a secure "check-in" system with a home hub (e.g., a HomePod) to determine who's home. I was able to help design, plan, and build the feature, from the core architecture to the entire UI flow. We also received <Link className="underline" href="https://patents.google.com/patent/US10962942B2/en" target="_blank" rel="noopener noreferrer">a patent</Link> for the design!
          </>
        }
        orientation="right"
      >
        <PhonePocketImage
          src={automationImage}
          alt="Home Presence Automations"
          className="sm:-mb-9"
        />
      </ProjectEntry>
    </WorkExperience>
  )
}