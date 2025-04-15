import { Raleway } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/navbar.js";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "EventMix",
  description: "EventMix created by Damián",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.className}`}>
        <header>
          <h1 className="text-2xl font-bold mb-6">EventMix</h1>
        </header>
        <Navbar />
        <main>
          {children}
        </main>
        <footer>
          <p>&copy; 2025 EventMix. Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
