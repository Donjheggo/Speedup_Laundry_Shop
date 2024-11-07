import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WashingMachine } from "lucide-react";
import { GetMyOrder } from "@/lib/actions/orders";
import { Badge } from "../ui/badge";

export default async function OrderCard({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const order = await GetMyOrder(searchQuery);

  if (order.error) {
    return <div> {order.error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <WashingMachine className="w-8 h-8 text-primary" />
        <div>
          <CardTitle>{order.customer_id.name}</CardTitle>
          <CardDescription>
            {new Date(order.created_at).toDateString()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div>Tracking number: {order.tracking_number}</div>
        <div>Kilograms: {order.kilograms}kg</div>
        <div>Price: ₱{order.price}</div>
        <div>
          Status: <Badge> {order.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
