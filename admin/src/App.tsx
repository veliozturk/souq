import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-svh flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <ShieldCheck className="size-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Souq Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform admin panel — scaffold ready.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </div>
    </div>
  )
}

export default App
