import React, { ReactNode } from 'react';

interface LayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ header, footer, children }) => {
  return (
    <div className={`flex flex-col h-screen bg-transparent relative z-1`}>
      {header && <header className="w-full h-20">{header}</header>}

      <main className="flex-1 flex items-center justify-center">{children}</main>

      {footer && <footer className="h-auto bg-transparent flex items-center justify-center">{footer}</footer>}
    </div>
  );
};

export default Layout;
