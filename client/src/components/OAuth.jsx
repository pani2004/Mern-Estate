import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../fireBase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { signInSuccess } from '../redux/user/userSlice'
function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async ()=>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            const response = await axios.post('/api/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            console.log("Couldn't Sign In With Google",error)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue With Google</button>
  )
}

export default OAuth