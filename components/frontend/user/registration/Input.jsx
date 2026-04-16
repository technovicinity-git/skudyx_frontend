const Input = ({
  type = 'text',
  id,
  name,
  placeholder = '',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      className={`text-base text-[#222222] placeholder-[#62748E] bg-white px-3.5 py-3 outline-none border border-[#D0D5DD] focus:ring-[1.5px] focus:ring-primary-0 rounded-lg shadow-[0_1px_2px_0_#1018280D] transition-colors duration-300 ${className}`}
      {...props}
    />
  );
};

export default Input;
