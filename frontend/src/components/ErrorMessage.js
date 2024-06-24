const ErrorMessage = ({ message, className }) => {
  return (
    <div
      className={`w-full text-center rounded-lg text-gray-900 bg-red-400 mx-auto px-4 py-2 max-w-md ${className}`}
    >
      <p>{message}</p>
    </div>
  );
};
export default ErrorMessage;
