"use client"

import Classroom from '@/components/Classroom';
import LessonSetup from '@/components/LessonSetup';
import Loader from '@/components/Loader';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState } from 'react';

const ClassRoom = ({ params:{id} }: { params: { id: string } }) => {

  const { user, isLoaded} = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false)

  const { call, isCallLoading } = useGetCallById(id);

  if(!isLoaded || isCallLoading) return <Loader />

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <LessonSetup setIsSetupComplete={setIsSetupComplete}/>
          ):(
            <Classroom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default ClassRoom