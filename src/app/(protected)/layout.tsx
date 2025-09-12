import { Navbar } from "@/features/common/navbar";

export default function ProtectedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-7xl mx-auto px-2">
      <Navbar />
      <>{children}</>
    </div>
  );
}
