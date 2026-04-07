"use client"
import GradientText from "@/components/GradientText";
import FlowingMenu from "@/components/FlowingMenu";
import { cormorantFont, loveFont } from "@/lib/fonts";
import TargetCursor from "@/components/TargetCursor";

export default function Welcome() {
  const demoItems = [
    { link: '', text: 'The words you never said', image: 'https://picsum.photos/600/400?random=1' },
    { link: '', text: 'The ending that never came', image: 'https://picsum.photos/600/400?random=2' },
    { link: '', text: 'The memory that still hurts', image: 'https://picsum.photos/600/400?random=3' },
    { link: '', text: 'Write what was left behind', image: 'https://picsum.photos/600/400?random=4' }
  ];

  return (
    <>
      <TargetCursor/>
      {/* Hero Section */}
      <div className="bg-black text-white min-h-screen flex flex-col md:flex-row overflow-auto">

        {/* Text Column */}
        <div className="w-full md:w-1/2 pt-12 md:pt-30 px-6 md:pl-10 md:pr-6 flex flex-col justify-center pb-8 md:pb-0">
          <GradientText
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            animationSpeed={8}
            showBorder={false}
            className={`custom-class text-6xl sm:text-7xl md:text-8xl ml-0 md:ml-2 ${loveFont.className}`}
          >
            HalfWritten
          </GradientText>

          <h1 className={`${loveFont.className} text-2xl sm:text-3xl md:text-4xl mt-2`}>
            Write the ending you never got to live.
          </h1>

          <h1 className={`${loveFont.className} text-base sm:text-lg md:text-xl pt-6 md:pt-10`}>
            This is a collaborative playground where you can post fragments of stories, poems, or scripts and let the community help you find the missing pieces. Whether you're here to bridge a plot hole, brainstorm a killer ending, or add a twist to someone else's draft, your goal is to keep the momentum going.
          </h1>
        </div>

        {/* Video Column */}
        <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-screen flex-shrink-0">
          <video
            className="w-full h-full object-cover"
            loop
            autoPlay
            muted
            playsInline
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Flowing Menu Section */}
      <div style={{ height: '400px', position: 'relative' }} className={`sm:h-[500px] md:h-[600px] ${cormorantFont.className}`}>
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
  );
}