"use client";
import Link from "next/link";
import "@/css/NotFound.css";
import Navbar from "./components/Navbar";

export default function notFound() {
  return (
    <>
      <Navbar />
      <div className="not-found">
        <h1>404</h1>
        <h2>Oops looks like this page does not exist</h2>
        <Link href={`/`}>Back to Homepage</Link>
      </div>
    </>
  );
}
