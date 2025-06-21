"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import {
  createAppointment,
  updateAppointment,
} from "@/lib/api/appointment.actions";
import { AppointmentFormSchema } from "@/lib/validations/appointment.schema";
import "react-datepicker/dist/react-datepicker.css";

type AppointmentFormInputs = z.infer<typeof AppointmentFormSchema>;

type AppointmentFormProps = {
  defaultValues?: Partial<AppointmentFormInputs>;
  onSuccess?: () => void;
  mode: "create" | "edit";
  appointmentId?: number;
};

const appointmentStatusOptions = [
  "Booked",
  "Pending",
  "Examined",
  "Cancelled", // TODO: maybe need this for BE
];

export default function AppointmentForm({
  defaultValues,
  mode,
  onSuccess,
  appointmentId,
}: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AppointmentFormInputs>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      doctorId: defaultValues?.doctorId || 0,
      bookByUserId: defaultValues?.bookByUserId || 0,
      startTime: defaultValues?.startTime || new Date(),
      endTime: defaultValues?.endTime || new Date(),
      price: defaultValues?.price,
      appointmentStatus: defaultValues?.appointmentStatus || "Pending",
      medicalHistoryId: defaultValues?.medicalHistoryId,
    },
  });

  const onSubmit = async (values: AppointmentFormInputs) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("DoctorId", String(values.doctorId));
      formData.append("BookByUserId", String(values.bookByUserId));
      formData.append("StartTime", values.startTime.toISOString());
      formData.append("EndTime", values.endTime.toISOString());
      if (values.price !== undefined)
        formData.append("Price", String(values.price));
      formData.append("AppointmentStatus", values.appointmentStatus);
      if (values.medicalHistoryId !== undefined)
        formData.append("MedicalHistoryId", String(values.medicalHistoryId));

      if (mode === "create") {
        await createAppointment(formData);
      } else {
        await updateAppointment(appointmentId!, formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div>
        <label>Doctor ID</label>
        <input {...register("doctorId", { required: true })} type="number" />
        {errors.doctorId && <p className="text-red-500">Required</p>}
      </div>

      <div>
        <label>Booked By (User ID)</label>
        <input
          {...register("bookByUserId", { required: true })}
          type="number"
        />
        {errors.bookByUserId && <p className="text-red-500">Required</p>}
      </div>

      <div>
        <label>Start Time</label>
        <Controller
          control={control}
          name="startTime"
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              showTimeSelect
              dateFormat="Pp"
            />
          )}
        />
      </div>

      <div>
        <label>End Time</label>
        <Controller
          control={control}
          name="endTime"
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              showTimeSelect
              dateFormat="Pp"
            />
          )}
        />
        {errors.endTime && <p className="text-red-500">Required</p>}
      </div>

      <div>
        <label>Price (optional)</label>
        <input {...register("price")} type="number" step="0.01" />
      </div>

      <div>
        <label>Status</label>
        <select {...register("appointmentStatus", { required: true })}>
          {appointmentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.appointmentStatus && <p className="text-red-500">Required</p>}
      </div>

      <div>
        <label>Medical History ID (optional)</label>
        <input {...register("medicalHistoryId")} type="number" />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {isLoading
          ? "Saving..."
          : mode === "create"
            ? "Create Appointment"
            : "Update Appointment"}
      </button>
    </form>
  );
}
