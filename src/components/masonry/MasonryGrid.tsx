"use client";

import { useState } from "react";
import WorkCard from "./WorkCard";

interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  likeCount: number;
  commentCount: number;
  tags: string[];
}

interface MasonryGridProps {
  works: Work[];
}

export default function MasonryGrid({ works }: MasonryGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (workId: string) => {
    setLoadedImages((prev) => new Set(prev).add(workId));
  };

  // Distribute works into columns for masonry layout
  const columnCount = 3;
  const columns: Work[][] = Array.from({ length: columnCount }, () => []);

  works.forEach((work, index) => {
    columns[index % columnCount].push(work);
  });

  return (
    <div className="flex gap-4">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1 flex flex-col gap-4">
          {column.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              isLoaded={loadedImages.has(work.id)}
              onImageLoad={() => handleImageLoad(work.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
