import CustomersTable from "@/components/customers/table";
import SearchBar from "@/components/search-bar";
import CreateDialog from "@/components/customers/create-dialog";
import { GetAllCustomers } from "@/lib/actions/customers";
import ExportToExcelButton from "@/components/customers/export-to-excel-button";

export default async function Customers({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const searchQuery = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const customers = await GetAllCustomers();

  return (
    <div className="container max-w-screen-md mx-auto">
      <h1 className="text-center text-2xl">Customers</h1>
      <div className="mt-5">
        <div className="flex items-center">
          <SearchBar />
          <div className="ml-auto flex items-center gap-2">
            <ExportToExcelButton customers={customers} />
            <CreateDialog />
          </div>
        </div>
        <div className="mt-2">
          <CustomersTable searchQuery={searchQuery} page={page} />
        </div>
      </div>
    </div>
  );
}
