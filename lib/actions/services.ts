"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function GetServices(
  searchQuery: string,
  page: number,
  items_per_page: number
) {
  try {
    const supabase = createClient();
    const query = supabase
      .from("services")
      .select("*")
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

export async function CreateService(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("services")
      .insert({
        name: formData.get("name"),
        price: formData.get("price"),
      })
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/services");
    revalidatePath("/dashboard/services");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetServicesById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("services")
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

export async function UpdateService(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("services")
      .update({
        name: formData.get("name"),
        price: formData.get("price"),
      })
      .eq("id", formData.get("id"))
      .select();

    if (error) {
      return { error: error };
    }
    revalidatePath("/services");
    revalidatePath("/dashboard/services");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function DeleteService(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/services");
    revalidatePath("/dashboard/services");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalServices() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("services").select("*");

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

export async function GetAllServices() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("services").select("*");

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
