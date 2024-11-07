import OrdersTable from "@/components/orders/table";
import SearchBar from "@/components/search-bar";
import CreateDialog from "@/components/orders/create-dialog";

export default function Orders({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const searchQuery = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="container max-w-screen-lg mx-auto">
      <h1 className="text-center text-2xl">Orders</h1>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <SearchBar />
          <CreateDialog />
        </div>
        <div className="mt-2">
          <OrdersTable searchQuery={searchQuery} page={page} />
        </div>
      </div>
    </div>
  );
}
