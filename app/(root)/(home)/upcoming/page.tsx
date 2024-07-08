import CallList from '@/components/CallList'
import React from 'react'

const Upcoming = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-amber-900">
      <h1 className="text-3xl font-bold">Upcoming Lessons</h1>
      <CallList type="upcoming"/>
    </section>
  )
}

export default Upcoming