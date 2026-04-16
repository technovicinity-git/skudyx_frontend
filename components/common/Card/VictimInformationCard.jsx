import { EditIcon } from "@/public/assets/icons/icons";
import Button from "../Button";
import ProfileAvatar from "../ImageViewer/ProfileAvatar";
import AgentStatus from "../status/AgentStatus";

export default function VictimInformationCard({
  title,
  name,
  status,
  userCode,
  email,
  phone,
  address,
  image,
  onEdit,
  action,
}) {
  return (
    <div className="bg-white  w-full rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-[17px]">{title}</h2>

        {action ? (
          action
        ) : onEdit ? (
          <Button onClick={onEdit} variant="outline" className="flex gap-2">
            <span> {EditIcon}</span>
            Edit
          </Button>
        ) : null}
      </div>

      {/* Profile Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
        <ProfileAvatar src={image} size={64} />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[16px] text-gray-900">
              {name}
            </span>

            {status && <AgentStatus status={status} />}
          </div>

          {userCode && (
            <div className="text-[14px] text-gray-700 font-semibold">
              {userCode}
            </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="flex flex-col gap-4 mt-6 text-sm">
        <div>
          <div className="text-gray-500 text-[12px] font-semibold">Email</div>
          <div className="font-medium text-gray-700 text-[14px] underline">
            {email}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-[12px] font-semibold">Phone</div>
          <div className="font-medium text-gray-700 text-[14px] underline">
            {phone}
          </div>
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
