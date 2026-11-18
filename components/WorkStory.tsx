type Props = {
  text: string | null | undefined;
};

// "[ THE STORY ]" — plain-text ACF field, paragraphs separated by blank lines.
export default function WorkStory({ text }: Props) {
  const paragraphs = (text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <section className="work-story">
      <div className="wrapper">
        <h5 className="subhead">
          <span className="bracket">[</span>
          <span className="subhead-text">THE STORY</span>
          <span className="bracket">]</span>
        </h5>

        <div className="work-story-body">
          {paragraphs.map((p, i) => (
            <p key={i} className="h5">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
