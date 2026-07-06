import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";

export function StrengthsWeaknesses({ strengths = [], weaknesses = [] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <CardHeader className="pb-3 border-b border-emerald-100 dark:border-emerald-900/50">
          <CardTitle className="text-emerald-800 dark:text-emerald-400 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start text-sm text-emerald-900 dark:text-emerald-100">
                <span className="mr-2 mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-rose-200 bg-rose-50/30 dark:border-rose-900/50 dark:bg-rose-950/20">
        <CardHeader className="pb-3 border-b border-rose-100 dark:border-rose-900/50">
          <CardTitle className="text-rose-800 dark:text-rose-400 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Critical Weaknesses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start text-sm text-rose-900 dark:text-rose-100">
                <span className="mr-2 mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                {w}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
