import React from "react";
import Navigation from "./Navigation.tsx";
import type { LayoutProps } from "./Layout.types.ts";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
