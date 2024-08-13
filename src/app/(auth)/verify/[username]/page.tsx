"use client"
import { FormControl, FormDescription, FormField, FormItem, FormMessage,FormLabel, Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiRespone";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React from "react";
import {  useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";

function page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      if (!response) {
        return { message: "error in verification" };
      }
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace("sign-in");
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMassage = axiosError.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMassage,
        variant: "destructive",
      });
    }
  };
  return <div className="flex justify-center items-center  min-h-screen bg-gray-400">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Verify Your Account
      </h1>
      <p className="mb-4">
        Enter the verification code sent to your Email
      </p>
      <div className="">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  </div>;
}

export default page;
