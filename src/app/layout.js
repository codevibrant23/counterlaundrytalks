import ProtectedComponent from "@/utils/ProtectedComponent";
import "./globals.css";
import Providers from "./Providers";
import { CustomerFormProvider } from "@/utils/CustomerFormContext";

export const metadata = {
  title: "Laundry Talks",
  description: "Counter App | Laundry Talks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
          <CustomerFormProvider>
            <Providers>{children}</Providers>
          </CustomerFormProvider>
        <div className="absolute right-2 bottom-0">
          <span className="text-gray-600 text-sm">Powered by</span> Vibrant
          Digitech
        </div>
      </body>
    </html>
  );
}
