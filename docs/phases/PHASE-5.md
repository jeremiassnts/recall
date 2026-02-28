# Phase 5 — Resume Upload

**Status:** ✅ Implemented

---

## Goal

Resume storage: PDF only, max file size, replace resume, associate with job application, signed R2 URLs for access. Cloudflare R2 as per PLANNING.md.

---

## Planned scope (from PLANNING.md §9.4, §10)

- **Storage:** Cloudflare R2; signed URL strategy
- **Constraints:** PDF only, max file size limit
- **Features:** Upload, replace resume, associate resume with job application
- **Resume model:** userId, r2Key, fileName, size
- **Security:** File type validation, signed R2 URLs

---

## Completion criteria (to fill when implemented)

- [x] Resume model in API; R2 bucket and credentials configured
- [x] Upload endpoint (validate PDF, size); store metadata in DB and file in R2
- [x] Replace resume flow; associate resume with job application (resumeId on JobApplication)
- [x] Signed URLs for secure access to PDFs
- [x] Phase 5 doc updated with “Implemented” section and file list

---

## Implemented

- **Resume model:** `Resume` in API (userId, r2Key, fileName, size). R2 client uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` with Cloudflare R2 endpoint; env: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`.
- **Upload:** `POST /api/resumes` with multipart file; PDF validated via magic bytes; max 5MB; file stored in R2, metadata in MongoDB.
- **Replace / associate:** Application form supports upload (create or replace), View (signed URL), Remove (clear resumeId). Create and update application accept `resumeId`; update accepts `resumeId: null` to clear.
- **Signed URLs:** `GET /api/resumes/:id/url` returns a presigned GET URL (1h) for the PDF.
- **Delete:** `DELETE /api/resumes/:id` removes document and object from R2.

### Files touched/added

**API**
- `apps/api/package.json` — added `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `multer`, `@types/multer`.
- `apps/api/.env.example` — R2 env vars (commented).
- `apps/api/src/models/Resume.ts` — Resume model.
- `apps/api/src/lib/r2.ts` — R2 client (upload, presigned URL, delete).
- `apps/api/src/routes/resumes.ts` — POST (upload), GET (list), GET `/:id/url`, DELETE `/:id`.
- `apps/api/src/index.ts` — mount `/api/resumes`.
- `apps/api/src/routes/applications.ts` — create body + create/update support `resumeId`; update schema allows `resumeId: null`.

**Shared**
- `packages/types/src/index.ts` — `Resume` interface; `JobApplicationCreate.resumeId` optional.

**Web**
- `apps/web/src/app/api/resumes/route.ts` — proxy GET (list), POST (upload).
- `apps/web/src/app/api/resumes/[id]/route.ts` — proxy DELETE.
- `apps/web/src/app/api/resumes/[id]/url/route.ts` — proxy GET URL.
- `apps/web/src/components/ApplicationForm.tsx` — resume block: upload PDF, View (signed URL), Replace, Remove; create/update send `resumeId`.

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
- Phase 2 (Job CRUD) — required for resume–application association.
