export default function EmergencyContactCard({
  name,
  relation,
  email,
  phone,
  address,
}) {
  return (
    <div className="bg-white w-full  rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 className="font-semibold text-gray-800 text-[17px]">
        Emergency Contact
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div>
          <div className="text-gray-500 text-[12px] font-semibold">Name</div>
          <div className="font-semibold text-gray-700 break-words">{name}</div>
        </div>

        <div>
          <div className="text-gray-500 text-[12px] font-semibold">
            Relation
          </div>
          <div className="font-semibold text-gray-700 break-words">
            {relation}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6 text-sm">
        <div>
          <div className="text-gray-500 text-[12px] font-semibold">Email</div>
          <div className="font-semibold text-gray-700 underline">{email}</div>
        </div>

        <div>
          <div className="text-gray-500 text-[12px] font-semibold">Phone</div>
          <div className="font-semibold text-gray-700 underline">{phone}</div>
        </div>
        <div>
          <div className="text-gray-500 text-[12px] font-semibold">Address</div>
          <div className="font-medium text-gray-700 text-[14px]">
            {address || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
