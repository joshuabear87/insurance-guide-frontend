import React from 'react'

const Spinner = () => {
  return (
    <div className="flex justify-center items-top h-screen">
      <div className='animate-ping w-16 h-16 m-8 rounded-full bg-green-600'></div>
    </div>
  )
}

export default Spinner