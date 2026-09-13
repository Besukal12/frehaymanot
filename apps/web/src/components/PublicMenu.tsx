"use client";

import StaggeredMenu, {
  type StaggeredMenuItem,
  type StaggeredMenuSocialItem,
} from "./StaggeredMenu";

type PublicMenuProps = {
  items: StaggeredMenuItem[];
  socialItems: StaggeredMenuSocialItem[];
};

export default function PublicMenu({ items, socialItems }: PublicMenuProps) {
  return (
    <StaggeredMenu
      position="right"
      items={items}
      socialItems={socialItems}
      displaySocials
      isFixed
      displayItemNumbering
      menuButtonColor="#ffffff"
      openMenuButtonColor="#fff"
      changeMenuColorOnOpen
      colors={["#B497CF", "#5227FF"]}
      logoUrl="/logo.jpg"
      accentColor="#5227FF"
      onMenuOpen={() => console.log("Menu opened")}
      onMenuClose={() => console.log("Menu closed")}
    />
  );
}
