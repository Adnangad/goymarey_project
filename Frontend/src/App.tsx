import './App.css';
import logo from '../src/static/logo.png';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selected, setSelected] = useState('MALE');
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [confpass, setConfirm] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upload_pfp');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dmqmqd2m9/image/upload',
        formData
      );
      console.log(res.data.secure_url);
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed.");
    }
  };
  async function register(e: React.FormEvent<HTMLFormElement>) {
    const url = "http://localhost:4000/graphql";
    e.preventDefault();
    if (confpass !== password) {
      alert("Passwords do not match");
    }
    else if (!email || !password || !dob || !username) {
      alert("Please fill in all of the fields");
    }
    const date = new Date(dob);
    const query = ` mutation {
      createUser(name:"${username}", email: "${email}", password: "${password}", date_of_birth: "${date.toISOString()}", gender: "${selected}", imageUrl: "${imageUrl}") {
        id
        email
        date_of_birth
      }
    }`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const rez = await response.json();
      if (rez.errors) {
        console.error("GraphQL errors:", rez.errors);
        alert("Error: " + rez.errors[0]?.message || "Something went wrong.");
      } else {
        console.log("Success:", rez.data);
        alert("User registered successfully!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Network error. Try again later.");
    }
  }

  return (
    <>
      <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6 shadow">
        <div className='max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6 flex items-center justify-center'>
          <a href='#'>
            <img src={logo} alt='logo' className='w-44 inline-block rounded-full'></img>
          </a>
          <h4 className='text-slate-800  mt-6 text-xl'>Sign Up for an Account</h4>
        </div>
        <form onSubmit={register}>
          <div className='grid sm:grid-cols-2 gap-8'>
            <div>
              <label className='text-slate-800 text-sm font-medium mb-2 block'>Username</label>
              <input type='text' name='name' value={username} onChange={(e) => setName(e.target.value)} className='bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all' placeholder="Enter username"></input>
            </div>
            <div>
              <label className='text-slate-800 text-sm font-medium mb-2 block'>Email</label>
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all' placeholder="Enter Email"></input>
            </div>
            <div>
              <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
              <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter password" />
            </div>
            <div>
              <label className="text-slate-800 text-sm font-medium mb-2 block">Confirm Password</label>
              <input name="cpassword" value={confpass} onChange={(e) => setConfirm(e.target.value)} type="password" className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter confirm password" />
            </div>
            <div>
              <label className="text-slate-800 text-sm font-medium mb-2 block">Date of Birth</label>
              <input name="date" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-blue-500 transition-all" placeholder="Enter confirm password" />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-slate-800 text-sm font-medium mb-2 block">Gender</label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tech"
                  value="MALE"
                  checked={selected === 'MALE'}
                  onChange={() => setSelected('MALE')}
                  className="accent-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700">MALE</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tech"
                  value="FEMALE"
                  checked={selected === 'FEMALE'}
                  onChange={() => setSelected('FEMALE')}
                  className="accent-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700">FEMALE</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-slate-800 text-sm font-medium mb-2 block">Upload Profile Picture</label>
            <input type="file" onChange={handleUpload} className="text-slate-700 bg-blue-300 cursor-pointer" />
            {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-4 w-32 h-32 object-cover rounded-full" />}
          </div>
          <div className="mt-12">
            <button type="submit" className="mx-auto w-2xl block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-blue-600 hover:bg-blue-200 focus:outline-none cursor-pointer">
              Sign up
            </button>
          </div>
        </form >
      </div >
    </>
  )
}


export default App
