import Link from "next/link";
import React from "react";

export default function AdminPage() {
  return (
    <main>
      <div>
        <h1>Admin Page</h1>
          <Link href="/admin/create">Create Post</Link>
      </div>
    </main>
  );
}
