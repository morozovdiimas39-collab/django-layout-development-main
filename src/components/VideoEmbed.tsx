import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface VideoEmbedProps {
  contentKey: string;
  defaultVideoUrl: string;
  title: string;
}

export default function VideoEmbed({ contentKey, defaultVideoUrl, title }: VideoEmbedProps) {
  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);

  useEffect(() => {
    api.content.getAll().then((data) => {
      const videoContent = data.find(item => item.key === contentKey);
      if (videoContent && videoContent.value) {
        setVideoUrl(videoContent.value);
      }
    }).catch(() => {});
  }, [contentKey]);

  return (
    <div className="w-full h-full">
      <iframe 
        width="100%" 
        height="100%" 
        src={videoUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
