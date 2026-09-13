import type { ReactNode } from "react";
import PublicMenu from "../../components/PublicMenu";
import Footer from "../../components/Footer"

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Services", ariaLabel: "View our services", link: "/services" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <PublicMenu items={menuItems} socialItems={socialItems} />

      <main className="flex-1">{children}</main>
 
      <Footer />
    </div>
  );
}
