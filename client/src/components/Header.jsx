import React from 'react'
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className=' font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className=' text-slate-500'>Pani</span>
            <span className=' text-slate-700'>Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
            <CiSearch/>
        </form>
        <ul className='flex gap-4'>
            <Link to='/' className=' hidden sm:inline text-slate-700 hover:scale-105'><li>Home</li></Link>
            <Link to='/about'  className=' hidden sm:inline text-slate-700 hover:scale-105 '><li>About</li></Link>
            <Link to='/sign-in' className='text-slate-700 hover:scale-105'><li>Signin</li></Link>
        </ul>
        </div>
    </header>
  )
}

export default Header