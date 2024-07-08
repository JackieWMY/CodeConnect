'use client'

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'

const Table = ({ title,description }:{ title:string; description:string}) => (
  <div className="flex flex-col items-start gap-2 xl:flex-row">
    <h1 className="text-base font-medium text-amber-900 lg:text-xl xl:min-w-32">{title}:</h1>
    <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">{description}</h1>
  </div>
)

const PersonalRoom = () => {
  const { user } = useUser();
  const lessonID = user?.id;
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter();

  const lessonLink = `${process.env.NEXT_PUBLIC_BASE_URL}/classroom/${lessonID}?personal=true`

  const { call } = useGetCallById(lessonID!); 

  const startRoom = async () => {
    if(!client || !user) return;

    if(!call){
      const newCall = client.call('default',lessonID!)
      
      await newCall.getOrCreate({
        data:{
            starts_at: new Date().toISOString(),
        }
      })
    }
    router.push(`/classroom/${lessonID}?personal=true`)
  }
  return (
    <section className="flex size-full flex-col gap-10 text-amber-900">
      <h1 className='text-3xl font-bold'>
        Personal Classroom
      </h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
      < Table title="Topic" description={`${user?.username}'s Classroom`}/>
      < Table title="Lesson ID" description={lessonID!}/>
      < Table title="Invite Link" description={lessonLink}/>
      </div>
      <div className="flex gap-5">
        <Button className="bg-dark-3 text-white hover:bg-orange-1 " onClick={startRoom}>
          Start Personal Lesson
        </Button>
        <Button className="bg-dark-1 text-white hover:bg-orange-1" onClick={()=>{
          navigator.clipboard.writeText(lessonLink);
          toast({
            title: "Link Copied",
          });
        }}>
          Copy Invitation Link
        </Button>
      </div>
    </section>
  )
}

export default PersonalRoom