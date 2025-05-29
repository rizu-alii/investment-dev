
import { HomeHeader } from "./components/HomeHeader";
import { HomeHero } from "./components/HomeHero";
import { HomeFeatures } from "./components/HomeFeatures";
import { HomeAbout } from "./components/HomeAbout";
import { HomeInvest } from "./components/HomeInvest";
import { HomeFooter } from "./components/HomeFooter";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeAbout />
        <HomeFeatures />
        <HomeInvest />
      </main>
      <HomeFooter />
    </div>
  );
}

export default HomePage; 