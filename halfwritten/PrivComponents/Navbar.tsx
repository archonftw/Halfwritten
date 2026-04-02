'use client';

import Dock from "@/components/Dock";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const router = useRouter();
  const goToRoute = (path: string) => {
    router.push(path);
  };

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => goToRoute('/') },
    { icon: <VscArchive size={18} />, label: 'Post', onClick: () => goToRoute('/post') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => goToRoute('/profile') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => goToRoute('/settings') },
  ];

  return (
    <div>
      <Dock className="bg-black"
        items={items}
        panelHeight={80}
        baseItemSize={60}
        magnification={80}
      />
    </div>
  );
}