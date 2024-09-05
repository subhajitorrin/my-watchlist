import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="bg-[#0a0a0a] h-screen flex items-center justify-center">
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
              className="w-full p-3 bg-[#333] text-white rounded outline-none py-[10px] text-[14px]"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-[#333] text-white rounded outline-none py-[10px] text-[14px]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#7e22ce] hover:bg-[#6018a0] font-[500] transition-all ease-linear duration-200 py-[7px] px-[10px] rounded-[5px] w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
