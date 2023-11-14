import React from 'react'

const UserCardSkeleton = ({repeatCount = 1}) => {
  return (
    <>
      {Array.from({length: repeatCount}).map((_, index) => (
        <div key={index} className='flex flex-col items-center p-4 border border-gray-300 rounded shadow-md mb-4'>
          <div className='bg-gray-300 absolute left-[20%] rounded-full h-16 w-16 animate-pulse'></div>
          <div className='bg-gray-300 h-5 w-1/5 mt-2 animate-pulse'></div>
          <div className='bg-gray-300 h-4 w-1/4 mt-2 animate-pulse'></div>
          <div className='bg-gray-300 h-4 w-[10%] mt-2 animate-pulse'></div>
          <div className='bg-gray-300 h-4 w-1/6 mt-2 animate-pulse'></div>
        </div>
      ))}
    </>
  )
}

export default UserCardSkeleton
