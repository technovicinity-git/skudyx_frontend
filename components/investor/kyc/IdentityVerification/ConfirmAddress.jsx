import Input from "@/components/common/Input";
import Label from "@/components/common/Label";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import Image from "next/image";
import { useCreateAddress, useGetAddressById } from "@/hook/address";
import { useState } from "react";
import { countries } from "@/utils/country";
import { useGetMyProfile } from "@/hook/user";

const ConfirmAddress = ({ setCurrentStep }) => {
  const [error, setError] = useState(null);

  const { profile } = useGetMyProfile();
  const { address } = useGetAddressById(profile?._id);

  // const { address } = useGetAddress();

  const { createAddress, isLoading, errorMessage } = useCreateAddress({
    onSuccess: () => {
      setCurrentStep(4);
    },
    onError: () => {
      setError(errorMessage || "An error occurred while creating the address.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      street_address: formData.get("street-address"),
      city: formData.get("city"),
      state_province: formData.get("city-province"),
      postal_code: formData.get("postal-code"),
      country: formData.get("country"),
    };
    createAddress(addressData);
  };

  return (
    <div className="w-full">
      <Image
        src="/assets/icons/address-icon.png"
        alt="img"
        width={48}
        height={48}
        className="size-12 rounded-full mb-6"
      />
      <h2 className="text-[#101828] text-2xl font-semibold mb-2">
        Confirm your address
      </h2>
      <p className="text-[#57585B] mb-8">
        Please provide your current residential address. This helps us verify
        your identity and improve account security.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
        {/* Street Address */}
        <div className="flex flex-col">
          <Label htmlFor="street-address">Street Address</Label>
          <Input
            type="text"
            id="street-address"
            name="street-address"
            placeholder="Street Address"
            required
          />
        </div>

        {/* City & State/Province */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* City */}
          <div className="flex flex-col">
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              placeholder="City Name"
              required
            />
          </div>
          {/* State/Province */}
          <div className="flex flex-col">
            <Label htmlFor="city-province">State/Province</Label>
            <Input
              type="text"
              id="city-province"
              name="city-province"
              placeholder="State/Province"
              required
            />
          </div>
        </div>

        {/* Postal Code */}
        <div className="flex flex-col">
          <Label htmlFor="postal-code">Postal Code</Label>
          <Input
            type="number"
            id="postal-code"
            name="postal-code"
            placeholder="Postal Code"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="country">Country</Label>
          <Select id="country" name="country" defaultValue="" required>
            <option value="" disabled>
              Select Country
            </option>
            {countries.map((country, idx) => (
              <option key={idx} value={country.name.toLowerCase()}>
                {country.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 p-2 bg-red-100 border border-red-400 text-sm mt-2">
            Error creating address: {error}
          </p>
        )}

        {/* Next Button */}
        <Button
          variant="solid"
          type="submit"
          className={`w-full mt-6`}
          disabled={isLoading}
        >
          {isLoading ? "Creating Address..." : "Next"}
        </Button>
      </form>
      <div className="flex justify-between items-center my-3 gap-2">
        <div className=" text-xl text-green-800">
          Already set up an address?{" "}
        </div>
        <Button variant="outline" href={"/investor"}>
          Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ConfirmAddress;
