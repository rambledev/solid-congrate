import { notFound } from "next/navigation";

type Params = {
  params: {
    studentId: string;
  };
};

async function getStudentDetail(studentId: string) {
  // 🔁 เปลี่ยนไปใช้ API หรือฐานข้อมูลจริง
  const mockData = {
    studentId: "6401122334455",
    name: "สมชาย ใจดี",
    faculty: "ครุศาสตร์",
    major: "การศึกษาปฐมวัย",
    gradYear: "2566",
    email: "somchai@example.com",
    phone: "089-999-9999",
  };

  if (studentId === mockData.studentId) {
    return mockData;
  }

  return null;
}

export default async function DetailPage({ params }: Params) {
  const data = await getStudentDetail(params.studentId);

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-white p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-800">
        รายละเอียดนักศึกษา
      </h1>

      <div className="space-y-3 text-gray-800">
        <p><strong>รหัสนักศึกษา:</strong> {data.studentId}</p>
        <p><strong>ชื่อ - สกุล:</strong> {data.name}</p>
        <p><strong>คณะ:</strong> {data.faculty}</p>
        <p><strong>สาขา:</strong> {data.major}</p>
        <p><strong>ปีการศึกษาที่จบ:</strong> {data.gradYear}</p>
        <p><strong>อีเมล:</strong> {data.email}</p>
        <p><strong>เบอร์โทร:</strong> {data.phone}</p>
      </div>

      <div className="mt-8">
        <a
          href="/"
          className="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          ← กลับหน้าแรก
        </a>
      </div>
    </div>
  );
}
