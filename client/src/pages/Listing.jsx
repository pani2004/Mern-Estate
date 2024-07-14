import axios, { formToJSON } from 'axios'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import { useSelector } from 'react-redux';
import 'swiper/css/bundle'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import Contact from '../components/Contact'
function Listing() {
    SwiperCore.use([Navigation])
    const [listing,setListing] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams()
    const { currentUser } = useSelector((state) => state.user);
    console.log(listing)
    console.log(currentUser)
    useEffect(()=>{
    const fetchListing = async()=>{
        try {
            setLoading(true)
            const res = await axios.get(`/api/listing/get/${params.listingId}`)
            const data = res.data
            if (data.success===false) {
            setError(true)
            setLoading(false)
            return;
            }
            setListing(data)
            setLoading(false)
            setError(false)
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    }
    fetchListing()
    },[params.listingId])
  return (
    <main>
        {loading && <p className="text-center text-2xl my-7">Loading...</p>}
        {error && <p className="text-center text-2xl my-7">Something Went Wrong</p>}
        {listing && !loading && !error && (
            <div>
            <Swiper navigation>
                {listing.data.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                      <div className="h-[550px]" style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}>

                      </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
          <p className='text-2xl font-semibold'>
            {listing.data.name} - {' '}
            {listing.data.offer && (
            <>
            <span className="text-gray-400 line-through">${listing.data.regularPrice.toLocaleString('en-US')}</span>{' '}
            ${listing.data.discountPrice.toLocaleString('en-US')}
           </>
           )}
            {!listing.data.offer && (
            `$${listing.data.regularPrice.toLocaleString('en-US')}`
        )}
            {listing.data.type === 'rent' && ' / month'}
           </p>

            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.data.address}
            </p>
            <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.data.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {
                    listing.data.offer && (
                        <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                        ${+listing.data.regularPrice - +listing.data.discountPrice} Off
                        </p>
                    )
                }
            </div>
            <p className="text-slate-800">
            <span className="font-semibold text-black">Description -{' '} </span>
            {listing.data.description}  
          </p>
          <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
          <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.data.bedRooms > 1
                  ? `${listing.data.bedRooms} beds `
                  : `${listing.data.bedRooms} bed `}
           </li>
           <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.data.bathRooms > 1
                  ? `${listing.data.bathRooms} baths `
                  : `${listing.data.bathRooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.data.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.data.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
          </ul>
          {currentUser && listing.userRef !== currentUser.data._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
        )}
    </main>
  )
}

export default Listing