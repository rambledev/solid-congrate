"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import HorizontalTimelineCustom from 'components/HorizontalTimelineCustom';

const Register = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    faculty: "",
    major: "",
    phone: "",
    password: "",
    graduation: "",
    rentGown: "",
    gownSize: "",
    pin: "ไม่รับ",
    photo: "ไม่รับ",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password.length < 6 || formData.password.length > 10) {
      alert("รหัสผ่านต้องมีความยาวระหว่าง 6 ถึง 10 ตัวอักษร");
      return false;
    }
    if (formData.graduation === "") {
      alert("กรุณาเลือกความต้องการเข้ารับพระราชทานปริญญาบัตร");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const checkResponse = await axios.post("/api/checkMember", {
        studentId: formData.studentId,
        fullName: formData.fullName,
      });

      if (checkResponse.data.exists) {
        alert("ข้อมูลนี้เคยทำการลงทะเบียนไปแล้ว");
        return;
      }

      const response = await axios.post("/api/member", formData);
      alert(response.data.message);

      // Reset form data
      setFormData({
        studentId: "",
        fullName: "",
        faculty: "",
        major: "",
        phone: "",
        password: "",
        graduation: "",
        rentGown: "",
        gownSize: "",
        pin: "ไม่รับ",
        photo: "ไม่รับ",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
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
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:p-15"
          >
            <HorizontalTimelineCustom />

            <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
              แบบฟอร์มลงทะเบียน
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Student ID and Full Name Fields */}
              <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                <InputField name="studentId" placeholder="รหัสนักศึกษา" value={formData.studentId} onChange={handleChange} />
                <InputField name="fullName" placeholder="ชื่อ-สกุล" value={formData.fullName} onChange={handleChange} />
              </div>

              {/* Faculty and Major Fields */}
              <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                <InputField name="faculty" placeholder="คณะ" value={formData.faculty} onChange={handleChange} />
                <InputField name="major" placeholder="สาขาวิชา" value={formData.major} onChange={handleChange} />
              </div>

              {/* Phone and Password Fields */}
              <InputField name="phone" placeholder="เบอร์โทร" value={formData.phone} onChange={handleChange} />
              <InputField name="password" type="password" placeholder="รหัสผ่าน" value={formData.password} onChange={handleChange} />

              <hr />

              <h3 className="mb-5 text-2xl font-semibold text-black dark:text-white">แบบสำรวจ</h3>

              {/* Graduation Options */}
              <div className="mb-7.5">
                <label className="block mb-2 text-lg font-medium text-black dark:text-white">1. ความต้องการเข้ารับพระราชทานปริญญาบัตร</label>
                <div className="flex gap-4">
                  <RadioInput name="graduation" value="เข้ารับ" checked={formData.graduation === "เข้ารับ"} onChange={handleChange} label="เข้ารับ" />
                  <RadioInput name="graduation" value="ไม่เข้ารับ" checked={formData.graduation === "ไม่เข้ารับ"} onChange={handleChange} label="ไม่เข้ารับ" />
                </div>
              </div>

              {/* Rent Gown Options */}
              <div className="mb-7.5">
                <label className="block mb-2 text-lg font-medium text-black dark:text-white">2. เช่าชุดครุย</label>
                <div className="flex gap-4">
                  <RadioInput name="rentGown" value="ไม่เช่า" checked={formData.rentGown === "ไม่เช่า"} onChange={handleChange} label="ไม่เช่า" />
                  <RadioInput name="rentGown" value="เช่า" checked={formData.rentGown === "เช่า"} onChange={handleChange} label="เช่า" />
                </div>
              </div>

              {/* Gown Size and Options if renting */}
              {formData.rentGown === "เช่า" && (
                <>
                  <div className="mb-7.5">
                    <label className="block mb-2 text-lg font-medium text-black dark:text-white">2.1 ขนาดชุดครุย</label>
                    <select
                      name="gownSize"
                      onChange={handleChange}
                      value={formData.gownSize}
                      className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    >
                      <option value="">เลือกขนาด</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  <OptionSection name="pin" label="2.2 เข็ม" options={["รับ", "ไม่รับ"]} onChange={handleChange} />
                  <OptionSection name="photo" label="2.3 ภาพถ่าย" options={["รับภาพรวม", "ไม่รับ"]} onChange={handleChange} />
                </>
              )}

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
  );
};

// Helper for rendering input fields
const InputField = ({ name, type = "text", placeholder, value, onChange }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
    onChange={onChange}
    value={value}
  />
);

// Helper for rendering radio inputs
const RadioInput = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center">
    <input
      type="radio"
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
    />
    <span className="ml-2">{label}</span>
  </label>
);

// Helper for rendering option sections
const OptionSection = ({ name, label, options, onChange }) => (
  <div className="mb-7.5">
    <label className="block mb-2 text-lg font-medium text-black dark:text-white">{label}</label>
    <div className="flex gap-4">
      {options.map(option => (
        <RadioInput key={option} name={name} value={option} onChange={onChange} label={option} />
      ))}
    </div>
  </div>
);

export default Register;