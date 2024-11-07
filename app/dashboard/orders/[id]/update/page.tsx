import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UpdateOrderForm from "@/components/orders/update-form";
import { GetOrderById } from "@/lib/actions/orders";


export default async function UpdateCustomer({
  params,
}: {
  params: { id: string };
}) {
  const event = await GetOrderById(params.id);

  return (
    <div>
      <Link href="../" className="flex gap-2 hover:underline">
        <ArrowLeft />
        Back
      </Link>
      <h1 className="text-center text-2xl">Update</h1>
      <div className="mt-5">
        <UpdateOrderForm item={event} />
      </div>
    </div>
  );
}
