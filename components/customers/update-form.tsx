"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UpdateCustomer } from "@/lib/actions/customers";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";

export default function UpdateCustomerForm({ item }: { item: CustomersT }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!formData.get("name") || !formData.get("contact_number")) {
      toast.error("Please fill in all the required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await UpdateCustomer(formData);
      if (error) {
        toast.error(error.toString());
      }
      router.push("/customers");
    } catch (error) {
      toast.error("There was an unexpected error updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 mt-5 container max-w-screen-sm mx-auto">
        <div className="grid gap-2">
          <Label htmlFor="name">Service name</Label>
          <input
            name="id"
            id="id"
            type="text"
            placeholder=""
            required
            defaultValue={item.id}
            hidden
          />
          <Input
            name="name"
            id="name"
            type="text"
            placeholder=""
            required
            defaultValue={item.name}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Contact no.</Label>
          <Input
            name="contact_number"
            id="contact_number"
            type="text"
            placeholder=""
            required
            defaultValue={item.contact_number}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

export type CustomersT = Tables<"customers">;
