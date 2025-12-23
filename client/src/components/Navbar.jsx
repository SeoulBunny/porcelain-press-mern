import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkBase = "px-3 py-2 rounded-lg text-sm transition";
const linkInactive = "text-slate-200 hover:bg-white/5 hover:text-white";
const linkActive = "bg-white/10 text-white";

export default function Navbar() {
  const { user, isAuthed, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-left"
          aria-label="Go home"
        >
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-white/25 to-white/5 border border-white/10" />
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-wide">
              Porcelain Press
            </div>
            <div className="text-xs text-slate-300">Journals & Articles</div>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/journals"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Journals
          </NavLink>
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Articles
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            About
          </NavLink>
          {/* Writer + Editor */}
          {hasRole(["writer", "editor"]) && (
            <>
              <NavLink
                to="/my-work"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                My work
              </NavLink>

              <NavLink
                to="/submit"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Submit work
              </NavLink>
            </>
          )}

          {/* Admin only */}
          {hasRole(["administrator"]) && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthed ? (
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
            >
              Log in
            </button>
          ) : (
            <>
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-slate-300">{user.role}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
