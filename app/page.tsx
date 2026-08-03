import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 font-sans flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Gallery Component Collection</h1>
      <div className="flex gap-4">
        <Link 
          href="/v1" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
        >
          Gallery v1 (Infinite Canvas)
        </Link>
        <Link 
          href="/v2" 
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition"
        >
          Gallery v2 (3D Grid)
        </Link>
      </div>
    </main>
  );
}