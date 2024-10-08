"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiRespone";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { messageValidationSchema } from "@/schemas/messageSchema";
import { Textarea } from "@/components/ui/textarea";
import QuestionPage from "@/components/QuestionPage";

export default function page() {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [userMaessage, setUserMassage] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const { toast } = useToast();
  const params = useParams<{ username: string }>();
  //zod implementation
  const form = useForm<z.infer<typeof messageValidationSchema>>({
    resolver: zodResolver(messageValidationSchema),
    defaultValues: {
      content: "",
    },
  });

  const getUserMessage = async () => {
    try {
      const response = await axios.post("/api/suggest-messages", {
        prompt: userMaessage?.toString() || "",
      });
      setResponseMessage(response.data.response);
      console.log(response.data.response);
    } catch (error) {
      console.error("Error in fetching user message ", error);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageValidationSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setIsSubmit(false);
    } catch (error) {
      console.error("Error in sending meassage to user ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMassage = axiosError.response?.data.message;
      toast({
        title: "Failed to send message",
        description: errorMassage,
        variant: "destructive",
      });
      setIsSubmit(false);
    }finally{
      setUserMassage("")
      setResponseMessage("")
    }
  };
  return (
    <div className=" flex justify-center min-h-screen bg-gray-200 ">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg">
        <div className="">
          <h1 className="lg:text-4xl text-center font-extrabold">
            Public Profile Link
          </h1>
        </div>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="">
                    <p className=" text-sm font-bold">
                      Send Anonymous Message to @{params.username}
                    </p>
                    <FormControl>
                      <Textarea
                        className="input input-bordered w-full p-2 mr-2 resize-none "
                        placeholder="message"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          setUserMassage(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-center">
                <Button
                  className=""
                  type="submit"
                  onClick={getUserMessage}
                  disabled={isSubmit}
                >
                  {isSubmit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="">
          <QuestionPage messageString={responseMessage} />
        </div>
      </div>
    </div>
  );
}
