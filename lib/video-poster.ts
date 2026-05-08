function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export async function getVideoPoster(
  videoUrl: string | null
): Promise<string | null> {
  if (!videoUrl) return null;

  const yt = getYouTubeId(videoUrl);
  if (yt) return `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`;

  const vm = getVimeoId(videoUrl);
  if (vm) {
    try {
      const res = await fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) return null;
      const data = (await res.json()) as { thumbnail_url?: string };
      return data.thumbnail_url || null;
    } catch {
      return null;
    }
  }

  return null;
}
