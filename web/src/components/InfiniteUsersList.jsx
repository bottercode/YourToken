import React, {useCallback, useEffect, useState} from 'react'
import UserCard from './UserCard'
import UserCardSkeleton from '../ui/UserCardSkeleton'
import {RotateCcw, ChevronUp} from 'lucide-react'

const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

const InfiniteUsersList = () => {
  const [users, setUsers] = useState([])
  const [sortBy, setSortBy] = useState('')
  const [filters, setFilters] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSelectVisible, setIsSelectVisible] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [isFilterOptionsVisible, setIsFilterOptionsVisible] = useState(false)

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true)

        const filterParams = filters.map(({field, value}) => `${field}&${field}=${encodeURIComponent(value)}`).join('')

        const url = `https://yourtoken-api.onrender.com/api/users?page=${page}&sort=${sortBy}&filter=${filterParams}`
        const response = await fetch(url)
        const fetchedUsers = await response.json()
        setUsers(prevUsers => [...prevUsers, ...fetchedUsers])
      } catch (err) {
        setError('Error fetching users. Please try again.')
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    },
    [sortBy, filters, setIsLoading, setUsers, setError]
  )

  useEffect(() => {
    fetchUsers()
  }, [sortBy, filters, fetchUsers])

  const handleSortChange = event => {
    setSortBy(event.target.value)
    setUsers([])
    fetchUsers()
    setIsSelectVisible(false)
  }

  const handleSortByClick = () => {
    setIsSelectVisible(!isSelectVisible)
  }

  const handleAddFilter = () => {
    if (selectedFilter && filterValue) {
      setFilters([...filters, {field: selectedFilter, value: filterValue}])
      setFilterValue('')
    }
  }

  const handleAddFilterClick = () => {
    setIsFilterOptionsVisible(!isFilterOptionsVisible)
  }

  const handleRemoveFilter = index => {
    const updatedFilters = [...filters]
    updatedFilters.splice(index, 1)
    setFilters(updatedFilters)
  }

  const handleLoadMore = () => {
    const nextPage = Math.ceil(users.length / 10) + 1
    fetchUsers(nextPage)
  }

  const handleRefresh = () => {
    setUsers([])
    setError(null)
    fetchUsers()
  }

  const handleMoveToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const handleApplyFilters = () => {
    setUsers([])
    fetchUsers()
  }

  const onScroll = useCallback(
    debounce(() => {
      if (!isLoading && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        handleLoadMore()
      }
    }, 200),
    [isLoading]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <div className='container mx-auto p-8'>
      <div className='mb-4 flex space-x-4'>
        <div>
          <label className='relative inline-block'>
            <span
              onClick={handleSortByClick}
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center cursor-pointer'>
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              style={{display: isSelectVisible ? 'block' : 'none'}}
              className='absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 mt-2 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
              <option value='firstName'>Name</option>
              <option value='username'>Username</option>
              <option value='registrationDate'>Registration Date</option>
            </select>
          </label>
        </div>

        <div className='pl-20'>
          <label className='block mb-2'>
            Add Filter:
            <span
              onClick={handleAddFilterClick}
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center cursor-pointer'>
              {isFilterOptionsVisible ? 'Hide Options' : 'Show Options'}
            </span>
            {isFilterOptionsVisible && (
              <div>
                <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className='ml-2 p-2 border rounded'>
                  <option value=''>Select Field</option>
                  <option value='firstName'>Name</option>
                  <option value='email'>Email</option>
                  <option value='username'>Username</option>
                  <option value='location'>Location</option>
                  <option value='company'>Company</option>
                </select>
                {selectedFilter && <input type='text' value={filterValue} onChange={e => setFilterValue(e.target.value)} className='ml-2 p-2 border rounded' placeholder='Enter Value' />}
                <button
                  onClick={handleAddFilter}
                  className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'>
                  Add
                </button>
              </div>
            )}
          </label>
        </div>
        <div>
          {filters.map((filter, index) => (
            <div key={index} className='mb-2'>
              {`${filter.field}: ${filter.value}`}{' '}
              <button onClick={() => handleRemoveFilter(index)} className='ml-2 p-1 border rounded bg-red-500 text-white'>
                Remove
              </button>
            </div>
          ))}
        </div>
        <div>
          <button onClick={handleApplyFilters} className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 '>
            Apply Filters
          </button>
        </div>
      </div>

      <ul>
        {users.length === 0 && <UserCardSkeleton repeatCount={10} />}
        {users.map((user, index) => (
          <li key={index}>{user ? <UserCard user={user} /> : <UserCardSkeleton />}</li>
        ))}
        {isLoading && (
          <li>
            <UserCardSkeleton />
          </li>
        )}
      </ul>

      <div className='text-center mt-4'>
        <button onClick={handleLoadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      </div>

      {error && <p style={{color: 'red'}}>{error}</p>}

      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px'
        }}>
        <button onClick={handleRefresh} disabled={isLoading} className='bg-blue-500 rounded-full' title='Refresh'>
          <RotateCcw />
        </button>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px'
        }}>
        <button onClick={handleMoveToTop} title='move-up' className='bg-slate-600 rounded-lg'>
          <ChevronUp />
        </button>
      </div>
    </div>
  )
}

export default InfiniteUsersList
