type Props = {
  image: { sourceUrl: string; altText: string } | null;
};

export default function ImageBannerHero({ image }: Props) {
  if (!image) return null;

  return (
    <div className="image-banner-hero">
      <img
        src={image.sourceUrl}
        alt={image.altText || ""}
        className="image-banner-hero-image"
      />
    </div>
  );
}
