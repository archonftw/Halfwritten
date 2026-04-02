import Welcome from "../PrivComponents/Welcome";
import DBconnect from "@/lib/db";

export default async function Page() {
  await DBconnect(); // ✅ await the DB connection

  return (
    <>
      <Welcome />
    </>
  );
}