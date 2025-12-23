import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <div className="text-5xl font-extrabold">404</div>
      <p className="mt-3 text-slate-300">That page doesn’t exist.</p>
      <Link to="/" className="mt-6 inline-block text-slate-300 hover:text-white underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
}
