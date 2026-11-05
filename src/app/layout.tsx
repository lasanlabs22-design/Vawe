import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter, Italiana, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./shutters.css";
import "./sliding.css";
import "./partitions.css";
import "./bathroom.css";
import "./fabric.css";
import { site } from "@/lib/site";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import Motion from "@/components/Motion";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const italiana = Italiana({ variable: "--font-italiana", weight: "400", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", weight: ["400", "500"], subsets: ["latin"] });
// Only for the "Powered by Lasan Labs" signature in the footer.
const grotesk = Space_Grotesk({ variable: "--font-space-grotesk", weight: "600", subsets: ["latin"] });

// Link previews (WhatsApp, Facebook, X) need the card image on a host that serves it. vaweinterio.com
// is still a parked domain, so on Vercel use the project's production domain, which switches to the
// custom domain once one is attached.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(productionHost ? `https://${productionHost}` : site.url),
  title: {
    default: `${site.name} | Shutters, Sliding Partitions & Mirrors`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

// Runs before first paint: enables JS-only reveal styles and skips the intro on repeat visits.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('vawe-intro'))d.classList.add('intro-seen');else sessionStorage.setItem('vawe-intro','1')}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${inter.variable} ${italiana.variable} ${mono.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Preloader />
        <Nav />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
        <Motion />
      </body>
    </html>
  );
}
