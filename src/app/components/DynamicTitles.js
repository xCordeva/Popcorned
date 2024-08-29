// components/DynamicTitle.js
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Get the last part of the path
    const folderName = pathname.split("/").filter(Boolean).pop();

    // Capitalize the first letter of the folder name
    const formattedFolderName = folderName
      ? folderName.charAt(0).toUpperCase() + folderName.slice(1)
      : "Home";

    // Set document title dynamically
    document.title = `Popcorned - ${formattedFolderName}`;
  }, [pathname]);

  return null; // This component does not render any visual elements
}
