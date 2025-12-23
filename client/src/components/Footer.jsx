import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Footer() {
  const { hasRole } = useAuth();

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold">Porcelain Press</div>
          <p className="mt-2 text-sm text-slate-300">
            A demo academic publishing site. Swap the dummy backend for MongoDB
            when you’re ready.
          </p>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-slate-200">Navigation</div>
          <div className="mt-3 grid gap-2 text-slate-300">
            <Link className="hover:text-white" to="/">
              Home
            </Link>
            <Link className="hover:text-white" to="/journals">
              Journals
            </Link>
            <Link className="hover:text-white" to="/articles">
              Articles
            </Link>
            <Link className="hover:text-white" to="/about">
              About
            </Link>
            {hasRole(["writer", "editor", "administrator"]) && (
              <>
                <Link className="hover:text-white" to="/my-work">
                  My work
                </Link>
                <Link className="hover:text-white" to="/submit">
                  Submit Work
                </Link>
              </>
            )}
            {hasRole(["writer", "editor"]) && (
              <>
                <Link className="hover:text-white" to="/my-work">
                  My work
                </Link>
                <Link className="hover:text-white" to="/submit">
                  Submit work
                </Link>
              </>
            )}

            {hasRole(["administrator"]) && (
              <Link className="hover:text-white" to="/admin">
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-slate-200">Contact</div>
          <div className="mt-3 text-slate-300">
            <div>Email: contact@porcelainpress.example</div>
            <div className="mt-2">
              © {new Date().getFullYear()} Porcelain Press
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
