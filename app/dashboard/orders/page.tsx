import OrdersTable from "@/components/orders/table";
import SearchBar from "@/components/search-bar";
import CreateDialog from "@/components/orders/create-dialog";
import ExportToExcelButton from "@/components/orders/export-to-excel-button";
import { GetAllOrders } from "@/lib/actions/orders";

export default async function Orders({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const searchQuery = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;
  const orders = await GetAllOrders();

  return (
    <div className="container max-w-screen-lg mx-auto">
      <h1 className="text-center text-2xl">Orders</h1>
      <div className="mt-5">
        <div className="flex items-center">
          <SearchBar />
          <div className="ml-auto flex items-center gap-2">
            <ExportToExcelButton orders={orders} />
            <CreateDialog />
          </div>
        </div>
        <div className="mt-2">
          <OrdersTable searchQuery={searchQuery} page={page} />
        </div>
      </div>
    </div>
  );
}
