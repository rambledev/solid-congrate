"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SigninProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    credentials: { email: string; password: string };
}

const Signin: React.FC<SigninProps> = ({ onChange, onSubmit, credentials }) => {
  return (
    <>
      {/* SignIn Form Start */}
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          {/* Dummy Images and Motion Elements */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8"
          >
            <h2 className="mb-15 text-center text-3xl font-semibold">Login to Your Account</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                  className="w-full border-b pb-3.5"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  className="w-full border-b pb-3.5"
                />
              </div>
              <button type="submit" className="bg-black text-white">Log in</button>
            </form>
            <div>
              <Link href="/auth/signup">Don't have an account? Sign Up</Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* SignIn Form End */}
    </>
  );
};

export default Signin;