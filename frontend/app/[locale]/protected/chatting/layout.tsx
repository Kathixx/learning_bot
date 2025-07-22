
import {Nav} from "@/components/nav"
import {Footer} from "@/components/footer"


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col">
        <Nav/>
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
        <Footer/>
    </main>
  );
}
