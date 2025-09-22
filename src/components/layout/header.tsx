import { Wallet } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center gap-4 border-b bg-card px-4 py-3 md:px-6">
      <Wallet className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-xl font-bold tracking-tight">
        SpendWise
      </h1>
    </header>
  );
}
