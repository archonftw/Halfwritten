"use client"
import { Love_Ya_Like_A_Sister } from "next/font/google";
import GradientText from "@/components/GradientText";
const loveFont = Love_Ya_Like_A_Sister({
  weight:'400',
})
  
export default function page() {
  return (
    <div className="bg-black text-white h-full flex">
      <div className="pt-30 pl-10">
        <a href="/" className={`text-9xl ${loveFont.className}`}></a>
        <GradientText
  colors={["#5227FF","#FF9FFC","#B19EEF"]}
  animationSpeed={8}
  showBorder={false}
  className={`custom-class text-9xl ml-2 ${loveFont.className}`}
>
  HalfWritten
</GradientText>
        <h1 className={` ${loveFont.className} text-4xl`}>Write the ending you never got to live.</h1>
        <h1 className={` ${loveFont.className} text-xl pt-10`}>This is a collaborative playground where you can post fragments of stories, poems, or scripts and let the community help you find the missing pieces. Whether you’re here to bridge a plot hole, brainstorm a killer ending, or add a twist to someone else’s draft, your goal is to keep the momentum going.</h1>
      </div>
    <div className="video-area">
      <video loop autoPlay muted playsInline>
        <source src="video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    </div>

  );
}
