import Link from "next/link";

const VERSIONS = [
  { id: "1", name: "not decided", route: "/v1", desc: "." },
  { id: "2", name: "perspective grid", route: "/v2", desc: "" },
  { id: "3", name: "depth tunnel", route: "/v3", desc: "." },
  { id: "4", name: "elastic smh", route: "/v4", desc: "." },
  { id: "5", name: "cursor follower line gallery ", route: "/v5", desc: "." },
  { id: "6", name: "not decided", route: "/v6", desc: "." },
  { id: "7", name: "not decided", route: "/v7", desc: "." },
  { id: "8", name: "not decided", route: "/v8", desc: "." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12 max-w-4xl mx-auto flex flex-col justify-center">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100">
          Gallery components using infinite canvas
        </h1>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VERSIONS.map((item) => (
          <Link
            key={item.id}
            href={item.route}
            className="group p-5 rounded-lg border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-xs font-mono text-zinc-500">
                {item.id}
              </span>
              <h2 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                {item.name}
              </h2>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed pl-7">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}