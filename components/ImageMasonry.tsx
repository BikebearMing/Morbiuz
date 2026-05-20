type Image = { sourceUrl: string; altText: string };

type Props = {
  images: Image[];
};

function columnCount(count: number): number {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  if (count <= 8) return 4;
  return 5;
}

export default function ImageMasonry({ images }: Props) {
  if (images.length === 0) return null;

  const cols = columnCount(images.length);

  return (
    <section className="image-masonry">
      <div
        className="image-masonry-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {images.map((img, i) => (
          <div key={i} className="image-masonry-cell">
            <img src={img.sourceUrl} alt={img.altText || ""} />
          </div>
        ))}
      </div>
    </section>
  );
}
