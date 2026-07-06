import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-zinc-200 dark:text-zinc-800">404</h1>
      <h2 className="mt-8 text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
        Page not found
      </h2>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-md">
        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL?
      </p>
      <div className="mt-8">
        <Button onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    </div>
  );
}
