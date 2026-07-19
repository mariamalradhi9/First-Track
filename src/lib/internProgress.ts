export function isProfileComplete(intern: {
  mobile: string | null;
  address: string | null;
  universityName: string | null;
  studentId: string | null;
  gpa: number | null;
  dob: Date | null;
}): boolean {
  return !!(
    intern.mobile &&
    intern.address &&
    intern.universityName &&
    intern.studentId &&
    intern.gpa != null &&
    intern.dob
  );
}
