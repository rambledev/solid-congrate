"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react"; // นำเข้า useState
import axios from "axios";

const Contact = () => {
  
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    faculty: "",
    major: "",
    phone: "",
    password: "", // เพิ่มฟิลด์รหัสผ่าน
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6 || formData.password.length > 10) {
      alert("รหัสผ่านต้องมีความยาวระหว่าง 6 ถึง 10 ตัวอักษร");
      return;
    }
    try {
      const response = await axios.post("/api/member", formData);
      alert(response.data.message);
      setFormData({ studentId: "", fullName: "", faculty: "", major: "", phone: "", password: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <>
      <section id="support" className="px-4 md:px-8 2xl:px-0">
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
            <Image
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="./images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-col gap-8">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:p-15"
            >
              <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                แบบฟอร์มลงทะเบียน
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    name="studentId"
                    type="text"
                    placeholder="รหัสนักศึกษา"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    onChange={handleChange}
                    value={formData.studentId}
                  />

                  <input
                    name="fullName"
                    type="text"
                    placeholder="ชื่อ-สกุล"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    onChange={handleChange}
                    value={formData.fullName}
                  />
                </div>

                <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    name="faculty"
                    type="text"
                    placeholder="คณะ"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    onChange={handleChange}
                    value={formData.faculty}
                  />

                  <input
                    name="major"
                    type="text"
                    placeholder="สาขาวิชา"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                    onChange={handleChange}
                    value={formData.major}
                  />
                </div>

                <div className="mb-11.5 flex">
                  <input
                    name="phone"
                    type="text"
                    placeholder="เบอร์โทร"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </div>

                <div className="mb-11.5 flex">
                  <input
                    name="password"
                    type="password"
                    placeholder="รหัสผ่าน"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>

                <div className="flex flex-wrap gap-4 xl:justify-between">
                  <button
                    type="submit"
                    aria-label="submit form"
                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                  >
                    ส่งข้อมูล
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;