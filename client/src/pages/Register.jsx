import registerImg from '../assests/registerImg.png';
import { TiUserAdd } from "react-icons/ti";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import Spinner from '../assests/spinner/Spinner';
import OAuth from '../components/OAuth';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme } = useSelector((state) => state.themeSliceApp);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Async submit handler
  const submitHandle = async (e) => {
    e.preventDefault();
    const isValid = await validateForm(formData);
    if (!isValid) return;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = async (formData) => {
    const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Username validation
    if (!formData.username) {
      toast.error('Username cannot be blank!');
      return false;
    } else if (formData.username.includes(' ')) {
      toast.error('Username cannot contain space!');
      return false;
    } else if (formData.username !== formData.username.toLowerCase()) {
      toast.error('Username can only contain small letters!');
      return false;
    } else if (formData.username.length < 4) {
      toast.error('Username cannot be less than 4 characters!');
      return false;
    } else if (formData.username.length > 15) {
      toast.error('Username cannot exceed 15 characters!');
      return false;
    }

    // Email validation
    if (!formData.email) {
      toast.error('Email cannot be empty!');
      return false;
    } else if (!regEx.test(formData.email)) {
      toast.error('Please enter a valid email!');
      return false;
    }

    // Password validation
    if (!formData.password) {
      toast.error('Password cannot be empty!');
      return false;
    } else if (formData.password.length < 6) {
      toast.error('Password cannot be less than 6 characters!');
      return false;
    }

    // Registration API call
    try {
      setLoading(true);
      const registerUser = await axios.post(`/api/user/register`, formData);
      setLoading(false);
      toast.success(registerUser.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Registration failed!");
      return false;
    }
  };

  return (
    <>
      <div className="md:flex-row flex-col flex gap-10 items-center justify-center min-h-screen">

        {/* Left Content */}
        <div className="md:w-1/3 w-80">
          <img src={registerImg} alt="registerImg" className="" />
        </div>

        {/* Right Content */}
        <form className="md:w-1/3 w-80 flex flex-col gap-2" onSubmit={submitHandle}>

          <div className="flex items-center justify-center gap-3">
            <span className="border-2 rounded-full py-2 px-2 border-orange-400">
              <TiUserAdd className="text-orange-400" size={30} />
            </span>
            <h1 className="text-center text-2xl text-orange-400 font-semibold">User Signup</h1>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className='flex'>Username <span className='font-semibold text-red-400 text-xl'>*</span></label>
            <input
              type="text"
              name="username"
              placeholder='username'
              value={formData.username}
              onChange={onInputChange}
              autoComplete="off"
              className={`transition-all py-2 px-2 outline-none rounded-md border border-orange-400 ${theme === 'dark' ? 'bg-gray-700 focus:bg-gray-800' : 'bg-orange-50'}`}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className='flex'>Email <span className='font-semibold text-red-400 text-xl'>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="youremail@gmail.com"
              value={formData.email}
              onChange={onInputChange}
              autoComplete="off"
              className={`transition-all py-2 px-2 outline-none rounded-md border border-orange-400 ${theme === 'dark' ? 'bg-gray-700 focus:bg-gray-800' : 'bg-orange-50'}`}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className='flex'>Password <span className='font-semibold text-red-400 text-xl'>*</span></label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={onInputChange}
              autoComplete="off"
              className={`transition-all py-2 px-2 outline-none rounded-md border border-orange-400 ${theme === 'dark' ? 'bg-gray-700 focus:bg-gray-800' : 'bg-orange-50'}`}
            />
          </div>

          {/* Submit Button */}
          <div className="w-full">
            <button
              disabled={loading}
              type="submit"
              className="bg-orange-500 text-white font-semibold rounded-md w-full py-2 my-3 active:bg-orange-600 transition-all"
            >
              {loading ? <div className="flex justify-center items-center"><Spinner /></div> : <span>Register</span>}
            </button>
          </div>

          <hr />

          {/* OAuth */}
          <div className="w-full">
            <OAuth />
          </div>

          {/* Login link */}
          <div className="text-sm">
            <span>Already have an account? </span>
            <NavLink to={'/login'} className="text-blue-500 hover:underline cursor-pointer">Login</NavLink>
          </div>

        </form>

      </div>

      <Toaster />
    </>
  );
};

export default Register;
