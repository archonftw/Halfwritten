import Welcome from "../PrivComponents/Welcome";
import DBconnect from "@/lib/db";

export default async function Page() {
  await DBconnect(); // DB connecting function

  return (
    <>
      <Welcome />
    </>
  );
}