import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrders } from "@/lib/actions/orders";
import Link from "next/link";
import { Button } from "../ui/button";
import { MoveUpRight } from "lucide-react";
import { Badge } from "../ui/badge";

export default async function OrdersTable({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page: number;
}) {
  const items_per_page = 7;

  const [orders] = await Promise.all([
    GetOrders(searchQuery, page, items_per_page),
  ]);

  console.log(orders);

  return (
    <Card className="w-full shadow-none bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Orders</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="outline" className="flex items-center">
              View More
              <MoveUpRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
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
              <TableHead className="table-cell">Created At</TableHead>
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
                <TableCell className="font-normal">{item.tracking_number}</TableCell>
                <TableCell className="font-normal">
                  <Badge>{item.status}</Badge>
                </TableCell>
                <TableCell className="font-normal">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
