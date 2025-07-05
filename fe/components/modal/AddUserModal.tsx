"use client";

import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddUserModal({
  open,
  setOpen,
  state,
  children,
}: {
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  state: CreateUserParams;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>User Added Successfully</DialogTitle>
        </DialogHeader>
        <p>
          <span className="font-normal">Your username is: </span>&nbsp;{" "}
          <span className="font-bold">{state?.email}</span>
        </p>

        <p>
          <span className="font-normal">Your password is: </span>
          &nbsp; <span className="font-bold">{state?.password}</span>
        </p>

        <p>
          <span className="font-normal">Your phone number is: </span>
          &nbsp; <span className="font-bold">{state?.phone}</span>
        </p>

        <DialogFooter>
          <Button
            className="!hover:opacity-50 inline-flex w-full justify-center rounded-md border border-indigo-600 !bg-white px-3 py-2 text-center text-sm font-semibold !text-[#4F46E5] shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            onClick={() => setOpen && setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddUserModal };
