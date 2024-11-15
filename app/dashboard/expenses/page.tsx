import ExpensesTable from "@/components/expenses/table";
import SearchBar from "@/components/search-bar";
import CreateDialog from "@/components/expenses/create-dialog";

export default function Expneses({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="container max-w-screen-md mx-auto">
      <h1 className="text-center text-2xl">Expenses</h1>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <SearchBar />

          <CreateDialog />
        </div>
        <div className="mt-2">
          <ExpensesTable page={page} />
        </div>
      </div>
    </div>
  );
}
