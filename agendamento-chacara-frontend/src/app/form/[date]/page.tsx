"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SchedulingService } from "@/services/SchedulingService";

const Form = () => {

  const params = useParams<{ date: string }>();
  const router = useRouter();


  const verifyDateStatus = async () => {
    const schedulingService = new SchedulingService()
    const schedulingExists = await schedulingService.getByDate(params.date)
    schedulingExists.forEach((scheduling)=>{
        if(scheduling.status===true){
            router.push("/reservation");
        }
        return
    })
  }

  useEffect(() => {
    if (params.date === "undefined") {
      router.push("/reservation");
    }  
    verifyDateStatus()
  });



  return <p>{params.date}</p>;
};

export default Form;
