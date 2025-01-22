import { WorkExperience } from "@/components/work/WorkExperience";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { PhonePocketImage } from "@/components/work/PhonePocketImage";
import { Wrench } from "lucide-react";
import JailbreakBackgroundImage from '@/assets/og-iphone-wallpaper.jpg'
import AbstergoImage from '@/assets/abstergo.png'
import MergeImage from '@/assets/merge.png'
import JukeboxImage from '@/assets/jukebox.png'

export default function JailbreakWorkExperience() {
  return (
    <WorkExperience
      company="Jailbreak"
      role="iOS Jailbreak Developer"
      period="2011 - 2013"
      description="
      I got my start in iOS development while in university by getting involved in the iOS jailbreak community. I worked on building “tweaks”, or extensions that modified the OS itself, for jailbroken devices. I learned how to reverse engineer the internals of the OS, hook into the right functions, and use it to build cool tweaks. Some of these were eventually added as native iOS features by Apple!
      "
      Icon={Wrench}
      backgroundImage={JailbreakBackgroundImage}
    >
      <ProjectEntry
        title="Abstergo"
        description="
            Meaning “to clean away” in Latin, Abstergo provided tools for easily managing notifications for iOS 5-6. It added the ability to clear a single notification or all notifications with a swipe (before these existed natively), and a reminder system to postpone notifications until later.
            "
      >
        <PhonePocketImage src={AbstergoImage} alt="Abstergo" />
      </ProjectEntry>
      <ProjectEntry
        title="Merge"
        description="
            Messages on iOS had a longstanding annoying behavior in iOS 5-6: conversations with different numbers or emails for the same contact were kept separate. This was especially bad when iMessage had a habit of changing which address you were messaging, causing conversations to fork off and get very confusing. Merge fixed that problem, automatically merging these conversations together in the UI, and providing an easy way to select which address your message would be sent to.
            "
        orientation="right"
      >
        <PhonePocketImage src={MergeImage} alt="Merge" />
      </ProjectEntry>
      <ProjectEntry
        title="Jukebox"
        description="
            Jukebox provided a beautiful music widget with rich controls built into Notification Center on iOS 5-6 (before widgets existed natively). It even integrated with other tweaks to support being used directly on the Home Screen.
            "
      >
        <PhonePocketImage src={JukeboxImage} alt="Jukebox" className="sm:-mb-9" imageClassName="max-w-[260px]" />
      </ProjectEntry>
    </WorkExperience>
  )
}