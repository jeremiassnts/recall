# Phase 5 — Resume Upload

**Status:** 🔲 Not yet implemented

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

- [ ] Resume model in API; R2 bucket and credentials configured
- [ ] Upload endpoint (validate PDF, size); store metadata in DB and file in R2
- [ ] Replace resume flow; associate resume with job application (resumeId on JobApplication)
- [ ] Signed URLs for secure access to PDFs
- [ ] Phase 5 doc updated with “Implemented” section and file list

---

## Dependencies

- Phase 1 (Auth + User Sync) — completed.
- Phase 2 (Job CRUD) — required for resume–application association.
