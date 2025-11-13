import dynamic from "next/dynamic";

const BlockbusterScene = dynamic(() => import("@/components/BlockbusterScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        fontSize: "1.5rem",
        letterSpacing: "0.1em"
      }}
    >
      Loading video library...
    </div>
  )
});

export default function HomePage() {
  return <BlockbusterScene />;
}
