import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast"

function Home() {
   
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agent');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false); 


    const navigate = useNavigate();


    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            setLoading(true); 
            const response = await axios.post('http://localhost:8000/users/login', { email, password });
            // Store the token and redirect based on role
            const token = response.data.token;
          
            localStorage.setItem('token', token);
            // Add role-based redirection logic here
            const userResponse = await axios.get('http://localhost:8000/users/me', {
            headers: {
               Authorization: `Bearer ${token}`,
             },
           });
           
           const user=userResponse.data;
           // Store user role in local storage  
           localStorage.setItem('userRole', user.role); 
         
            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'agent') {
                navigate('/agent');
            } else if (user.role === 'customer') {
                navigate('/customer');
            }

            toast.success('Successfully login!');

        } catch (error) {
            console.error("Login failed", error);
            toast.error('Login failed. Please check your credentials.');
        } finally {  
          setLoading(false);  
      }  
          
    };

    const handleRegister = async (e) => {
      e.preventDefault();  
      setLoading(true);
        try {
           
            await axios.post('http://localhost:8000/users/signup', { username, email, password, role });
           
            
            navigate('/');
            toast.success('Successfully register!');


        } catch (error) {
            console.error("Registration failed", error);
            toast.error('Registration failed. Please try again.'); 
          } finally {  
              setLoading(false);   
          }  

    };
    

    return (
      
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${  
                            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLogin ? 'Login' : 'Register'}
          {loading && <p>Loading...</p>}  
        </button>
       
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full text-blue-500 mt-4 underline hover:text-blue-600"
      >
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
      
    </div>
    );
}

export default Home;
