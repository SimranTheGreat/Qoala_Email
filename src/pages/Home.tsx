import {
  Header,
  Sidebar,
  Toolbar,
  EmailList,
} from "../components";

export default function Home() {
  return (
    <div className="h-screen bg-white text-gray-800">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <Toolbar />
          <EmailList />
        </main>
      </div>
    </div>
  );
}