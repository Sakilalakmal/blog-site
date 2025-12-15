"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUpSchema } from "@/schemas/auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up Page</CardTitle>
        <CardDescription>Create a account for browse blogs</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>your name</FieldLabel>
                  <Input placeholder="enter your full name" {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]}/>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
