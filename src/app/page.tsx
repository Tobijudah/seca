import { Ending } from "@/components/ending";
import { Landing } from "@/components/landing";
import { Timeline } from "@/components/timeline/timeline";

export default function Home() {
  return (
    <main>
      <Landing />
      <Timeline />
      <Ending />
    </main>
  );
}
