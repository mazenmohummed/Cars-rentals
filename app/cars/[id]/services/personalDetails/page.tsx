"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemTitle } from "@/components/ui/item";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function PersonalDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;

  // 1. Local state for form fields
  const [formData, setFormData] = useState({
    telephone: "",
    street: "",
    status: "",
    city: "",
    zip: "",
    flightNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Build the final URL object for the Link
  // We spread the existing searchParams to keep from, to, pickup, return, mileage, and services
  const query = {
    ...Object.fromEntries(searchParams.entries()),
    ...formData,
  };

  return (
    <main className="p-6 flex flex-wrap justify-center w-full">
      <div className="flex-wrap items-center px-6 max-w-2xl w-full">
        <ItemTitle className="mx-auto my-6 text-3xl text-center">
          Personal Information
        </ItemTitle>

        <Input
          name="telephone"
          type="tel"
          placeholder="Telephone No"
          className="mt-4"
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <Input name="street" placeholder="Street" onChange={handleChange} />
          <Input name="status" placeholder="State/Province" onChange={handleChange} />
          <Input name="city" placeholder="City" onChange={handleChange} />
          <Input name="zip" placeholder="Zip Code" onChange={handleChange} />
        </div>

        <Input
          name="flightNumber"
          placeholder="Flight Number (Optional)"
          className="mt-4"
          onChange={handleChange}
        />

        {/* 3. Pass everything to the confirmation page */}
        <Link
          className="flex mx-auto items-center my-6"
          href={{
            pathname: `/cars/${id}/services/personalDetails/confirme`,
            query: query,
          }}
        >
          <Button
            className="flex mx-auto items-center w-40 my-6"
            disabled={!formData.telephone || !formData.city}
          >
            Next
          </Button>
        </Link>
      </div>
    </main>
  );
}