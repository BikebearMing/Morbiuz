import Image from "next/image";
import TransitionLink from "./TransitionLink";

export type NextProjectItem = {
  title: string;
  slug: string;
  image: { sourceUrl: string; altText: string } | null;
  projectName: string | null;
  rightSideLabel: string | null;
};

type Props = {
  items: NextProjectItem[];
  basePath?: string;
};

export default function NextProject({
  items,
  basePath = "/video-production",
}: Props) {
  if (items.length === 0) return null;

  return (
    <section className="next-project">
      <div className="wrapper">
        <h2 className="h1 next-project-title">
          <span>NEXT</span>
          <span className="next-project-row">
            PROJECT
            <Image
              className="next-project-arrow"
              src="/media/wp-content/uploads/2026/04/Morbius-GIF-4.gif"
              alt=""
              aria-hidden
              width={406}
              height={310}
              unoptimized
            />
          </span>
        </h2>

        <div className="next-project-cards">
          {items.map((item) => (
            <TransitionLink
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="next-project-card"
            >
              {item.image && (
                <Image
                  src={item.image.sourceUrl}
                  alt={item.image.altText || item.title}
                  width={1200}
                  height={675}
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              )}
              <div className="next-project-card-meta">
                <div className="next-project-card-text">
                  {item.projectName && (
                    <span className="next-project-card-project">
                      {item.projectName}
                    </span>
                  )}
                  <span className="h4 next-project-card-title">{item.title}</span>
                </div>
                {item.rightSideLabel && (
                  <span className="next-project-card-label">
                    {item.rightSideLabel}
                  </span>
                )}
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
