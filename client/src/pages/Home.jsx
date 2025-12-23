import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import ContentCard from "../components/ContentCard.jsx";
import { api } from "../lib/api.js";

function Section({ title, subtitle, children, action }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [js, as] = await Promise.all([api("/journals"), api("/articles")]);
        if (!live) return;
        setJournals(js.slice(0, 3));
        setArticles(as.slice(0, 6));
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  return (
    <div>
      <Hero />

      <Section
        title="Latest journals"
        subtitle="Newest issues and collections."
        action={
          <button
            onClick={() => navigate("/journals")}
            className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
          >
            View all →
          </button>
        }
      >
        {loading ? (
          <div className="text-slate-300">Loading…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {journals.map((j) => (
              <ContentCard
                key={j.id}
                item={j}
                kind="journal"
                onClick={() => navigate(`/journals/${j.id}`)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Latest articles"
        subtitle="New writing from our contributors."
        action={
          <button
            onClick={() => navigate("/articles")}
            className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
          >
            View all →
          </button>
        }
      >
        {loading ? (
          <div className="text-slate-300">Loading…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <ContentCard
                key={a.id}
                item={a}
                kind="article"
                onClick={() => navigate(`/articles/${a.id}`)}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
