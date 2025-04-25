'use client';
import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function AdminModalLogin() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check-admin')
      .then(res => res.json())
      .then(data => {
        if (!data.ok) setShow(true);
      });
  }, []);

  return (
    show && (
      <Modal title="Admin Login Required">
        <p className="mb-4">คุณยังไม่ได้เข้าสู่ระบบ หรือไม่ได้เป็นผู้ดูแลระบบ</p>
        <a
          href="/login"
          className="inline-block px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          เข้าสู่ระบบ
        </a>
      </Modal>
    )
  );
}
