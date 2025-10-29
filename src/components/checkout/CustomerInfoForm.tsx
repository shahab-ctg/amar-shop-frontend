"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

//  Validation Schema (aligned with backend DTO)
const CustomerSchema = z.object({
  name: z.string().min(2, "Full name is required"),

  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "Enter a valid Bangladeshi number (01XXXXXXXXX)"),
  houseOrVillage: z.string().min(2, "Please enter your house/village"),
  roadOrPostOffice: z.string().min(2, "Please enter your road/post office"),
  blockOrThana: z.string().min(2, "Please enter your block/thana"),
  district: z.string().min(2, "Please enter your district name"),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;

interface Props {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function CustomerInfoForm({ onSubmit, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
  });

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      await onSubmit(data);
      toast.success("Order submitted successfully!");
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors 
     ${
       hasError
         ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
         : "border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
     }`;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 sm:space-y-5"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
         
          <input
            type="text"
            {...register("name")}
            placeholder="Enter your full name"
            className={inputClass(!!errors.name)}
            autoComplete="name"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name.message}
          </p>
        )}
      </div>

     

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          {/* <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
          <input
            type="tel"
            {...register("phone")}
            placeholder="01XXXXXXXXX"
            className={inputClass(!!errors.phone)}
            autoComplete="tel"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Address Fields Group */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* House/Village */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House / Village <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("houseOrVillage")}
            placeholder="e.g. Uttara, Mirpur"
            className={inputClass(!!errors.houseOrVillage)}
          />
          {errors.houseOrVillage && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.houseOrVillage.message}
            </p>
          )}
        </div>

        {/* Road / Post Office */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Road / Post Office <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("roadOrPostOffice")}
            placeholder="e.g. Road 12, Banani Post"
            className={inputClass(!!errors.roadOrPostOffice)}
          />
          {errors.roadOrPostOffice && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.roadOrPostOffice.message}
            </p>
          )}
        </div>

        {/* Block / Thana */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Block / Thana <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("blockOrThana")}
            placeholder="e.g. Block C, Dhanmondi"
            className={inputClass(!!errors.blockOrThana)}
          />
          {errors.blockOrThana && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.blockOrThana.message}
            </p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("district")}
            placeholder="e.g. Dhaka, Chattogram"
            className={inputClass(!!errors.district)}
          />
          {errors.district && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full py-3.5 sm:py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#167389] to-[#167389] hover:from-cyan-500 hover:to-cyan-600"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Place Order
          </>
        )}
      </motion.button>
    </form>
  );
}
