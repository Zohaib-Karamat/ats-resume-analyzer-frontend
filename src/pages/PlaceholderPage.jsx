import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";

export function PlaceholderPage() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          {location.pathname.replace("/", "").replace("-", " ") || "Dashboard"}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          This is a placeholder for the {location.pathname} route.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Under Construction</CardTitle>
          <CardDescription>
            The content for this section will be implemented in upcoming steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-md border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="text-zinc-500 dark:text-zinc-400">Content Area</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
