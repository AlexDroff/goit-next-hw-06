import TanstackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <TanstackProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
