"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


import { Form } from "@/components/ui/form";
import { login } from "@/lib/api/patient.actions";
import { UserLoginValidation } from "@/lib/validation";

import CustomFormField, { FormFieldType } from "../../CustomFormField";
import SubmitButton from "../../SubmitButton";

import "react-phone-number-input/style.css";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  const form = useForm<z.infer<typeof UserLoginValidation>>({
    resolver: zodResolver(UserLoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserLoginValidation>) => {
    setIsLoading(true);

    try {
      const credentials = {
        email: values.email,
        password: values.password,
      };

      // TODO: change this to login endpoint to get cookie
      const loginUser = await login(credentials);
      console.log({
        loginUser,
      });

      if (loginUser) {
        router.replace("/admin");
        return true;
      }
    } catch (error) {
      console.log(error);
      // router.push("/register");
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Please login first.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

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

        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  );
}
