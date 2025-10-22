'use client'

import Image from 'next/image'
import { useState } from 'react'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative w-full mb-6">
      <div className="relative">
        <Image
          src="/icons/search.svg"
          width={20}
          height={20}
          alt="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-14 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  )
}

export default SearchBar
