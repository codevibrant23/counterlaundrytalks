import { useCallback } from "react";

const usePrintJS = () => {
  const handlePrint = useCallback((htmlContent) => {
    if (typeof window === "undefined") {
      // Prevent execution on the server
      console.error("usePrintJS can only be used in the browser.");
      return Promise.reject(
        new Error("usePrintJS can only be used in the browser.")
      );
    }

    return new Promise((resolve, reject) => {
      try {
        // Dynamically import print-js to ensure it only loads in the browser
        import("print-js").then((printJS) => {
          printJS.default({
            printable: htmlContent,
            type: "raw-html",
            scanStyles: false,
          });

          // Resolve the promise after a slight delay to allow the print dialog to open
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  return handlePrint;
};

export default usePrintJS;
