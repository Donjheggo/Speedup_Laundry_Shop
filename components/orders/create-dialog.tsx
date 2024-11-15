"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { CreateOrder } from "@/lib/actions/orders";
import { toast } from "react-toastify";
import { Tables } from "@/database.types";
import { useState, useEffect } from "react";
import { GetAllCustomers } from "@/lib/actions/customers";
export type CustomersT = Tables<"customers">;

export default function CreateDialog() {
  const [customers, setCustomers] = useState<CustomersT[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await GetAllCustomers();
      if (data) setCustomers(data);
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (
      !formData.get("customer_id") ||
      !formData.get("kilograms") ||
      !formData.get("laundry_type")
    ) {
      toast.error("Please fill in all the required fields correctly.");
      return;
    }

    try {
      const { error } = await CreateOrder(formData);
      if (error) {
        toast.error(error.toString());
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an unexpected error creating the order.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center">
          <Plus size={18} className="mr-2" /> New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              Complete the fields and hit create.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer_id" className="text-right">
                Customer
              </Label>
              <div className="col-span-3">
                <Select name="customer_id">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {customers?.map((item, index) => (
                        <SelectItem key={index} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kilograms" className="text-right">
                Kilograms
              </Label>
              <Input
                name="kilograms"
                id="kilograms"
                type="number"
                placeholder=""
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="laundry_type" className="text-right">
                Laundry Type
              </Label>
              <div className="col-span-3">
                <Select name="laundry_type">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Laundry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {laundry_types?.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Create</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const laundry_types = ["BEDDINGS", "TOWELS", "SHIRTS", "PANTS", "ASSORTED"];
