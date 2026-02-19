//"use client"

//import { Button } from "@/components/ui/button";
//import { authClient } from "@/lib/auth-client";

//import {Button} from "@/components/ui/button";
//import prisma from "@/lib/db";
//import { useTRPC } from "@/trpc/client";
//import {caller, getQueryClient} from "@/trpc/server";
//import {useQuery} from "@tanstack/react-query";
//import{getQueryClient,trpc} from "@/trpc/server";
//import{Client} from "./client";
//import {dehydrate,HydrationBoundary} from "@tanstack/react-query";
//import {Suspense} from "react";
// const Page=async ()=>{
//const users=await prisma.user.findMany();
//const users=await caller.getUsers();
//const trpc=useTRPC();
//const {data:users}=useQuery(trpc.getUsers.queryOptions());
// const queryClient=getQueryClient();

//  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
//return(
//<div className="text-red-500 font-extrabold">
// <HydrationBoundary state={dehydrate(queryClient)}>
// <Suspense fallback={<p>loading</p>}>
//  <Client/>
//</ Suspense>
// </HydrationBoundary>


// </div>
// );
//};
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";
const Page = async () => {
  //const{data}=authClient.useSession()
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">

      protected server component
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      <LogoutButton />
    </div>
  );

};
export default Page;
