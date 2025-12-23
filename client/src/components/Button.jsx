export default function Button({ as: Comp = "button", className = "", ...props }) {
  return (
    <Comp
      className={
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold " +
        "bg-slate-100 text-slate-900 hover:bg-white active:scale-[0.98] transition " +
        "focus:outline-none focus:ring-2 focus:ring-white/30 " +
        className
      }
      {...props}
    />
  );
}
