"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react"; // นำเข้า useState
import axios from "axios";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const Contact = () => {
  
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    faculty: "",
    major: "",
    phone: "",
    password: "", // เพิ่มฟิลด์รหัสผ่าน
    graduation: "", // เพิ่มฟิลด์ความต้องการเข้ารับพระราชทานปริญญาบัตร
    rentGown: "", // เพิ่มฟิลด์เช่าชุดครุย
    gownSize: "", // เพิ่มฟิลด์ขนาดชุดครุย
    pin: "ไม่รับ", // เพิ่มฟิลด์เข็ม
    photo: "ไม่รับ", // เพิ่มฟิลด์ภาพถ่าย
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบความยาวของรหัสผ่าน
    if (formData.password.length < 6 || formData.password.length > 10) {
      alert("รหัสผ่านต้องมีความยาวระหว่าง 6 ถึง 10 ตัวอักษร");
      return;
    }

    // ตรวจสอบว่ามีการเลือกความต้องการเข้ารับพระราชทานปริญญาบัตร
    if (formData.graduation === "") {
      alert("กรุณาเลือกความต้องการเข้ารับพระราชทานปริญญาบัตร");
      return;
    }

    // ตรวจสอบว่ามีการเลือกเช่าชุดครุยหรือไม่
    if (formData.graduation === "เข้ารับ" && formData.rentGown === "") {
      alert("กรุณาเลือกเช่าชุดครุยหรือไม่");
      return;
    }

    // ตรวจสอบว่ามีการเลือกขนาดชุดครุยหรือไม่เมื่อเลือกเช่า
    if (formData.rentGown === "เช่า" && formData.gownSize === "") {
      alert("กรุณาเลือกขนาดชุดครุย");
      return;
    }

    try {
      const response = await axios.post("/api/member", formData);
      alert(response.data.message);
      setFormData({ studentId: "", fullName: "", faculty: "", major: "", phone: "", password: "", graduation: "", rentGown: "", gownSize: "", pin: "ไม่รับ", photo: "ไม่รับ" });
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
              <VerticalTimeline>
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">First Macintosh computer</h3>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">iMac</h3>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">iPod</h3>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">iPhone</h3>
                </VerticalTimelineElement>
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">Apple Watch</h3>
                </VerticalTimelineElement>
              </VerticalTimeline>

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

                <hr></hr>

                <h3 className="mb-5 text-2xl font-semibold text-black dark:text-white">แบบสำรวจ</h3>

                <div className="mb-7.5">
                  <label className="block mb-2 text-lg font-medium text-black dark:text-white">1. ความต้องการเข้ารับพระราชทานปริญญาบัตร</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="graduation"
                        value="เข้ารับ"
                        onChange={handleChange}
                        checked={formData.graduation === "เข้ารับ"}
                      />
                      <span className="ml-2">เข้ารับ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="graduation"
                        value="ไม่เข้ารับ"
                        onChange={handleChange}
                        checked={formData.graduation === "ไม่เข้ารับ"}
                      />
                      <span className="ml-2">ไม่เข้ารับ</span>
                    </label>
                  </div>
                </div>

                <div className="mb-7.5">
                  <label className="block mb-2 text-lg font-medium text-black dark:text-white">2. เช่าชุดครุย</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rentGown"
                        value="ไม่เช่า"
                        onChange={handleChange}
                        checked={formData.rentGown === "ไม่เช่า"}
                      />
                      <span className="ml-2">ไม่เช่า</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rentGown"
                        value="เช่า"
                        onChange={handleChange}
                        checked={formData.rentGown === "เช่า"}
                      />
                      <span className="ml-2">เช่า</span>
                    </label>
                  </div>
                </div>

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

                    <div className="mb-7.5">
                      <label className="block mb-2 text-lg font-medium text-black dark:text-white">2.2 เข็ม</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pin"
                            value="รับ"
                            onChange={handleChange}
                            checked={formData.pin === "รับ"}
                          />
                          <span className="ml-2">รับ</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pin"
                            value="ไม่รับ"
                            onChange={handleChange}
                            checked={formData.pin === "ไม่รับ"}
                          />
                          <span className="ml-2">ไม่รับ</span>
                        </label>
                      </div>
                    </div>

                    <div className="mb-7.5">
                      <label className="block mb-2 text-lg font-medium text-black dark:text-white">2.3 ภาพถ่าย</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="photo"
                            value="รับภาพรวม"
                            onChange={handleChange}
                            checked={formData.photo === "รับภาพรวม"}
                          />
                          <span className="ml-2">รับภาพรวม</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="photo"
                            value="ไม่รับ"
                            onChange={handleChange}
                            checked={formData.photo === "ไม่รับ"}
                          />
                          <span className="ml-2">ไม่รับ</span>
                        </label>
                      </div>
                    </div>
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
    </>
  );
};

export default Contact;