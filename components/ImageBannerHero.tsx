import Image from "next/image";

type Props = {
  image: { sourceUrl: string; altText: string } | null;
};

export default function ImageBannerHero({ image }: Props) {
  if (!image) return null;

  return (
    <div className="image-banner-hero">
      <Image
        src={image.sourceUrl}
        alt={image.altText || ""}
        className="image-banner-hero-image"
        width={1600}
        height={900}
        sizes="100vw"
      />
    </div>
  );
}
