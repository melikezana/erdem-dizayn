import { LenisProvider } from "@/components/providers/LenisProvider";
import { HorizontalShowroom } from "@/components/sections/HorizontalShowroom";

export default function Home() {
  return (
    <LenisProvider>
      <HorizontalShowroom />
    </LenisProvider>
  );
}
