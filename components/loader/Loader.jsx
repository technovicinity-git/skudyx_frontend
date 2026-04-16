export default function Loader({
  size = 48, // default size in px
  color = "border-primary-1",
  bgColor = "border-gray-200",
  speed = "animate-spin",
  fullScreen = false,
  label = "",
}) {
  const wrapperClasses = fullScreen
    ? "flex flex-col items-center justify-center min-h-screen"
    : "flex flex-col items-center justify-center";

  return (
    <div className={wrapperClasses}>
      <div
        className={`${speed} rounded-full border-4 ${color} border-t-transparent ${bgColor}`}
        style={{ width: size, height: size }}
      />
      <div>
        {label && (
          <span className="ml-3 text-gray-600 text-sm font-medium">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
