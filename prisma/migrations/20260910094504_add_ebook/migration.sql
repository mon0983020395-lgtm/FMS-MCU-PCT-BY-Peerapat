-- CreateTable
CREATE TABLE "ebooks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "author" VARCHAR(255),
    "publisher" VARCHAR(255),
    "category" VARCHAR(100),
    "publish_date" DATE,
    "description" TEXT,
    "cover_image_url" VARCHAR(500),
    "file_url" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ebooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ebooks_tenant_id_idx" ON "ebooks"("tenant_id");

-- AddForeignKey
ALTER TABLE "ebooks" ADD CONSTRAINT "ebooks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
