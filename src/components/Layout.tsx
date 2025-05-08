
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-16">
      <main>{children}</main>
      <Navigation />
    </div>
  );
}
