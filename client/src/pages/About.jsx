export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">About Porcelain Press</h1>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 leading-relaxed">
        <p>
          Porcelain Press is a demo academic publishing platform built with React/Vite and a simple Node/Express API.
          The goal is to provide a clean, modern interface for browsing journals and articles, reading PDFs directly on-site,
          and managing submissions through role-based access control.
        </p>

        <p className="mt-4">
          In this starter project, data is stored in memory and loaded from <code className="text-slate-100">server/data</code>.
          That makes it easy to replace with MongoDB later (MERN-style). You can also add real moderation workflows,
          email notifications, DOI minting, citation exports, and analytics.
        </p>

        <p className="mt-4">
          Roles: <strong className="text-slate-100">user</strong> can browse.
          <strong className="text-slate-100"> writer</strong> can submit work and edit their own content (once published).
          <strong className="text-slate-100"> editor</strong> can manage content and submissions.
          <strong className="text-slate-100"> administrator</strong> has full control.
        </p>
      </div>
    </div>
  );
}
