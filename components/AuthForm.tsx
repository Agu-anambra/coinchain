"use client";
import {
  DefaultValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props<T extends FieldValues> {
  schema: ZodType<T, any, T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log('"🚀 SUBMITTING"',data)
  setIsSubmitting(true);
    const result = await onSubmit(data);
    
console.log("Result from server:",result); // 👈 log error if it fails
  setIsSubmitting(false);
    if (result.success) {
      toast.success("Success", { description: isSignIn ? "You have signed in successfully!" : "You have successfully signed up!" })
      
      router.push("/");
      return;
    } else {
      // toast.error(result.error || "An error occurred. Please try again.");
      toast.error(`Error ${isSignIn ? "Signing In": "signing up!"}`, { description: result.error ?? "An error occurred. Please try again."})
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          <h1 className="text-2xl font-semibold text-white">
            {isSignIn
              ? "Welcome to CoinChain"
              : "Create an Account on CoinChain"}
          </h1>
          <p className="text-light-100">
            {isSignIn
              ? "Access the vast world of cryptocurrencies and blockchain technology with CoinChain."
              : "Please fill in the details below to create your account on CoinChain. Join us today!"}
          </p>

          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "IDCard" ? (
                      <ImageUpload onFileChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        className="form-input"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="form-btn cursor-pointer">
            {/* {isSignIn ? "Sign In" : "Sign Up"} */}
            {isSubmitting ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-base font-medium">
        {isSignIn ? "New to CoinChain? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-primary font-bold"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
