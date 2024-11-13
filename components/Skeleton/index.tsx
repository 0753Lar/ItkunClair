export default function Skeleton() {
  return (
    <div role="status">
      <div
        className="rounded-md  w-full h-40
      bg-gradient-to-r from-pink-300/70 via-90% via-red-300/60 to-pink-300/70 bg-wiggle
      "
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
