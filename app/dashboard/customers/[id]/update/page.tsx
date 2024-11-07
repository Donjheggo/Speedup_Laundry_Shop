import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UpdateCustomerForm from "@/components/customers/update-form";
import { GetCustomerById } from "@/lib/actions/customers";

export default async function UpdateCustomer({
  params,
}: {
  params: { id: string };
}) {
  const event = await GetCustomerById(params.id);

  return (
    <div>
      <Link href="../" className="flex gap-2 hover:underline">
        <ArrowLeft />
        Back
      </Link>
      <h1 className="text-center text-2xl">Update</h1>
      <div className="mt-5">
        <UpdateCustomerForm item={event} />
      </div>
    </div>
  );
}
