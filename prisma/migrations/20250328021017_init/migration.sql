-- CreateTable
CREATE TABLE "tb_checklist" (
    "id" SERIAL NOT NULL,
    "std_code" VARCHAR(50) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "check_by" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "tb_checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_member" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "std_code" VARCHAR(50) NOT NULL,
    "faculty" VARCHAR(100),
    "program" VARCHAR(100),
    "phone" VARCHAR(15),
    "password" TEXT,
    "graduation" VARCHAR(50),
    "rentgown" VARCHAR(50),
    "gownsize" VARCHAR(10),
    "pin" VARCHAR(50),
    "photo" VARCHAR(50),

    CONSTRAINT "tb_member_pkey" PRIMARY KEY ("id")
);
