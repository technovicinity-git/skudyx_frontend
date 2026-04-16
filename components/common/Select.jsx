const Select = ({ children, id, name, className = "", ...props }) => {
  return (
    <select
      id={id}
      name={name}
      className={`text-base text-[#222222] bg-white px-3.5 py-3 outline-none border border-[#D0D5DD] focus:ring-[1.5px] focus:ring-primary-0 rounded-lg shadow-[0_1px_2px_0_#1018280D] transition-colors duration-300 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
