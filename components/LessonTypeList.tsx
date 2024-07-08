"use client"
import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import LessonModal from './LessonModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';



const LessonTypeList = () => {
    const router = useRouter();
    const [lessonState, setLessonState] = useState<" isScheduleLesson" | " isJoiningLesson" | " isStartLesson" | undefined >(undefined);

    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description:'',
        link: ''
    })

    const [callDetails, setCallDetails] = useState<Call>()
    const { toast } = useToast()
    
    const createLesson = async() => {
        if (!client || !user) return;

        try {
            if(!values.dateTime){
                toast({ title: "Please select Date and Time"})
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if(!call) throw new Error('Call not created');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'New Lesson';

            await call.getOrCreate({
                data:{
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })


            setCallDetails(call);

            if(!values.description) {
                router.push(`/classroom/${call.id}`)
            }

            toast({ title: "Lesson Created",})
        } catch (error) {
            console.log(error);
            toast({ title: "Failed to create lesson",})
        }
    }

    const lessonLink = `${process.env.NEXT_PUBLIC_BASE_URL}/classroom/${callDetails?.id}`

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Lesson"
                description="Start a new lesson"
                handleClick={() => setLessonState(' isStartLesson')}
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Lesson"
                description="via invitation link"
                className="bg-blue-1"
                handleClick={() => setLessonState(' isJoiningLesson')}
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Lesson"
                description="Plan your next lesson"
                className="bg-purple-1"
                handleClick={() => setLessonState(' isScheduleLesson')}
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Previous Lessons Reviews"
                className="bg-yellow-1"
                handleClick={() => router.push('/recordings')}
            />
            
            { !callDetails ? (<LessonModal
                isOpen={lessonState === ' isScheduleLesson'}
                onClose={() => setLessonState(undefined)}
                title="Create New Lesson"
                handleClick={createLesson}
            >
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px]">Add description for the lesson</label>
                    <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e)=>{
                        setValues({...values , description: e.target.value})
                    }}/>
                </div>
                <div className=" flex w-full flex-col gap-2.5">
                <label className="text-base text-normal leading-[22px]">Select date and time</label>
                <ReactDatePicker 
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                />
                </div>
            </LessonModal>
            ):(
                <LessonModal
                isOpen={lessonState === ' isScheduleLesson'}
                onClose={() => setLessonState(undefined)}
                title="New Lesson Created"
                className="text-center"
                handleClick={() => {
                    navigator.clipboard.writeText(lessonLink);
                    toast({ title: 'Link Copied' });
                }}
                image={'/icons/checked.svg'}
                buttonIcon="/icons/copy.svg"
                buttonText="Copy Lesson Link"
            />
            )}

            <LessonModal
                isOpen={lessonState === ' isStartLesson'}
                onClose={() => setLessonState(undefined)}
                title="Start a New Lesson"
                className="text-center"
                buttonText="Start Lesson"
                handleClick={createLesson}
            />

            <LessonModal
                isOpen={lessonState === ' isJoiningLesson'}
                onClose={() => setLessonState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Lesson"
                handleClick={()=> router.push(values.link)}>
                    <Input 
                    placeholder="Lesson Link"
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e)=> setValues({...values,link:e.target.value})}
                    />
            </LessonModal>

        </section>
    )
}

export default LessonTypeList