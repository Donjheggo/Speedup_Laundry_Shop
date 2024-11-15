import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrders, GetTotalOrders } from "@/lib/actions/orders";
import { TablePagination } from "./pagination";
import UpdateButton from "./update-button";
import DeleteButton from "./delete-button";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import GenerateReceiptButton from "./generate-receipt-button";

export default async function OrdersTable({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page: number;
}) {
  const items_per_page = 7;

  const [totalOrders, orders] = await Promise.all([
    GetTotalOrders(),
    GetOrders(searchQuery, page, items_per_page),
  ]);

  console.log(orders);

  const totalPages = Math.ceil(totalOrders / items_per_page);
  return (
    <Card className="w-full shadow-none bg-background">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Manage orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="table-cell">Customer</TableHead>
              <TableHead className="table-cell">Kilograms</TableHead>
              <TableHead className="table-cell">Price</TableHead>
              <TableHead className="table-cell">Tracking No.</TableHead>
              <TableHead className="table-cell">Status</TableHead>
              <TableHead className="table-cell">Receipt</TableHead>
              <TableHead className="table-cell">Created At</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p className="font-semibold text-lg">
                    {item.customer_id.name}
                  </p>
                </TableCell>
                <TableCell className="font-normal">
                  {item.kilograms} kg
                </TableCell>
                <TableCell className="font-normal">₱{item.price}</TableCell>
                <TableCell className="font-normal">
                  {item.tracking_number}
                </TableCell>
                <TableCell className="font-normal">
                  <Badge variant="outline">{item.status}</Badge>
                </TableCell>
                <TableCell className="font-normal">
                  <GenerateReceiptButton orders={item} />
                </TableCell>
                <TableCell className="font-normal">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <UpdateButton id={item.id} />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <DeleteButton id={item.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{(page - 1) * items_per_page + 1}</strong>-
          <strong>{Math.min(page * items_per_page, totalOrders)}</strong> of{" "}
          <strong>{totalOrders}</strong> orders
        </div>
        <div className="ml-auto">
          <TablePagination totalPages={totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
