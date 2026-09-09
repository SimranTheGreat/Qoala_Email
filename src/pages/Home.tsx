import { useState } from "react";
import {
  Header,
  Sidebar,
  Toolbar,
  EmailList,
    ComposeScreen 
} from "../components";

export default function Home() {
     const [composeOpen, setComposeOpen] = useState(false);
  return (
    <div className="h-screen bg-white text-gray-800">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar onCompose={() => setComposeOpen(true)}/>

        <main className="flex-1 overflow-auto">
          <Toolbar />
          <EmailList />
        </main>
          <ComposeScreen
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
      />
      </div>
    </div>
  );
}