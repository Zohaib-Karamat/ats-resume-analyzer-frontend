import { useCallback, useMemo, useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import { useJobDescriptions } from "../hooks/useJobDescriptions";
import { SearchBar } from "../components/SearchBar";
import { JDCard } from "../components/JDCard";
import { JDFormModal } from "../components/JDFormModal";
import { Pagination } from "../../../components/ui/Pagination";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { QueryErrorState } from "../../../components/ui/States";

export function JobDescriptionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jdToEdit, setJdToEdit] = useState(null);
  const serverSearch = search.length >= 4 ? search : "";
  const queryLimit = search && search.length < 4 ? 100 : 5;

  // When search changes, reset to page 1
  const handleSearch = useCallback((term) => {
    setSearch(term.trim());
    setPage(1);
  }, []);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useJobDescriptions({
    search: serverSearch,
    page,
    limit: queryLimit,
    sort: "desc",
  });
  const searchTerm = search.toLowerCase();
  const jds = useMemo(() => {
    const items = data?.data || [];
    if (!searchTerm) return items;

    return items.filter((jd) => {
      const searchableText = [
        jd.title,
        jd.company,
        jd.content,
        jd.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [data?.data, searchTerm]);
  const meta = data?.meta || { totalPages: 1 };

  const handleOpenCreate = () => {
    setJdToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (jd) => {
    setJdToEdit(jd);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
            Job Descriptions
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage the job descriptions you want to tailor your resumes against.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Job Description
        </Button>
      </div>

      <div className="flex flex-col bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 flex-1">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <SearchBar onSearch={handleSearch} placeholder="Search by title or company..." />
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {isError ? (
            <QueryErrorState
              onRetry={refetch}
              message="We could not load your job descriptions from the server."
            />
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
            </div>
          ) : jds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {jds.map(jd => (
                <JDCard key={jd.id} jd={jd} onEdit={handleOpenEdit} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                <Briefcase className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">No job descriptions found</h3>
              <p className="mt-2 text-sm text-zinc-500 max-w-sm dark:text-zinc-400">
                {search ? "Try adjusting your search term." : "Get started by adding a job description you're interested in applying for."}
              </p>
              {!search && (
                <Button onClick={handleOpenCreate} variant="secondary" className="mt-6">
                  <Plus className="mr-2 h-4 w-4" /> Add your first JD
                </Button>
              )}
            </div>
          )}
        </div>

        {jds.length > 0 && !search && (
          <Pagination 
            currentPage={page} 
            totalPages={meta.totalPages} 
            onPageChange={setPage} 
          />
        )}
      </div>

      <JDFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        jdToEdit={jdToEdit} 
      />
    </div>
  );
}
