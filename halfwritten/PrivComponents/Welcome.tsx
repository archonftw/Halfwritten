"use client"
import GradientText from "@/components/GradientText";
import FlowingMenu from "@/components/FlowingMenu";
import { loveFont } from "@/lib/fonts";





export default function Welcome() {

const demoItems = [
  { link: '#', text: 'The words you never said', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'The ending that never came', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'The memory that still hurts', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Write what was left behind', image: 'https://picsum.photos/600/400?random=4' }
];


    return(
        <>
          <div className="bg-black text-white h-screen flex overflow-auto">
  <div className="w-1/2 pt-30 pl-10 pr-6 flex flex-col justify-center">
    <GradientText
      colors={["#5227FF","#FF9FFC","#B19EEF"]}
      animationSpeed={8}
      showBorder={false}
      className={`custom-class text-8xl ml-2 ${loveFont.className}`}
    >
      HalfWritten
    </GradientText>

    <h1 className={`${loveFont.className} text-4xl`}>
      Write the ending you never got to live.
    </h1>

    <h1 className={`${loveFont.className} text-xl pt-10`}>
      This is a collaborative playground where you can post fragments of stories, poems, or scripts and let the community help you find the missing pieces. Whether you’re here to bridge a plot hole, brainstorm a killer ending, or add a twist to someone else’s draft, your goal is to keep the momentum going.
    </h1>
  </div>

  <div className="w-1/2 h-full">
    <video className="w-full h-full object-cover" loop autoPlay muted playsInline>
      <source src="/video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</div>

<div style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu
    items={demoItems}
    speed={15}
    textColor="#ffffff"
    bgColor="#060010"
    marqueeBgColor="#ffffff"
    marqueeTextColor="#060010"
    borderColor="#ffffff"
  />
</div>
        </>
    )
}