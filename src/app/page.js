import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
  
  if (accessToken) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
};

export default page;
