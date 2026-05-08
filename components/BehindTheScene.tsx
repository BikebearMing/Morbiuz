import { BtsCredit } from "@/types/wordpress";

type Props = {
  credits: BtsCredit[];
};

export default function BehindTheScene({ credits }: Props) {
  const items = credits
    .map((c) => {
      const role = (c.role || "").trim();
      const names =
        c.nameRepeater
          ?.map((n) => (n.name || "").trim())
          .filter(Boolean) || [];
      return { role, names };
    })
    .filter((c) => c.role && c.names.length > 0);

  if (items.length === 0) return null;

  return (
    <section className="behind-the-scene">
      <div className="wrapper">
        <h5 className="subhead">
          <span className="bracket">[</span>
          <span className="subhead-text">BEHIND THE SCENE</span>
          <span className="bracket">]</span>
        </h5>

        <div className="bts-row">
          <h2 className="h2-v2 dark bts-title">THE CREW</h2>

          <div className="bts-credits">
            {items.map((g, i) => (
              <div key={i} className="bts-credit">
                <span className="subhead bts-role">{g.role}</span>
                {g.names.map((n, j) => (
                  <span key={j} className="subhead bts-name">
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
