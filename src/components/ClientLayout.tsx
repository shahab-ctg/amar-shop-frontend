import Footer from "./Footer";
import Topbar from "./Topbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ... আপনার existing code

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ... আপনার existing background code */}

      <div className="relative z-10">
        <Topbar />
        {/* REMOVE container class from here - let HomePage handle it */}
        <main className="w-full bg-[#F5FDF8] pt-0">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
