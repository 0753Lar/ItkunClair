import Loader from "@/components/icons/Loading";
export default function Loading() {
  return (
    <html lang="en">
      <body>
        <div
          role="status"
          className="h-[100vh] w-full flex items-center justify-center"
        >
          <Loader />
          <span className="sr-only">Loading...</span>
        </div>
      </body>
    </html>
  );
}
