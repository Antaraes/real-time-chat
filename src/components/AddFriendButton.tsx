"use client";

import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { FC, useState } from "react";
import Button from "./ui/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const mutation = useMutation<void, AxiosError, string>(
    // Configuration object with onSuccess and onError handlers
    {
      // Mutation function
      mutationFn: async (email: string) => {
        const validatedEmail = addFriendValidator.parse({ email });
        await axios.post("/api/friends/add", {
          email: validatedEmail,
        });
      },
      onSuccess: () => {
        setTimeout(() => setShowSuccessState(true), 3000);
        setShowSuccessState(false);
      },
      onError: (error: AxiosError) => {
        if (error instanceof z.ZodError) {
          setError("email", { message: error.message });
        } else if (error.response?.data) {
          setError("email", { message: error.response?.data });
        } else {
          setError("email", { message: "Something went wrong." });
        }
      },
    }
  );

  // onSubmit function
  const onSubmit = (data: FormData) => {
    mutation.mutate(data.email); // Trigger the mutation
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        Add friend by E-Mail
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button isLoading={mutation.isPending}>Add</Button>
      </div>

      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      ) : (
        <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      )}
    </form>
  );
};

export default AddFriendButton;
