import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
      setMessage(e.target.value);
    };
    useEffect(()=>{
       const fetchLandLord = async()=>{
        try {
            const res = await axios.get(`/api/user/${listing.data.userRef}`)
            const data = res.data
            console.log(data)
            setLandlord(data)
        } catch (error) {
            console.log(error)
        }
       }
       fetchLandLord()
    },[listing.data.userRef])
  return (
    <>
    {landlord && (
        <div className="flex flex-col gap-2">
            <p>Contact <span className="font-semibold">{landlord.data.username}</span> {" "}
            for {" "} <span className="font-semibold">{listing.data.name.toLowerCase()}</span>
            </p>
            <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>
           <Link
          to={`mailto:${landlord.data.email}?subject=Regarding ${listing.data.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
    )}
    </>
  )
}

export default Contact