"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import { GenerateTrackingNumber } from "../utils";

export async function GetOrders(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("orders")
      .select(`*, customer_id(id, name)`)
      .order("created_at", { ascending: false })
      .range((page - 1) * items_per_page, page * items_per_page - 1);

    const { data, error } = searchQuery
      ? await query.ilike("customer_id.name", `%${searchQuery}%`)
      : await query;

    if (error) {
      console.error(error);
      return [];
    }

    // filtering for search query foreign key
    const filteredData = data.filter((order) => order.customer_id !== null);

    return filteredData || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function CreateOrder(formData: FormData) {
  try {
    const supabase = createClient();
    const trackingNumber = GenerateTrackingNumber();

    // Add validation to ensure tracking number is unique
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("tracking_number")
      .eq("tracking_number", trackingNumber)
      .single();

    if (existingOrder) {
      // If duplicate found, generate a new one (recursive)
      return CreateOrder(formData);
    }

    const { error } = await supabase
      .from("orders")
      .insert({
        customer_id: formData.get("customer_id"),
        kilograms: formData.get("kilograms"),
        price: formData.get("price"),
        status: "ON PROCESS",
        tracking_number: trackingNumber,
      })
      .select();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/orders");
    return { error: "" };
  } catch (error) {
    return { error };
  }
}

export async function GetOrderById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return false;
    }
    return data;
  } catch (error) {
    return false;
  }
}

export async function UpdateOrder(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({
        status: formData.get("status"),
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error };
    }
    revalidatePath("/orders");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteOrder(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/orders");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalOrders() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("orders").select("*");

    if (error) {
      console.error(error);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function GetAllOrders() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select(`*, customer_id("*")`);

    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function TotalOnProcessOrders() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "ON PROCESS");

    if (error) {
      console.error(error);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function TotalPickUpOrders() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "READY FOR PICKUP");

    if (error) {
      console.error(error);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function TotalClaimedOrders() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "CLAIMED");

    if (error) {
      console.error(error);
      return 0;
    }
    return data.length || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function GetMyOrder(tracking_number: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("orders")
      .select(`*, customer_id(*)`)
      .eq("tracking_number", tracking_number)
      .single();

    if (error) {
      return { error: "No orders found." };
    }

    return data;
  } catch (error) {
    console.error(error);
    return { error: "Unexpected error while searching order." };
  }
}

export async function GetTodaysIncome() {
  try {
    const supabase = createClient();

    // Get the start and end of today in ISO format
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Query to get the sum of prices for today's orders
    const { data, error } = await supabase
      .from("orders")
      .select("price", { count: "exact" })
      .gte("created_at", startOfDay.toISOString()) // Start of today
      .lte("created_at", endOfDay.toISOString()); // End of today

    if (error) {
      console.error(error);
      return 0;
    }

    // Aggregate the total price
    const totalIncome = data.reduce(
      (sum, order) => sum + (order.price || 0),
      0
    );
    return totalIncome;
  } catch (error) {
    console.error(error);
    return 0;
  }
}
