import { redirect } from "next/navigation";

const page = async () => {
  redirect("/dashboard");
};

export default page;
