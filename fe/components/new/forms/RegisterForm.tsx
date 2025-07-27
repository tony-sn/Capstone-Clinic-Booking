"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/lib/api/patient.actions";
import { UserSignupValidation } from "@/lib/validation";

import CustomFormField, { FormFieldType } from "../../CustomFormField";
import SubmitButton from "../../SubmitButton";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  const form = useForm<z.infer<typeof UserSignupValidation>>({
    resolver: zodResolver(UserSignupValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserSignupValidation>) => {
    setIsLoading(true);

    try {
      const patient = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const newPatient = await register(patient);
      if (!newPatient) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Something went wrong, please try again later",
        });
      }

      if (newPatient) {
        toast({
          title: "Success",
          description: "Patient registered successfully",
        });
        form.reset();
        router.push(`/patients/${newPatient.id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          {/* FIRST & LAST NAME */}

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="firstName"
            label="First name"
            placeholder="John"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="lastName"
            label="Last name"
            placeholder="Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          {/* EMAIL */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email address"
              placeholder="johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            label="Password"
            placeholder="password"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            Icon={passwordShown ? Eye : EyeOff}
            type={passwordShown ? "text" : "password"}
            onClick={togglePasswordVisibility}
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
