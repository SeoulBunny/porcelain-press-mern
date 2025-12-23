import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { dummyUsers } from "../data/dummyUsers.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("writer@demo.com");
  const [password, setPassword] = useState("writer1234");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">Log in</h1>
      <p className="mt-2 text-slate-300">Use the demo accounts below.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <label className="block text-sm text-slate-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
            placeholder="email@demo.com"
          />

          <label className="mt-4 block text-sm text-slate-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
            placeholder="••••••••"
          />

          {err ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          <div className="mt-6">
            <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </div>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Demo accounts</div>
          <div className="mt-4 grid gap-3">
            {dummyUsers.map((u) => (
              <button
                key={u.email}
                onClick={() => { setEmail(u.email); setPassword(u.password); }}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left hover:bg-white/10 transition"
              >
                <div className="text-sm font-semibold">{u.role}</div>
                <div className="mt-1 text-xs text-slate-300">{u.email}</div>
                <div className="mt-1 text-xs text-slate-300">Password: {u.password}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 text-xs text-slate-400">
            NOTE: This is dummy auth for a starter project (plaintext passwords). Replace before production.
          </div>
        </div>
      </div>
    </div>
  );
}
