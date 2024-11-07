"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function GetCustomers(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("customers")
      .select(`*`)
      .order("name", { ascending: true })
      .range((page - 1) * items_per_page, page * items_per_page - 1);

    const { data, error } = searchQuery
      ? await query.ilike("name", `%${searchQuery}%`)
      : await query;

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

export async function CreateCustomer(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .insert({
        name: formData.get("name"),
        contact_number: formData.get("contact_number"),
      })
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/customers");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetCustomerById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("customers")
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

export async function UpdateCustomer(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .update({
        name: formData.get("name"),
        contact_number: formData.get("contact_number"),
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error };
    }
    revalidatePath("/customers");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteCustomer(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/customers");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalCustomers() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("customers").select("*");

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

export async function GetAllCustomers() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error(error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
