import SearchBar from "@/components/orders/search-bar";
import OrderCard from "@/components/orders/order-card";
import { BackgroundBeamsWithCollision } from "@/components/ui/trackpage-background";
import Image from "next/image";
import logo from "@/app/favicon.ico";

export default function TrackPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const searchQuery = searchParams?.query || "";

  return (
    <BackgroundBeamsWithCollision>
      <div className="container max-w-screen-sm mx-auto p-5 flex flex-col justify-center gap-4">
        <div className="w-full flex justify-center">
          <Image src={logo} alt="Image" width="100" height="100" />
        </div>
        <h1 className="text-center text-primary text-4xl font-semibold">
          Speed up Laundry Shop
        </h1>
        <h1 className="text-center text-primary text-2xl mb-5">
          Track Your Laundry
        </h1>
        <SearchBar />
        {searchQuery && <OrderCard searchQuery={searchQuery} />}
      </div>
    </BackgroundBeamsWithCollision>
  );
}
