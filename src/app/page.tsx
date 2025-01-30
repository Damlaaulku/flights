"use client";

import { Header } from "@/components/header/header";
import SearchForm from "@/components/search-form/search-form";

export default function Home() {
  return (
    <div style={{ height: "100%" }}>
      <Header />
      <SearchForm />
    </div>
  );
}
