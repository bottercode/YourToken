import React from 'react'

const UserCard = ({user}) => {
  return (
    <div className='flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:shadow-lg mb-5'>
      <div className='absolute left-[10%] '>
        <img className='rounded-full h-20 w-20 mb-4' src={user.avatar} alt={user.name} />
      </div>

      <div className='text-center'>
        <h3 className='text-lg font-semibold text-gray-800 mb-1'>{user.firstName}</h3>
        <p className='text-gray-600 mb-2'>{user.email}</p>
        <div className='text-gray-600 space-y-2'>
          <p>
            <span className='font-semibold'>Username:</span> {user.username}
          </p>
          <p>
            <span className='font-semibold'>Location:</span> {user.location}
          </p>
          <p>
            <span className='font-semibold'>Company:</span> {user.company}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
