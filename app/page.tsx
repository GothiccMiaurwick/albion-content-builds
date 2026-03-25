import fs from "fs/promises";
import path from "path";
import CelestialBackground from "./components/CelestialBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BuildsClientViewer from "./components/BuildsClientViewer";
import { ContentData } from "./types/content";

// Force dynamic to ensure data is read fresh on request in dev
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <CelestialBackground>
      <main className="min-h-screen px-4 pb-20 max-w-5xl mx-auto flex flex-col items-center relative">
        <Header />
        
        {/* We suspend data fetching inside a React Server Component inline */}
        <DataLoader />

      </main>
      <Footer />
    </CelestialBackground>
  );
}

// Server Sub-component for data loading
async function DataLoader() {
  let initialData: ContentData | null = null;
  try {
    const DATA_PATH = path.join(process.cwd(), "app/data/content.json");
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    initialData = JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load initial data in layout:", error);
  }

  if (!initialData) {
    return (
      <div className="flex-1 flex items-center justify-center p-20 text-rose-500 italic">
        Error loading build data.
      </div>
    );
  }

  return <BuildsClientViewer initialData={initialData} />;
}
