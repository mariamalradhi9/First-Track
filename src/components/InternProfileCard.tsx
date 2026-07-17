import { format } from "date-fns";
import { Card } from "@/components/ui/Card";

export interface InternProfileData {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  address: string | null;
  universityName: string | null;
  studentId: string | null;
  gpa: number | null;
  major: string | null;
  yearOfStudy: string | null;
  nationality: string | null;
  department: string;
  mentor: string | null;
  hod: string | null;
  projectName: string | null;
  status: string;
  doj: string | null;
  durationMonths: number | null;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-3">{label}</dt>
      <dd className="mt-1 text-[14px] text-text">{value ?? "—"}</dd>
    </div>
  );
}

export function InternProfileCard({ intern: i }: { intern: InternProfileData }) {
  return (
    <Card className="p-5 sm:p-7">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mb-4">Profile</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Email" value={i.email} />
        <Field label="Mobile" value={i.mobile} />
        <Field label="Nationality" value={i.nationality} />
        <Field label="University" value={i.universityName} />
        <Field label="Student ID" value={i.studentId} />
        <Field label="GPA" value={i.gpa} />
        <Field label="Major" value={i.major} />
        <Field label="Year of Study" value={i.yearOfStudy} />
        <Field label="Address" value={i.address} />
      </dl>

      <h2 className="text-[13px] font-semibold uppercase tracking-[0.6px] text-text-3 mt-7 mb-4 pt-5 border-t border-line">
        Internship
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Department" value={i.department} />
        <Field label="Project" value={i.projectName} />
        <Field label="Mentor" value={i.mentor} />
        <Field label="Department Head" value={i.hod} />
        <Field label="Date of Joining" value={i.doj ? format(new Date(i.doj), "d MMM yyyy") : null} />
        <Field label="Duration" value={i.durationMonths ? `${i.durationMonths} months` : null} />
      </dl>
    </Card>
  );
}
