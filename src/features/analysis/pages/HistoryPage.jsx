import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, Clock, Target, Trash2 } from "lucide-react";
import { useAnalysisHistory } from "../hooks/useAnalysisHistory";
import { useDeleteAnalysis } from "../hooks/useDeleteAnalysis";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Card, CardContent } from "../../../components/ui/Card";
import { IconButton } from "../../../components/ui/IconButton";
import { QueryErrorState } from "../../../components/ui/States";

function getScoreColor(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

function SortIcon({ active, order }) {
  if (!active) return <div className="w-4 h-4" />;
  return order === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />;
}

export function HistoryPage() {
  const { data: history, isLoading, isError, refetch } = useAnalysisHistory();
  const { mutate: deleteAnalysis, isPending: isDeleting } = useDeleteAnalysis();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'score'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' | 'desc'
  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const sortedAndFiltered = (history || [])
    .filter(item => 
      item.resumeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.jdTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "score") {
        comparison = a.score - b.score;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleDelete = (event, id) => {
    event.stopPropagation();
    deleteAnalysis(id);
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          Analysis History
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Review your past resume matches and ATS feedback.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Search by resume or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isError ? (
        <QueryErrorState
          onRetry={refetch}
          message="We could not load your analysis history from the server."
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : sortedAndFiltered.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Resume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Job Description
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                    onClick={() => handleSort("score")}
                  >
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 mr-1" />
                      <span>Score</span>
                      <SortIcon active={sortBy === "score"} order={sortOrder} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Date</span>
                      <SortIcon active={sortBy === "date"} order={sortOrder} />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-950 dark:divide-zinc-800">
                {sortedAndFiltered.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => navigate(`/analysis/${item.id}`)}
                    className="cursor-pointer hover:bg-zinc-50 transition-colors dark:hover:bg-zinc-900/50"
                  >
                    <td className="max-w-[220px] truncate px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.resumeName}
                    </td>
                    <td className="max-w-[260px] truncate px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {item.jdTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={getScoreColor(item.score)}>{item.score}%</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        title="Delete analysis"
                        aria-label={`Delete analysis ${item.id}`}
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/50"
                        disabled={isDeleting}
                        onClick={(event) => handleDelete(event, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {sortedAndFiltered.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer transition-colors hover:border-indigo-300 dark:hover:border-indigo-700"
                onClick={() => navigate(`/analysis/${item.id}`)}
              >
                <CardContent className="p-4 flex justify-between items-center gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.resumeName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{item.jdTitle}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={getScoreColor(item.score)}>{item.score}%</Badge>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      title="Delete analysis"
                      aria-label={`Delete analysis ${item.id}`}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-500 dark:hover:bg-rose-950/50"
                      disabled={isDeleting}
                      onClick={(event) => handleDelete(event, item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
            <Clock className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">No history found</h3>
          <p className="mt-2 text-sm text-zinc-500 max-w-sm dark:text-zinc-400">
            {searchTerm ? "No analyses match your search criteria." : "You haven't run any analyses yet."}
          </p>
          {!searchTerm && (
            <Link to="/analysis" className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Start your first analysis &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
