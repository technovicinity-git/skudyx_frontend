const Label = ({ children, htmlFor = '', className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-black text-lg font-medium mb-1.5 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
