"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UpdateOrder } from "@/lib/actions/orders";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tables } from "@/database.types";

export default function UpdateOrderForm({ item }: { item: OrdersT }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!formData.get("status")) {
      toast.error("Please fill in all the required fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await UpdateOrder(formData);
      if (error) {
        toast.error(error.toString());
      }
      router.push("/orders");
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
          <Label htmlFor="name">Order Status</Label>
          <input
            name="id"
            id="id"
            type="text"
            placeholder=""
            required
            defaultValue={item.id}
            hidden
          />
          <Select name="status" defaultValue={item.status}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ON PROCESS">ON PROCESS</SelectItem>
                <SelectItem value="READY FOR PICKUP">
                  READY FOR PICKUP
                </SelectItem>
                <SelectItem value="CLAIMED">CLAIMED</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}

export type OrdersT = Tables<"orders">;
