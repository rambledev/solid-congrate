// app/site/stdlist/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCodeComponent from '../../../components/QRCodeComponent'; // นำเข้า QRCodeComponent
import './StdList.css'; // นำเข้าไฟล์ CSS สำหรับการตกแต่ง

interface Member {
    id: number;
    name: string;
    std_code: string;
    faculty: string;
    program: string;
    phone: string;
    password: string;
    graduation: null | string;
    rentgown: null | string;
    gownsize: null | string;
    pin: null | string;
    photo: null | string;
}

const StdList: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 5;
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('/api/member/allmember');
                if (response.data && Array.isArray(response.data.data)) {
                    setMembers(response.data.data);
                } else {
                    console.error("Data is not in the expected format: ", response.data);
                    setMembers([]);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                setMembers([]);
            }
        };
        fetchMembers();
    }, []);

    const filteredMembers = searchTerm
        ? members.filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : members;

    const currentMembers = showAll ? filteredMembers : filteredMembers.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleShowAll = () => {
        setShowAll(true);
        setCurrentPage(1); // Reset to first page when showing all
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="stdlist-container">
            <h1 className="header">Member List</h1>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <button onClick={handleShowAll} className="show-all-button">แสดงทั้งหมด</button>
            <button onClick={handlePrint} className="print-button">ปริ้น</button>
            <table className="member-table">
                <thead>
                    <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อ</th>
                        <th>รหัสนักศึกษา</th>
                        <th>QR Code</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id}>
                            <td>{index + 1 + (currentPage - 1) * membersPerPage}</td>
                            <td>{member.name}</td>
                            <td>{member.std_code}</td>
                            <td>
                                <QRCodeComponent
                                    value={member.std_code}
                                    size={100}
                                    bgColor="#FFFFFF"
                                    fgColor="#00FF00"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!showAll && (
                <div className="pagination">
                    {Array.from({ length: Math.ceil(filteredMembers.length / membersPerPage) }, (_, i) => (
                        <button 
                            key={i + 1} 
                            onClick={() => paginate(i + 1)}
                            className="page-button" 
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StdList;