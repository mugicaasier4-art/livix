import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import ExitIntentPopup from "@/components/common/ExitIntentPopup";
import BackToTopFAB from "@/components/ui/BackToTopFAB";
import LoginPrompt from "@/components/auth/LoginPrompt";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Ir al contenido principal
      </a>
      <Header />
      <main id="main-content" className="flex-1 pb-14 md:pb-0" role="main">
        {children}
      </main>
      <div className="block">
        <Footer />
      </div>
      <MobileBottomNav />
      <BackToTopFAB />
      <ExitIntentPopup />
      <LoginPrompt />
    </div>
  );
};

export default Layout;