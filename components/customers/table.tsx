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
import { GetCustomers, GetTotalCustomers } from "@/lib/actions/customers";
import { TablePagination } from "./pagination";
import UpdateButton from "./update-button";
import DeleteButton from "./delete-button";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";

export default async function CustomersTable({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page: number;
}) {
  const items_per_page = 7;

  const [totalCustomers, customers] = await Promise.all([
    GetTotalCustomers(),
    GetCustomers(searchQuery, page, items_per_page),
  ]);

  const totalPages = Math.ceil(totalCustomers / items_per_page);
  return (
    <Card className="w-full shadow-none bg-background">
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Manage customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="table-cell">Name</TableHead>
              <TableHead className="table-cell">Contact Number</TableHead>
              {/* <TableHead className="table-cell">Suki Status</TableHead> */}
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p className="font-semibold text-lg">{item.name}</p>
                </TableCell>
                <TableCell className="font-normal">
                  {item.contact_number}
                </TableCell>
                {/* <TableCell className="font-normal">
                  {item.suki ? (
                    <Badge variant="default">Suki</Badge>
                  ) : (
                    <Badge variant="outline">Not</Badge>
                  )}
                </TableCell> */}
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
          <strong>{(page - 1) * items_per_page + 1}</strong>-
          <strong>{Math.min(page * items_per_page, totalCustomers)}</strong> of{" "}
          <strong>{totalCustomers}</strong>
        </div>
        <div className="ml-auto">
          <TablePagination totalPages={totalPages} />
        </div>
      </CardFooter>
    </Card>
  );
}
