"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function GetExpenses(page: number, items_per_page: number) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("expenses")
      .select(`*`)
      .order("created_at", { ascending: true })
      .range((page - 1) * items_per_page, page * items_per_page - 1);

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

export async function CreateExpenses(formData: FormData) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("expenses")
      .insert({
        amount: formData.get("amount"),
        date: formData.get("date"),
      })
      .select();

    if (error) {
      return { error: error.message };
    }
    revalidatePath("/dashboard/expenses");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetExpensesById(id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("expenses")
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

export async function DeleteExpenses(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      return { error: error };
    }
    revalidatePath("/dashboard/expenses");
    return { error: "" };
  } catch (error) {
    return { error: error };
  }
}

export async function GetTotalExpenses() {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.from("expenses").select("*");

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
