import { NavBar } from "@/components/web/NavBar";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
