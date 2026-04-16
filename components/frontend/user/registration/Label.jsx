const Label = ({ children, htmlFor, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-[#344054] text-sm font-semibold mb-2 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
