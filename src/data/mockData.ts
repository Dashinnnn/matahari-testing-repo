// ===== PERSONS (Members linked to households) =====
export interface Person {
  id: string;
  householdId: string;

  firstName: string;
  lastName: string;
  name: string;

  barangay: string;
  cluster: string;
  precinct: string;

  relation: "Head" | "Spouse" | "Son" | "Daughter" | "Parent" | "Sibling" | "Relative" | "Helper";
  age: number;
  sex: "Male" | "Female";
  civilStatus: string;
  education: string;
  occupation: string;
  religion: string;
  profileImage: string;
  politicalTendency: PoliticalTendency;
}

export const persons: Person[] = [
  // HH-001 (Cluster A | Precinct 001)
  { id: "P-001", householdId: "HH-001", barangay: "San Miguel", cluster: "A", precinct: "001", firstName: "Juan", lastName: "Dela Cruz", name: "Juan Dela Cruz", relation: "Head", age: 42, sex: "Male", civilStatus: "Married", education: "College Graduate", occupation: "Farmer", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan", politicalTendency: "Leaning Administration" },
  { id: "P-002", householdId: "HH-001", barangay: "San Miguel", cluster: "A", precinct: "001", firstName: "Ana", lastName: "Dela Cruz", name: "Ana Dela Cruz", relation: "Spouse", age: 39, sex: "Female", civilStatus: "Married", education: "College Graduate", occupation: "Housewife", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", politicalTendency: "Leaning Opposition" },
  { id: "P-003", householdId: "HH-001", barangay: "San Miguel", cluster: "A", precinct: "001", firstName: "Marco", lastName: "Dela Cruz", name: "Marco Dela Cruz", relation: "Son", age: 18, sex: "Male", civilStatus: "Single", education: "Senior High School", occupation: "Student", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco", politicalTendency: "Neutral" },
  { id: "P-004", householdId: "HH-001", barangay: "San Miguel", cluster: "A", precinct: "001", firstName: "Sofia", lastName: "Dela Cruz", name: "Sofia Dela Cruz", relation: "Daughter", age: 14, sex: "Female", civilStatus: "Single", education: "Junior High School", occupation: "Student", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia", politicalTendency: "Neutral" },
  { id: "P-005", householdId: "HH-001", barangay: "San Miguel", cluster: "A", precinct: "001", firstName: "Lola", lastName: "Dela Cruz", name: "Lola Dela Cruz", relation: "Parent", age: 68, sex: "Female", civilStatus: "Widow", education: "Elementary", occupation: "Retired", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lola", politicalTendency: "Leaning Administration" },

  // HH-002 (Cluster B | Precinct 002)
  { id: "P-006", householdId: "HH-002", barangay: "San Miguel", cluster: "B", precinct: "002", firstName: "Maria", lastName: "Santos", name: "Maria Santos", relation: "Head", age: 35, sex: "Female", civilStatus: "Single", education: "High School", occupation: "Vendor", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", politicalTendency: "Leaning Administration" },
  { id: "P-007", householdId: "HH-002", barangay: "San Miguel", cluster: "B", precinct: "002", firstName: "Carlos", lastName: "Santos", name: "Carlos Santos", relation: "Son", age: 12, sex: "Male", civilStatus: "Single", education: "Elementary", occupation: "Student", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos", politicalTendency: "Neutral" },
  { id: "P-008", householdId: "HH-002", barangay: "San Miguel", cluster: "B", precinct: "002", firstName: "Lita", lastName: "Santos", name: "Lita Santos", relation: "Parent", age: 60, sex: "Female", civilStatus: "Widow", education: "Elementary", occupation: "Retired", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lita", politicalTendency: "Neutral" },

  // HH-003 (Cluster C | Precinct 003)
  { id: "P-009", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Pedro", lastName: "Reyes", name: "Pedro Reyes", relation: "Head", age: 55, sex: "Male", civilStatus: "Married", education: "Elementary", occupation: "Tricycle Driver", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", politicalTendency: "Opposition" },
  { id: "P-010", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Gloria", lastName: "Reyes", name: "Gloria Reyes", relation: "Spouse", age: 52, sex: "Female", civilStatus: "Married", education: "High School", occupation: "Laundrywoman", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gloria", politicalTendency: "Opposition" },
  { id: "P-011", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Miguel", lastName: "Reyes", name: "Miguel Reyes", relation: "Son", age: 28, sex: "Male", civilStatus: "Single", education: "Vocational", occupation: "Welder", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MiguelR", politicalTendency: "Leaning Opposition" },
  { id: "P-012", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Jasmine", lastName: "Reyes", name: "Jasmine Reyes", relation: "Daughter", age: 24, sex: "Female", civilStatus: "Single", education: "College Graduate", occupation: "Call Center Agent", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine", politicalTendency: "Neutral" },
  { id: "P-013", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Patrick", lastName: "Reyes", name: "Patrick Reyes", relation: "Son", age: 20, sex: "Male", civilStatus: "Single", education: "College", occupation: "Student", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick", politicalTendency: "Leaning Administration" },
  { id: "P-014", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Alyssa", lastName: "Reyes", name: "Alyssa Reyes", relation: "Daughter", age: 16, sex: "Female", civilStatus: "Single", education: "Senior High School", occupation: "Student", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alyssa", politicalTendency: "Neutral" },
  { id: "P-015", householdId: "HH-003", barangay: "San Miguel", cluster: "C", precinct: "003", firstName: "Ramon", lastName: "Reyes", name: "Ramon Reyes", relation: "Parent", age: 78, sex: "Male", civilStatus: "Married", education: "Elementary", occupation: "Retired", religion: "INC", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramon", politicalTendency: "Opposition" },

  // HH-004
  { id: "P-058", householdId: "HH-004", barangay: "Poblacion", cluster: "Cluster 2", precinct: "P-05B", firstName: "Rosa", lastName: "Aquino", name: "Rosa Aquino", relation: "Head", age: 48, sex: "Female", civilStatus: "Widow", education: "College Graduate", occupation: "Teacher", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosa", politicalTendency: "Leaning Administration" },

  // HH-005
  { id: "P-059", householdId: "HH-005", barangay: "Bagong Silang", cluster: "Cluster 3", precinct: "P-08C", firstName: "Antonio", lastName: "Garcia", name: "Antonio Garcia", relation: "Head", age: 39, sex: "Male", civilStatus: "Married", education: "Vocational", occupation: "Carpenter", religion: "Baptist", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio", politicalTendency: "Opposition" },

  // HH-006
  { id: "P-060", householdId: "HH-006", barangay: "Bagong Silang", cluster: "Cluster 3", precinct: "P-08C", firstName: "Elena", lastName: "Marcos", name: "Elena Marcos", relation: "Head", age: 62, sex: "Female", civilStatus: "Married", education: "College Graduate", occupation: "Retired", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", politicalTendency: "Pro-Administration" },

  // HH-007
  { id: "P-061", householdId: "HH-007", barangay: "Maligaya", cluster: "Cluster 4", precinct: "P-15D", firstName: "Ricardo", lastName: "Bautista", name: "Ricardo Bautista", relation: "Head", age: 45, sex: "Male", civilStatus: "Married", education: "High School", occupation: "Fisherman", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo", politicalTendency: "Leaning Administration" },

  // HH-008
  { id: "P-062", householdId: "HH-008", barangay: "Maligaya", cluster: "Cluster 4", precinct: "P-15D", firstName: "Carmen", lastName: "Lopez", name: "Carmen Lopez", relation: "Head", age: 33, sex: "Female", civilStatus: "Single", education: "College Graduate", occupation: "Nurse", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen", politicalTendency: "Neutral" },

  // HH-009
  { id: "P-063", householdId: "HH-009", barangay: "San Isidro", cluster: "Cluster 5", precinct: "P-03E", firstName: "Jose", lastName: "Fernandez", name: "Jose Fernandez", relation: "Head", age: 50, sex: "Male", civilStatus: "Married", education: "Vocational", occupation: "Mechanic", religion: "Aglipayan", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jose", politicalTendency: "Opposition" },

  // HH-010
  { id: "P-064", householdId: "HH-010", barangay: "San Isidro", cluster: "Cluster 5", precinct: "P-03E", firstName: "Luisa", lastName: "Tan", name: "Luisa Tan", relation: "Head", age: 29, sex: "Female", civilStatus: "Married", education: "College Graduate", occupation: "Accountant", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luisa", politicalTendency: "Leaning Administration" },

  // HH-011
  { id: "P-065", householdId: "HH-011", barangay: "San Miguel", cluster: "Cluster 1", precinct: "P-12A", firstName: "Miguel", lastName: "Ramos", name: "Miguel Ramos", relation: "Head", age: 47, sex: "Male", civilStatus: "Married", education: "High School", occupation: "Laborer", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel", politicalTendency: "Leaning Opposition" },

  // HH-012 (Cluster L | Precinct 012)
  { id: "P-054", householdId: "HH-012", barangay: "Poblacion", cluster: "L", precinct: "012", firstName: "Teresa", lastName: "Villanueva", name: "Teresa Villanueva", relation: "Head", age: 41, sex: "Female", civilStatus: "Married", education: "College Graduate", occupation: "Government Employee", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teresa", politicalTendency: "Pro-Administration" },
  { id: "P-055", householdId: "HH-012", barangay: "Poblacion", cluster: "L", precinct: "012", firstName: "Roy", lastName: "Villanueva", name: "Roy Villanueva", relation: "Spouse", age: 43, sex: "Male", civilStatus: "Married", education: "College Graduate", occupation: "Business Owner", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roy", politicalTendency: "Pro-Administration" },
  { id: "P-056", householdId: "HH-012", barangay: "Poblacion", cluster: "L", precinct: "012", firstName: "Trisha", lastName: "Villanueva", name: "Trisha Villanueva", relation: "Daughter", age: 17, sex: "Female", civilStatus: "Single", education: "Senior High School", occupation: "Student", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Trisha", politicalTendency: "Neutral" },
  { id: "P-057", householdId: "HH-012", barangay: "Poblacion", cluster: "L", precinct: "012", firstName: "Paolo", lastName: "Villanueva", name: "Paolo Villanueva", relation: "Son", age: 14, sex: "Male", civilStatus: "Single", education: "Junior High School", occupation: "Student", religion: "Catholic", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paolo", politicalTendency: "Neutral" },
];

export type PoliticalOrientation = "maratas" | "luz" | "undecided";

export interface PoliticalCandidate {
  key: PoliticalOrientation;
  label: string;
  /** 4px left-border stripe:  className={`border-l-4 ${pol.borderClass}`} */
  borderClass: string;
  /** Avatar ring outline:     className={`ring-2 ring-offset-1 ${pol.ringClass}`} */
  ringClass: string;
  /** Solid dot / filled chip: className={pol.bgClass} */
  bgClass: string;
  /** Subtle card tint (6%):   className={pol.tintClass} */
  tintClass: string;
  /** Text color:              className={pol.textClass} */
  textClass: string;
  /** Raw CSS variable — use for inline style={{ color }} when needed */
  cssVar: string;
}

export const POLITICAL_CANDIDATES: PoliticalCandidate[] = [
  {
    key: "maratas",
    label: "Maratas",
    borderClass: "pol-border-maratas",
    ringClass:   "pol-ring-maratas",
    bgClass:     "pol-bg-maratas",
    tintClass:   "pol-tint-maratas",
    textClass:   "pol-text-maratas",
    cssVar:      "var(--pol-maratas)",
  },
  {
    key: "luz",
    label: "Luz",
    borderClass: "pol-border-luz",
    ringClass:   "pol-ring-luz",
    bgClass:     "pol-bg-luz",
    tintClass:   "pol-tint-luz",
    textClass:   "pol-text-luz",
    cssVar:      "var(--pol-luz)",
  },
  {
    key: "undecided",
    label: "Undecided",
    borderClass: "pol-border-undecided",
    ringClass:   "pol-ring-undecided",
    bgClass:     "pol-bg-undecided",
    tintClass:   "pol-tint-undecided",
    textClass:   "pol-text-undecided",
    cssVar:      "var(--pol-undecided)",
  },
];

export function getCandidateConfig(
  orientation: PoliticalOrientation
): PoliticalCandidate {
  return (
    POLITICAL_CANDIDATES.find((c) => c.key === orientation) ??
    POLITICAL_CANDIDATES[2] // fallback: undecided
  );
}

// ===== HOUSEHOLDS =====
// Household-level fields only. Head-of-family personal data (age, sex, civil
// status, education, occupation, religion, profileImage, political tendency)
// lives on the matching Person record (see `indId` / getHouseholdHead()).
export interface Household {
  id: string;
  indId: string;
  headOfFamily: string;
  address: string;        // NEW — street-level locator for field workers
  barangay: string;
  precinct: string;
  cluster: string;
  members: number;
  housingType: string;
  income: number;
  waterSource: string;
  electricity: boolean;
  internet: boolean;
  lat: number;
  lng: number;
  politicalOrientation: PoliticalOrientation;
}

export const households: Household[] = [
  {
    id: "HH-001", indId: "P-001", headOfFamily: "Juan Dela Cruz",
    address: "45 Rizal St., Purok 2, San Miguel",
    barangay: "San Miguel", precinct: "P-12A", cluster: "Cluster 1",
    members: 5, housingType: "Concrete", income: 18000,
    waterSource: "Piped", electricity: true, internet: true,
    lat: 14.5995, lng: 120.9842,
    politicalOrientation: "maratas",
  },
  {
    id: "HH-002", indId: "P-006", headOfFamily: "Maria Santos",
    address: "12 Mabini St., Purok 2, San Miguel",
    barangay: "San Miguel", precinct: "P-12A", cluster: "Cluster 1",
    members: 3, housingType: "Semi-concrete", income: 12000,
    waterSource: "Well", electricity: true, internet: false,
    lat: 14.5998, lng: 120.9845,
    politicalOrientation: "luz",
  },
  {
    id: "HH-003", indId: "P-009", headOfFamily: "Pedro Reyes",
    address: "78 Bonifacio St., Purok 5, San Miguel",
    barangay: "San Miguel", precinct: "P-05B", cluster: "Cluster 2",
    members: 7, housingType: "Concrete", income: 10000,
    waterSource: "Piped", electricity: true, internet: false,
    lat: 14.6012, lng: 120.9830,
    politicalOrientation: "undecided",
  },
  {
    id: "HH-004", indId: "P-058", headOfFamily: "Rosa Aquino",
    address: "23 Aguinaldo St., Purok 1, Poblacion",
    barangay: "Poblacion", precinct: "P-05B", cluster: "Cluster 2",
    members: 4, housingType: "Wood", income: 25000,
    waterSource: "Piped", electricity: true, internet: true,
    lat: 14.6015, lng: 120.9828,
    politicalOrientation: "maratas",
  },
  {
    id: "HH-005", indId: "P-059", headOfFamily: "Antonio Garcia",
    address: "5 Malaya St., Purok 3, Bagong Silang",
    barangay: "Bagong Silang", precinct: "P-08C", cluster: "Cluster 3",
    members: 6, housingType: "Semi-concrete", income: 15000,
    waterSource: "Well", electricity: true, internet: false,
    lat: 14.5980, lng: 120.9855,
    politicalOrientation: "luz",
  },
  {
    id: "HH-006", indId: "P-060", headOfFamily: "Elena Marcos",
    address: "9 Malaya St., Purok 3, Bagong Silang",
    barangay: "Bagong Silang", precinct: "P-08C", cluster: "Cluster 3",
    members: 2, housingType: "Concrete", income: 20000,
    waterSource: "Piped", electricity: true, internet: true,
    lat: 14.5983, lng: 120.9858,
    politicalOrientation: "undecided",
  },
  {
    id: "HH-007", indId: "P-061", headOfFamily: "Ricardo Bautista",
    address: "31 Ilaw St., Purok 4, Maligaya",
    barangay: "Maligaya", precinct: "P-15D", cluster: "Cluster 4",
    members: 8, housingType: "Wood", income: 8000,
    waterSource: "Spring", electricity: false, internet: false,
    lat: 14.6025, lng: 120.9810,
    politicalOrientation: "maratas",
  },
  {
    id: "HH-008", indId: "P-062", headOfFamily: "Carmen Lopez",
    address: "14 Ilaw St., Purok 4, Maligaya",
    barangay: "Maligaya", precinct: "P-15D", cluster: "Cluster 4",
    members: 4, housingType: "Semi-concrete", income: 28000,
    waterSource: "Piped", electricity: true, internet: true,
    lat: 14.6028, lng: 120.9812,  
    politicalOrientation: "luz",
  },
  {
    id: "HH-009", indId: "P-063", headOfFamily: "Jose Fernandez",
    address: "67 Sampaguita St., Purok 1, San Isidro",
    barangay: "San Isidro", precinct: "P-03E", cluster: "Cluster 5",
    members: 5, housingType: "Concrete", income: 16000,
    waterSource: "Piped", electricity: true, internet: false,
    lat: 14.5970, lng: 120.9870,
    politicalOrientation: "undecided",
  },
  {
    id: "HH-010", indId: "P-064", headOfFamily: "Luisa Tan",
    address: "72 Sampaguita St., Purok 1, San Isidro",
    barangay: "San Isidro", precinct: "P-03E", cluster: "Cluster 5",
    members: 3, housingType: "Concrete", income: 35000,
    waterSource: "Piped", electricity: true, internet: true,
    lat: 14.5972, lng: 120.9872,
    politicalOrientation: "maratas",
  },
  {
    id: "HH-011", indId: "P-065", headOfFamily: "Miguel Ramos",
    address: "18 Rizal St., Purok 2, San Miguel",
    barangay: "San Miguel", precinct: "P-12A", cluster: "Cluster 1",
    members: 6, housingType: "Semi-concrete", income: 11000,
    waterSource: "Well", electricity: true, internet: false,
    lat: 14.6001, lng: 120.9848,
    politicalOrientation: "luz",
  },
  {
    id: "HH-012", indId: "P-054", headOfFamily: "Teresa Villanueva",
    address: "6 Aguinaldo St., Purok 1, Poblacion",
    barangay: "Poblacion", precinct: "P-05B", cluster: "Cluster 2",
    members: 4, housingType: "Concrete", income: 22000,
    waterSource: "Piped", electricity: true, internet: true,
    lat: 14.6018, lng: 120.9825,
    politicalOrientation: "undecided",
  },
];

/** Returns the household head's full Person record. */
export const getHouseholdHead = (householdId: string): Person | undefined =>
  persons.find((p) => p.householdId === householdId && p.relation === "Head");

// ===== WELFARE PROGRAMS =====
export type WelfareProgram = "4Ps" | "TUPAD" | "AICS" | "AKAP" | "CALAZEN Card" | "Nasa Negosyo" | "Nasa Tiyaga" | "Nasa Isip";

export type ProgramCategory = "National" | "Local";

export const programCategories: Record<WelfareProgram, ProgramCategory> = {
  "4Ps": "National",
  "TUPAD": "National",
  "AICS": "National",
  "AKAP": "National",
  "CALAZEN Card": "Local",
  "Nasa Negosyo": "Local",
  "Nasa Tiyaga": "Local",
  "Nasa Isip": "Local",
};

export interface WelfareProgramEntry {
  name: WelfareProgram;
  enrolledDate: string;
  status: "Active" | "Inactive";
  lastBenefit: string;
}

// ===== PERSON WELFARE (was household-scoped; now scoped per member) =====
export interface PersonWelfare {
  personId: string;
  householdId: string;
  programs: WelfareProgramEntry[];
}

// Yearly history for local government programs, per person
export interface PersonWelfareYearEntry {
  personId: string;
  householdId: string;
  year: number;
  programs: { name: WelfareProgram; status: "Active" | "Inactive" }[];
}

// Curated data — currently only covers household heads (the previously
// "household-level" records). Non-head members fall back to
// getPersonWelfare()'s synthetic generator below.
export const personWelfareHistory: PersonWelfareYearEntry[] = [
  { personId: "P-001", householdId: "HH-001", year: 2025, programs: [{ name: "CALAZEN Card", status: "Active" }] },
  { personId: "P-001", householdId: "HH-001", year: 2024, programs: [{ name: "CALAZEN Card", status: "Inactive" }, { name: "Nasa Negosyo", status: "Active" }] },
  { personId: "P-009", householdId: "HH-003", year: 2025, programs: [{ name: "Nasa Tiyaga", status: "Active" }] },
  { personId: "P-009", householdId: "HH-003", year: 2024, programs: [{ name: "Nasa Tiyaga", status: "Active" }, { name: "Nasa Negosyo", status: "Active" }] },
  { personId: "P-058", householdId: "HH-004", year: 2025, programs: [{ name: "Nasa Negosyo", status: "Active" }] },
  { personId: "P-058", householdId: "HH-004", year: 2024, programs: [{ name: "Nasa Negosyo", status: "Inactive" }] },
  { personId: "P-061", householdId: "HH-007", year: 2025, programs: [{ name: "Nasa Isip", status: "Active" }] },
  { personId: "P-061", householdId: "HH-007", year: 2024, programs: [{ name: "Nasa Isip", status: "Inactive" }, { name: "Nasa Tiyaga", status: "Active" }] },
  { personId: "P-062", householdId: "HH-008", year: 2025, programs: [{ name: "CALAZEN Card", status: "Active" }] },
  { personId: "P-062", householdId: "HH-008", year: 2024, programs: [{ name: "CALAZEN Card", status: "Active" }, { name: "Nasa Negosyo", status: "Active" }] },
  { personId: "P-054", householdId: "HH-012", year: 2025, programs: [{ name: "CALAZEN Card", status: "Active" }, { name: "Nasa Negosyo", status: "Active" }] },
  { personId: "P-054", householdId: "HH-012", year: 2024, programs: [{ name: "CALAZEN Card", status: "Active" }] },
];

export const personWelfare: PersonWelfare[] = [
  { personId: "P-001", householdId: "HH-001", programs: [{ name: "4Ps", enrolledDate: "2022-01-15", status: "Active", lastBenefit: "2026-02-28" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "2023-06-01", status: "Active", lastBenefit: "2026-03-01" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-006", householdId: "HH-002", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "2024-03-10", status: "Active", lastBenefit: "2026-01-15" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-009", householdId: "HH-003", programs: [{ name: "4Ps", enrolledDate: "2021-05-20", status: "Active", lastBenefit: "2026-02-28" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "2025-11-01", status: "Active", lastBenefit: "2025-11-01" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "2024-08-15", status: "Active", lastBenefit: "2026-01-30" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-058", householdId: "HH-004", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "2024-01-10", status: "Active", lastBenefit: "2026-02-15" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-059", householdId: "HH-005", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "2023-09-01", status: "Active", lastBenefit: "2026-03-05" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "2025-06-20", status: "Active", lastBenefit: "2025-12-20" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-060", householdId: "HH-006", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-061", householdId: "HH-007", programs: [{ name: "4Ps", enrolledDate: "2020-02-10", status: "Active", lastBenefit: "2026-02-28" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "2025-08-05", status: "Active", lastBenefit: "2025-08-05" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "2025-01-10", status: "Active", lastBenefit: "2026-02-01" }] },
  { personId: "P-062", householdId: "HH-008", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "2024-04-01", status: "Active", lastBenefit: "2026-03-01" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-063", householdId: "HH-009", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "2024-07-15", status: "Inactive", lastBenefit: "2025-07-15" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-064", householdId: "HH-010", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-065", householdId: "HH-011", programs: [{ name: "4Ps", enrolledDate: "2021-11-01", status: "Active", lastBenefit: "2026-02-28" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Negosyo", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
  { personId: "P-054", householdId: "HH-012", programs: [{ name: "4Ps", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "TUPAD", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AICS", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "AKAP", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "CALAZEN Card", enrolledDate: "2024-05-01", status: "Active", lastBenefit: "2026-03-01" }, { name: "Nasa Negosyo", enrolledDate: "2023-12-15", status: "Active", lastBenefit: "2026-01-15" }, { name: "Nasa Tiyaga", enrolledDate: "", status: "Inactive", lastBenefit: "" }, { name: "Nasa Isip", enrolledDate: "", status: "Inactive", lastBenefit: "" }] },
];

// ===== PERSON VULNERABILITY ASSESSMENT (was household-scoped; now per member) =====
export type DependencyLevel = "High" | "Moderate" | "Low";

export type VulnerabilityClassification = "Low" | "Moderate" | "High";

export interface VulnerabilityIndicatorScores {
  income: number;       // 0-3
  householdSize: number; // 0-3
  employment: number;   // 0-3
  welfareAccess: number; // 0-3
  housing: number;      // 0-3
  utilities: number;    // 0-3
}

export interface PersonVulnerabilityAssessment {
  personId: string;
  householdId: string;
  nationalGovDependency: DependencyLevel;
  localGovDependency: DependencyLevel;
  vulnerabilityClassification: VulnerabilityClassification;
  indicatorScores: VulnerabilityIndicatorScores;
}

export const classifyVulnerability = (total: number): VulnerabilityClassification => {
  if (total <= 4) return "Low";
  if (total <= 9) return "Moderate";
  return "High"; // 10-18
};

// Curated data — currently only covers household heads. Non-head members
// fall back to getPersonVulnerabilityAssessment()'s generator below.
export const personVulnerabilityAssessments: PersonVulnerabilityAssessment[] = [
  { personId: "P-001", householdId: "HH-001", nationalGovDependency: "Moderate", localGovDependency: "Moderate", vulnerabilityClassification: "Low",      indicatorScores: { income: 1, householdSize: 0, employment: 1, welfareAccess: 1, housing: 0, utilities: 1 } },
  { personId: "P-006", householdId: "HH-002", nationalGovDependency: "High",     localGovDependency: "Low",      vulnerabilityClassification: "Moderate", indicatorScores: { income: 2, householdSize: 1, employment: 2, welfareAccess: 1, housing: 1, utilities: 1 } },
  { personId: "P-009", householdId: "HH-003", nationalGovDependency: "High",     localGovDependency: "High",     vulnerabilityClassification: "High",     indicatorScores: { income: 3, householdSize: 2, employment: 2, welfareAccess: 2, housing: 2, utilities: 1 } },
  { personId: "P-058", householdId: "HH-004", nationalGovDependency: "Low",      localGovDependency: "Moderate", vulnerabilityClassification: "Low",      indicatorScores: { income: 1, householdSize: 1, employment: 0, welfareAccess: 1, housing: 0, utilities: 1 } },
  { personId: "P-059", householdId: "HH-005", nationalGovDependency: "Moderate", localGovDependency: "Low",      vulnerabilityClassification: "Moderate", indicatorScores: { income: 2, householdSize: 1, employment: 1, welfareAccess: 2, housing: 1, utilities: 1 } },
  { personId: "P-060", householdId: "HH-006", nationalGovDependency: "Low",      localGovDependency: "Low",      vulnerabilityClassification: "Low",      indicatorScores: { income: 0, householdSize: 1, employment: 1, welfareAccess: 0, housing: 1, utilities: 0 } },
  { personId: "P-061", householdId: "HH-007", nationalGovDependency: "High",     localGovDependency: "High",     vulnerabilityClassification: "High",     indicatorScores: { income: 3, householdSize: 3, employment: 3, welfareAccess: 3, housing: 2, utilities: 3 } },
  { personId: "P-062", householdId: "HH-008", nationalGovDependency: "Low",      localGovDependency: "Moderate", vulnerabilityClassification: "Low",      indicatorScores: { income: 1, householdSize: 0, employment: 1, welfareAccess: 1, housing: 0, utilities: 1 } },
  { personId: "P-063", householdId: "HH-009", nationalGovDependency: "Moderate", localGovDependency: "Low",      vulnerabilityClassification: "Moderate", indicatorScores: { income: 2, householdSize: 1, employment: 1, welfareAccess: 1, housing: 2, utilities: 1 } },
  { personId: "P-064", householdId: "HH-010", nationalGovDependency: "Low",      localGovDependency: "Low",      vulnerabilityClassification: "Low",      indicatorScores: { income: 0, householdSize: 1, employment: 0, welfareAccess: 1, housing: 1, utilities: 1 } },
  { personId: "P-065", householdId: "HH-011", nationalGovDependency: "High",     localGovDependency: "Low",      vulnerabilityClassification: "Moderate", indicatorScores: { income: 2, householdSize: 2, employment: 1, welfareAccess: 1, housing: 1, utilities: 2 } },
  { personId: "P-054", householdId: "HH-012", nationalGovDependency: "Low",      localGovDependency: "Moderate", vulnerabilityClassification: "Low",      indicatorScores: { income: 1, householdSize: 0, employment: 1, welfareAccess: 1, housing: 1, utilities: 0 } },
];

// ===== POLITICAL PROFILES (was household-scoped; now per member) =====
export type PoliticalTendency =
  | "Pro-Administration"
  | "Leaning Administration"
  | "Neutral"
  | "Leaning Opposition"
  | "Opposition";

export type VotingTrend = "Consistent" | "Shifting" | "New Voter" | "Inactive";

export interface PoliticalScoreEntry {
  core: string; // "0","1","2","2a","2b","3"
  scope: string; // "1","2","3" or "" if core is 0/none
}

export interface PoliticalProfile {
  personId: string;
  householdId: string;
  orgSector: string;
  orgName: string;
  scores: {
    affiliation: PoliticalScoreEntry;
    leadership: PoliticalScoreEntry;
    mobilization: PoliticalScoreEntry;
    opinionLeadership: PoliticalScoreEntry;
    infoDissemination: PoliticalScoreEntry;
  };
  palScore: string; // "0"-"6"
  orientation: PoliticalTendency;
  party: string;
  votingTrend: VotingTrend;
  supportLevel: number;
  interestLevel: "High" | "Moderate" | "Low";
  governanceViews: string;
  discussionParticipation: "Active" | "Occasional" | "Rare" | "None";
  civicAffiliations: string[];
  votingHistory: { year: number; voted: boolean; party: string }[];
  lastUpdated: string;
}

// ── Scoring helpers ────────────────────────────────────────────

const s = (c: string, sc: string): PoliticalScoreEntry => ({ core: c, scope: c === "0" ? "" : sc });

/** Converts core string ("2a"/"2b" → 2, else parseInt) */
export const getCoreNumeric = (v: string): number => {
  if (v === "2a" || v === "2b") return 2;
  return parseInt(v) || 0;
};

export const getScopeNumeric = (v: string): number => parseFloat(v) || 0;

/**
 * Core Score total → influence tier
 * 0–5   → Low Influence
 * 6–10  → Moderate Influence
 * 11–16 → High Influence
 * 17–21 → Key Influencer
 */
export const getInfluenceTier = (coreTotal: number): string => {
  if (coreTotal <= 5)  return "Low Influence";
  if (coreTotal <= 10) return "Moderate Influence";
  if (coreTotal <= 16) return "High Influence";
  return "Key Influencer";
};

/**
 * Scope average → scope level label
 * 1.00–1.49 → Cluster Level Player
 * 1.50–2.49 → Barangay Level Player
 * 2.50–3.00 → Municipal Level Player
 */
export const getScopeLevelLabel = (avg: number): string => {
  if (avg < 1.50) return "Cluster Level Player";
  if (avg < 2.50) return "Barangay Level Player";
  return "Municipal Level Player";
};

/**
 * PAL numeric value
 * 0 → None
 * 1 → Informal Local Political Role
 * 2 → Barangay Councilor
 * 3 → Barangay Captain
 * 4 → City/Municipal Councilor
 * 5 → City/Municipal Vice Mayor
 * 6 → City/Municipal Mayor
 */
export const PAL_LABELS: Record<string, string> = {
  "0": "None",
  "1": "Informal Local Political Role",
  "2": "Barangay Councilor",
  "3": "Barangay Captain",
  "4": "City/Municipal Councilor",
  "5": "City/Municipal Vice Mayor",
  "6": "City/Municipal Mayor",
};

/**
 * PAL scope floor override
 * PAL 0–1 → no override (returns raw avg)
 * PAL 2–3 → minimum Barangay-level (avg floored at 1.50)
 * PAL 4–6 → minimum Municipal-level (avg floored at 2.50)
 */
export const applyPalScopeFloor = (scopeAvg: number, palScore: string): number => {
  const pal = parseInt(palScore) || 0;
  if (pal >= 4) return Math.max(scopeAvg, 2.50); // Municipal floor
  if (pal >= 2) return Math.max(scopeAvg, 1.50); // Barangay floor
  return scopeAvg;                                // No override
};

/**
 * Computes the full political profile summary for a person.
 * Returns e.g. "Barangay-level High Influencer"
 */
export const computePoliticalSummary = (profile: PoliticalProfile): {
  coreTotal: number;
  scopeAvg: number;
  adjustedScopeAvg: number;
  influenceTier: string;
  scopeLevel: string;
  summary: string;
} => {
  const scoreValues = Object.values(profile.scores);

  const coreTotal = scoreValues.reduce((sum, s) => sum + getCoreNumeric(s.core), 0);

  const scopeScores = scoreValues
    .map(s => getScopeNumeric(s.scope))
    .filter(v => v > 0); // exclude 0/empty (non-participating scores)

  const rawScopeAvg = scopeScores.length > 0
    ? scopeScores.reduce((a, b) => a + b, 0) / scopeScores.length
    : 1.00;

  const adjustedScopeAvg = applyPalScopeFloor(rawScopeAvg, profile.palScore);

  const influenceTier = getInfluenceTier(coreTotal);
  const scopeLevel    = getScopeLevelLabel(adjustedScopeAvg);

  // e.g. "Barangay-level High Influencer"
  const scopePrefix = scopeLevel.replace(" Player", "");
  const summary = `${scopePrefix} ${influenceTier}`;

  return { coreTotal, scopeAvg: rawScopeAvg, adjustedScopeAvg, influenceTier, scopeLevel, summary };
};

// ── Mock data ──────────────────────────────────────────────────
// Curated data — currently only covers household heads. Non-head members
// fall back to getPersonPoliticalProfile()'s generator below.

export const politicalProfiles: PoliticalProfile[] = [
  { personId: "P-001", householdId: "HH-001", orgSector: "Agriculture", orgName: "Farmers Association",   scores: { affiliation: s("3","3"), leadership: s("3","3"), mobilization: s("3","2"), opinionLeadership: s("2","2"), infoDissemination: s("2","2") }, palScore: "3", orientation: "Pro-Administration", party: "PDP-Laban",   votingTrend: "Consistent", supportLevel: 9, interestLevel: "High",     governanceViews: "Supports current administration policies",         discussionParticipation: "Active",     civicAffiliations: ["Farmers Association","Barangay Council"], votingHistory: [{year:2022,voted:true,party:"PDP-Laban"},{year:2019,voted:true,party:"PDP-Laban"}],   lastUpdated: "2026-03-10" },
  { personId: "P-006", householdId: "HH-002", orgSector: "Social Services", orgName: "Women's Group",      scores: { affiliation: s("1","1"), leadership: s("1","1"), mobilization: s("1","1"), opinionLeadership: s("1","1"), infoDissemination: s("1","1") }, palScore: "0", orientation: "Leaning Administration",       party: "Liberal",      votingTrend: "Shifting",   supportLevel: 6, interestLevel: "Moderate", governanceViews: "Favors social welfare expansion",                  discussionParticipation: "Occasional", civicAffiliations: ["Women's Group"],                          votingHistory: [{year:2022,voted:true,party:"Liberal"},{year:2019,voted:true,party:"PDP-Laban"}],     lastUpdated: "2026-03-08" },
  { personId: "P-009", householdId: "HH-003", orgSector: "", orgName: "",                                  scores: { affiliation: s("0",""), leadership: s("0",""),  mobilization: s("0",""),  opinionLeadership: s("0",""),  infoDissemination: s("0","")  }, palScore: "0", orientation: "Neutral",     party: "None",         votingTrend: "Shifting",   supportLevel: 4, interestLevel: "Low",      governanceViews: "Dissatisfied with local governance",               discussionParticipation: "Rare",       civicAffiliations: [],                                         votingHistory: [{year:2022,voted:true,party:"Independent"},{year:2019,voted:false,party:""}],          lastUpdated: "2026-03-05" },
  { personId: "P-058", householdId: "HH-004", orgSector: "Education", orgName: "Teachers Union",           scores: { affiliation: s("2a","2"), leadership: s("2","2"), mobilization: s("2","2"), opinionLeadership: s("3","3"), infoDissemination: s("2","2") }, palScore: "0", orientation: "Opposition",       party: "Nacionalista", votingTrend: "Consistent", supportLevel: 2, interestLevel: "High",     governanceViews: "Critical of administration, advocates reform",      discussionParticipation: "Active",     civicAffiliations: ["Teachers Union","PTA"],                   votingHistory: [{year:2022,voted:true,party:"Nacionalista"},{year:2019,voted:true,party:"Nacionalista"}], lastUpdated: "2026-03-12" },
  { personId: "P-059", householdId: "HH-005", orgSector: "Trade", orgName: "Carpenters Guild",             scores: { affiliation: s("1","1"), leadership: s("1","1"), mobilization: s("1","1"), opinionLeadership: s("0",""),  infoDissemination: s("1","1") }, palScore: "0", orientation: "Leaning Administration",       party: "PDP-Laban",   votingTrend: "Consistent", supportLevel: 7, interestLevel: "Moderate", governanceViews: "Supports infrastructure projects",                 discussionParticipation: "Occasional", civicAffiliations: ["Carpenters Guild"],                       votingHistory: [{year:2022,voted:true,party:"PDP-Laban"},{year:2019,voted:true,party:"PDP-Laban"}],   lastUpdated: "2026-02-28" },
  { personId: "P-060", householdId: "HH-006", orgSector: "Social Services", orgName: "Senior Citizens Org", scores: { affiliation: s("2a","2"), leadership: s("2","2"), mobilization: s("2","2"), opinionLeadership: s("2","2"), infoDissemination: s("3","3") }, palScore: "2", orientation: "Pro-Administration", party: "PDP-Laban",   votingTrend: "Consistent", supportLevel: 8, interestLevel: "High",     governanceViews: "Strong supporter of senior citizen programs",       discussionParticipation: "Active",     civicAffiliations: ["Senior Citizens Org"],                    votingHistory: [{year:2022,voted:true,party:"PDP-Laban"},{year:2019,voted:true,party:"PDP-Laban"}],   lastUpdated: "2026-03-01" },
  { personId: "P-061", householdId: "HH-007", orgSector: "", orgName: "",                                  scores: { affiliation: s("0",""), leadership: s("0",""),  mobilization: s("0",""),  opinionLeadership: s("0",""),  infoDissemination: s("0","")  }, palScore: "0", orientation: "Neutral",     party: "None",         votingTrend: "Inactive",   supportLevel: 3, interestLevel: "Low",      governanceViews: "Feels neglected by government",                    discussionParticipation: "None",       civicAffiliations: [],                                         votingHistory: [{year:2022,voted:false,party:""},{year:2019,voted:false,party:""}],                    lastUpdated: "2026-02-20" },
  { personId: "P-062", householdId: "HH-008", orgSector: "Health", orgName: "Nurses Association",          scores: { affiliation: s("1","1"), leadership: s("0",""),  mobilization: s("1","1"), opinionLeadership: s("1","1"), infoDissemination: s("2","2") }, palScore: "0", orientation: "Leaning Opposition",       party: "Liberal",      votingTrend: "Shifting",   supportLevel: 5, interestLevel: "Moderate", governanceViews: "Pro-health sector reform",                          discussionParticipation: "Occasional", civicAffiliations: ["Nurses Association"],                     votingHistory: [{year:2022,voted:true,party:"Liberal"}],                                               lastUpdated: "2026-03-15" },
  { personId: "P-063", householdId: "HH-009", orgSector: "Trade", orgName: "Mechanics Cooperative",        scores: { affiliation: s("1","1"), leadership: s("1","1"), mobilization: s("1","1"), opinionLeadership: s("1","1"), infoDissemination: s("1","1") }, palScore: "0", orientation: "Pro-Administration", party: "PDP-Laban",   votingTrend: "Consistent", supportLevel: 8, interestLevel: "Moderate", governanceViews: "Supports local development projects",              discussionParticipation: "Occasional", civicAffiliations: ["Mechanics Cooperative"],                  votingHistory: [{year:2022,voted:true,party:"PDP-Laban"},{year:2019,voted:true,party:"PDP-Laban"}],   lastUpdated: "2026-03-11" },
  { personId: "P-064", householdId: "HH-010", orgSector: "Professional", orgName: "Professional Association", scores: { affiliation: s("2b","2"), leadership: s("2","3"), mobilization: s("2","2"), opinionLeadership: s("3","3"), infoDissemination: s("3","3") }, palScore: "1", orientation: "Opposition",   party: "Nacionalista", votingTrend: "Consistent", supportLevel: 2, interestLevel: "High",     governanceViews: "Advocates transparency and accountability",         discussionParticipation: "Active",     civicAffiliations: ["Professional Association"],               votingHistory: [{year:2022,voted:true,party:"Nacionalista"},{year:2019,voted:true,party:"Liberal"}],   lastUpdated: "2026-03-14" },
  { personId: "P-065", householdId: "HH-011", orgSector: "", orgName: "",                                  scores: { affiliation: s("0",""), leadership: s("0",""),  mobilization: s("0",""),  opinionLeadership: s("0",""),  infoDissemination: s("0","")  }, palScore: "0", orientation: "Leaning Opposition",       party: "PDP-Laban",   votingTrend: "Shifting",   supportLevel: 6, interestLevel: "Low",      governanceViews: "Wants more job opportunities",                      discussionParticipation: "Rare",       civicAffiliations: [],                                         votingHistory: [{year:2022,voted:true,party:"Independent"},{year:2019,voted:true,party:"PDP-Laban"}],  lastUpdated: "2026-03-09" },
  { personId: "P-054", householdId: "HH-012", orgSector: "Government", orgName: "Government Employees Union", scores: { affiliation: s("2a","3"), leadership: s("3","3"), mobilization: s("3","3"), opinionLeadership: s("2","2"), infoDissemination: s("2","3") }, palScore: "4", orientation: "Pro-Administration", party: "PDP-Laban", votingTrend: "Consistent", supportLevel: 9, interestLevel: "High",    governanceViews: "Active supporter of administration programs",       discussionParticipation: "Active",     civicAffiliations: ["Government Employees Union"],             votingHistory: [{year:2022,voted:true,party:"PDP-Laban"},{year:2019,voted:true,party:"PDP-Laban"}],   lastUpdated: "2026-03-16" },
];

// ── Per-person fallback generators ──────────────────────────────
// Curated arrays above only cover household heads. These generators return
// the curated record when it exists, or a deterministic synthetic snapshot
// for any other member so every person has something to show in their
// workspace. Swap for a real per-person query once this data is tracked
// individually end-to-end.

const hashStr = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

const TENDENCY_SUPPORT_BASELINE: Record<PoliticalTendency, number> = {
  "Pro-Administration": 9,
  "Leaning Administration": 7,
  "Neutral": 5,
  "Leaning Opposition": 3,
  "Opposition": 1,
};

export function getPersonWelfare(personId: string): PersonWelfare | null {
  const curated = personWelfare.find(w => w.personId === personId);
  if (curated) return curated;

  const person = persons.find(p => p.id === personId);
  if (!person) return null;

  const seed = hashStr(personId);
  const programs: WelfareProgramEntry[] = (Object.keys(programCategories) as WelfareProgram[])
    .map((name, i) => {
      const active = (seed >> i) % 3 === 0;
      return {
        name,
        status: active ? "Active" as const : "Inactive" as const,
        enrolledDate: active ? "2024-01-01" : "",
        lastBenefit: active ? "2026-01-01" : "",
      };
    });

  return { personId, householdId: person.householdId, programs };
}

export function getPersonWelfareHistory(personId: string): PersonWelfareYearEntry[] {
  return personWelfareHistory.filter(h => h.personId === personId);
}

export function getPersonPoliticalProfile(personId: string): PoliticalProfile | null {
  const curated = politicalProfiles.find(p => p.personId === personId);
  if (curated) return curated;

  const person = persons.find(p => p.id === personId);
  if (!person) return null;

  return {
    personId,
    householdId: person.householdId,
    orgSector: "",
    orgName: "",
    scores: {
      affiliation: s("0", ""),
      leadership: s("0", ""),
      mobilization: s("0", ""),
      opinionLeadership: s("0", ""),
      infoDissemination: s("0", ""),
    },
    palScore: "0",
    orientation: person.politicalTendency,
    party: "None",
    votingTrend: person.age >= 18 ? "New Voter" : "Inactive",
    supportLevel: TENDENCY_SUPPORT_BASELINE[person.politicalTendency],
    interestLevel: "Low",
    governanceViews: "No detailed assessment on file.",
    discussionParticipation: "None",
    civicAffiliations: [],
    votingHistory: [],
    lastUpdated: "—",
  };
}

export function getPersonVulnerabilityAssessment(personId: string): PersonVulnerabilityAssessment | null {
  const curated = personVulnerabilityAssessments.find(a => a.personId === personId);
  if (curated) return curated;

  const person = persons.find(p => p.id === personId);
  if (!person) return null;

  // Fall back to the household's economic profile (income/housing/utilities
  // are shared at the household level), personalizing the employment
  // indicator by the member's own occupation/status.
  const householdBase = personVulnerabilityAssessments.find(a => a.householdId === person.householdId);
  const baseScores = householdBase?.indicatorScores
    ?? { income: 1, householdSize: 1, employment: 1, welfareAccess: 1, housing: 1, utilities: 1 };

  const employment = (person.occupation === "Student" || person.occupation === "Retired") ? 0 : baseScores.employment;
  const indicatorScores = { ...baseScores, employment };
  const total = Object.values(indicatorScores).reduce((a, b) => a + b, 0);

  return {
    personId,
    householdId: person.householdId,
    nationalGovDependency: householdBase?.nationalGovDependency ?? "Low",
    localGovDependency: householdBase?.localGovDependency ?? "Low",
    vulnerabilityClassification: classifyVulnerability(total),
    indicatorScores,
  };
}

// ===== KOBO SUBMISSIONS (status: Read / Unread) =====
export interface KoboSubmission {
  id: string;
  householdId: string;
  submitter: string;
  date: string;
  status: "Read" | "Unread";
  type: string;
}

export const koboSubmissions: KoboSubmission[] = [
  { id: "KS-001", householdId: "HH-001", submitter: "POC-Reyes", date: "2026-03-17", status: "Read", type: "Baseline Survey" },
  { id: "KS-002", householdId: "HH-003", submitter: "POC-Santos", date: "2026-03-17", status: "Unread", type: "Political Profile Update" },
  { id: "KS-003", householdId: "HH-005", submitter: "POC-Reyes", date: "2026-03-16", status: "Read", type: "Welfare Assessment" },
  { id: "KS-004", householdId: "HH-007", submitter: "POC-Garcia", date: "2026-03-16", status: "Unread", type: "Baseline Survey" },
  { id: "KS-005", householdId: "HH-002", submitter: "POC-Santos", date: "2026-03-15", status: "Read", type: "Socio-Demographic Update" },
  { id: "KS-006", householdId: "HH-009", submitter: "POC-Lopez", date: "2026-03-15", status: "Unread", type: "Political Profile Update" },
  { id: "KS-007", householdId: "HH-011", submitter: "POC-Reyes", date: "2026-03-14", status: "Read", type: "Welfare Assessment" },
  { id: "KS-008", householdId: "HH-004", submitter: "POC-Santos", date: "2026-03-14", status: "Read", type: "Threat Report" },
  { id: "KS-009", householdId: "HH-008", submitter: "POC-Garcia", date: "2026-03-13", status: "Unread", type: "Baseline Survey" },
  { id: "KS-010", householdId: "HH-012", submitter: "POC-Lopez", date: "2026-03-13", status: "Read", type: "Socio-Demographic Update" },
];

// ===== THREAT INDICATORS (per-person, not per-cluster) =====
export interface ThreatIndicator {
  id: string;
  personId: string;
  householdId: string;
  type: "Behavior Change" | "Tension" | "Disruption";
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  frequency: number;
  dateReported: string;
  reportedBy: string;
}

export const threatIndicators: ThreatIndicator[] = [
  { id: "TI-001", personId: "P-009", householdId: "HH-003", type: "Tension", severity: "High", description: "Observed attending opposition rallies and expressing public dissatisfaction with local governance", frequency: 5, dateReported: "2026-03-15", reportedBy: "PO-Santos" },
  { id: "TI-002", personId: "P-016", householdId: "HH-004", type: "Behavior Change", severity: "Critical", description: "Active campaigning against administration candidates; influencing fellow teachers and PTA members", frequency: 8, dateReported: "2026-03-16", reportedBy: "PO-Santos" },
  { id: "TI-003", personId: "P-028", householdId: "HH-007", type: "Behavior Change", severity: "Medium", description: "Previously neutral but now showing signs of dissatisfaction due to lack of basic utilities", frequency: 3, dateReported: "2026-03-14", reportedBy: "PO-Garcia" },
  { id: "TI-004", personId: "P-020", householdId: "HH-005", type: "Tension", severity: "Critical", description: "Reported being approached for vote-buying by unknown group; expressed temptation due to financial need", frequency: 4, dateReported: "2026-03-16", reportedBy: "PO-Lopez" },
  { id: "TI-005", personId: "P-045", householdId: "HH-010", type: "Behavior Change", severity: "Medium", description: "Declining attendance at community meetings; shifting political views based on social media content", frequency: 6, dateReported: "2026-03-10", reportedBy: "PO-Santos" },
  { id: "TI-006", personId: "P-011", householdId: "HH-003", type: "Disruption", severity: "Low", description: "Sharing unverified political information on social media groups", frequency: 2, dateReported: "2026-03-12", reportedBy: "PO-Reyes" },
  { id: "TI-007", personId: "P-048", householdId: "HH-011", type: "Tension", severity: "Medium", description: "Expressing frustration about lack of employment opportunities at community meetings", frequency: 3, dateReported: "2026-03-13", reportedBy: "PO-Reyes" },
  { id: "TI-008", personId: "P-036", householdId: "HH-008", type: "Behavior Change", severity: "Low", description: "Shifting party preference after attending health sector forum organized by opposition", frequency: 2, dateReported: "2026-03-11", reportedBy: "PO-Garcia" },
];

// ===== APPRAISALS =====
export interface Appraisal {
  id: string;
  period: string;
  type: "Weekly" | "Monthly" | "Pre-Election";
  scope: string;
  status: "Completed" | "In Progress" | "Scheduled";
  date: string;
  supportPct: number;
  leaningPct: number;
  undecidedPct: number;
  opposedPct: number;
}

export const appraisals: Appraisal[] = [
  { id: "AP-001", period: "March Week 3", type: "Weekly", scope: "All Clusters", status: "In Progress", date: "2026-03-17", supportPct: 38, leaningPct: 25, undecidedPct: 20, opposedPct: 17 },
  { id: "AP-002", period: "March Week 2", type: "Weekly", scope: "All Clusters", status: "Completed", date: "2026-03-10", supportPct: 35, leaningPct: 28, undecidedPct: 22, opposedPct: 15 },
  { id: "AP-003", period: "February", type: "Monthly", scope: "All Clusters", status: "Completed", date: "2026-02-28", supportPct: 33, leaningPct: 27, undecidedPct: 25, opposedPct: 15 },
  { id: "AP-004", period: "January", type: "Monthly", scope: "All Clusters", status: "Completed", date: "2026-01-31", supportPct: 30, leaningPct: 25, undecidedPct: 28, opposedPct: 17 },
  { id: "AP-005", period: "Pre-Election Q2", type: "Pre-Election", scope: "All Clusters", status: "Scheduled", date: "2026-04-15", supportPct: 0, leaningPct: 0, undecidedPct: 0, opposedPct: 0 },
];

// ===== SPIN INTERVENTIONS =====
export interface SpinIntervention {
  id: string;
  householdId: string;
  strategy: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
  status: "Active" | "Completed" | "Pending";
  assignedTo: string;
  startDate: string;
  notes: string;
}

export const spinInterventions: SpinIntervention[] = [
  { id: "SP-001", householdId: "HH-003", strategy: "Community Dialogue", urgency: "High", status: "Active", assignedTo: "PO-Santos", startDate: "2026-03-10", notes: "Household head expressing growing dissatisfaction. Needs direct engagement." },
  { id: "SP-002", householdId: "HH-007", strategy: "Welfare Enrollment Support", urgency: "Critical", status: "Active", assignedTo: "PO-Garcia", startDate: "2026-03-12", notes: "Low-income household with no internet. Feels neglected by government programs." },
  { id: "SP-003", householdId: "HH-004", strategy: "Information Campaign", urgency: "Medium", status: "Pending", assignedTo: "PO-Santos", startDate: "2026-03-18", notes: "Teacher with strong opposition views. Influential in community." },
  { id: "SP-004", householdId: "HH-010", strategy: "Leadership Engagement", urgency: "High", status: "Active", assignedTo: "PO-Lopez", startDate: "2026-03-05", notes: "Professional with opposition leanings. Active in civic organizations." },
  { id: "SP-005", householdId: "HH-011", strategy: "Community Dialogue", urgency: "Medium", status: "Completed", assignedTo: "PO-Reyes", startDate: "2026-02-20", notes: "Successfully engaged. Moved from undecided to leaning support." },
];

// ===== VOTER TURNOUT =====
export interface PrecinctTurnout {
  precinct: string;
  barangay: string;
  registered: number;
  actual: number;
  morning: number;
  midday: number;
  afternoon: number;
}

export const precinctTurnout: PrecinctTurnout[] = [
  { precinct: "P-12A", barangay: "San Miguel", registered: 450, actual: 342, morning: 120, midday: 98, afternoon: 124 },
  { precinct: "P-05B", barangay: "Poblacion", registered: 380, actual: 298, morning: 105, midday: 88, afternoon: 105 },
  { precinct: "P-08C", barangay: "Bagong Silang", registered: 520, actual: 385, morning: 140, midday: 110, afternoon: 135 },
  { precinct: "P-15D", barangay: "Maligaya", registered: 290, actual: 195, morning: 72, midday: 55, afternoon: 68 },
  { precinct: "P-03E", barangay: "San Isidro", registered: 410, actual: 320, morning: 115, midday: 92, afternoon: 113 },
];

// ===== QUICK COUNT =====
export interface Candidate {
  name: string;
  party: string;
  votes: number;
  color: string;
}

export interface PollingStation {
  id: string;
  name: string;
  precinct: string;
  candidates: Candidate[];
  totalVotes: number;
  reported: boolean;
}

export const pollingStations: PollingStation[] = [
  { id: "PS-001", name: "San Miguel Elementary", precinct: "P-12A", totalVotes: 342, reported: true, candidates: [
    { name: "Candidate A", party: "PDP-Laban", votes: 145, color: "hsl(var(--chart-1))" },
    { name: "Candidate B", party: "Liberal", votes: 98, color: "hsl(var(--chart-2))" },
    { name: "Candidate C", party: "Nacionalista", votes: 67, color: "hsl(var(--chart-3))" },
    { name: "Candidate D", party: "Independent", votes: 32, color: "hsl(var(--chart-4))" },
  ]},
  { id: "PS-002", name: "Poblacion High School", precinct: "P-05B", totalVotes: 298, reported: true, candidates: [
    { name: "Candidate A", party: "PDP-Laban", votes: 120, color: "hsl(var(--chart-1))" },
    { name: "Candidate B", party: "Liberal", votes: 105, color: "hsl(var(--chart-2))" },
    { name: "Candidate C", party: "Nacionalista", votes: 48, color: "hsl(var(--chart-3))" },
    { name: "Candidate D", party: "Independent", votes: 25, color: "hsl(var(--chart-4))" },
  ]},
  { id: "PS-003", name: "Bagong Silang Covered Court", precinct: "P-08C", totalVotes: 385, reported: true, candidates: [
    { name: "Candidate A", party: "PDP-Laban", votes: 168, color: "hsl(var(--chart-1))" },
    { name: "Candidate B", party: "Liberal", votes: 92, color: "hsl(var(--chart-2))" },
    { name: "Candidate C", party: "Nacionalista", votes: 85, color: "hsl(var(--chart-3))" },
    { name: "Candidate D", party: "Independent", votes: 40, color: "hsl(var(--chart-4))" },
  ]},
  { id: "PS-004", name: "Maligaya Barangay Hall", precinct: "P-15D", totalVotes: 195, reported: false, candidates: [
    { name: "Candidate A", party: "PDP-Laban", votes: 0, color: "hsl(var(--chart-1))" },
    { name: "Candidate B", party: "Liberal", votes: 0, color: "hsl(var(--chart-2))" },
    { name: "Candidate C", party: "Nacionalista", votes: 0, color: "hsl(var(--chart-3))" },
    { name: "Candidate D", party: "Independent", votes: 0, color: "hsl(var(--chart-4))" },
  ]},
  { id: "PS-005", name: "San Isidro Community Center", precinct: "P-03E", totalVotes: 320, reported: true, candidates: [
    { name: "Candidate A", party: "PDP-Laban", votes: 135, color: "hsl(var(--chart-1))" },
    { name: "Candidate B", party: "Liberal", votes: 88, color: "hsl(var(--chart-2))" },
    { name: "Candidate C", party: "Nacionalista", votes: 62, color: "hsl(var(--chart-3))" },
    { name: "Candidate D", party: "Independent", votes: 35, color: "hsl(var(--chart-4))" },
  ]},
];

// ===== CLUSTER SUMMARY =====
export interface ClusterSummary {
  name: string;
  barangays: string[];
  totalHouseholds: number;
  strongSupport: number;
  leaning: number;
  undecided: number;
  opposed: number;
  riskScore: number;
  topConcerns: string[];
}

export const clusterSummaries: ClusterSummary[] = [
  { name: "Cluster 1", barangays: ["San Miguel"], totalHouseholds: 3, strongSupport: 1, leaning: 1, undecided: 0, opposed: 0, riskScore: 25, topConcerns: ["Misinformation", "Job creation"] },
  { name: "Cluster 2", barangays: ["Poblacion"], totalHouseholds: 3, strongSupport: 1, leaning: 0, undecided: 1, opposed: 1, riskScore: 65, topConcerns: ["Opposition rallies", "Governance accountability"] },
  { name: "Cluster 3", barangays: ["Bagong Silang"], totalHouseholds: 2, strongSupport: 1, leaning: 1, undecided: 0, opposed: 0, riskScore: 80, topConcerns: ["Vote-buying", "Infrastructure needs"] },
  { name: "Cluster 4", barangays: ["Maligaya"], totalHouseholds: 2, strongSupport: 0, leaning: 1, undecided: 1, opposed: 0, riskScore: 55, topConcerns: ["Service delivery", "Basic utilities"] },
  { name: "Cluster 5", barangays: ["San Isidro"], totalHouseholds: 2, strongSupport: 1, leaning: 0, undecided: 0, opposed: 1, riskScore: 45, topConcerns: ["Transparency", "Meeting participation"] },
];

// ===== ROLE DEFINITIONS =====
export interface RoleDefinition {
  id: string;
  name: string;
  slug: string;
  responsibility: string;
  accessLevel: string;
  informationLayer: string;
  accessControl: string;
  visibleModules: string[];
  dataAccess: { module: string; level: "Full" | "Read/Write" | "Read Only" | "No Access" }[];
}

export const roleDefinitions: RoleDefinition[] = [
  {
    id: "R-001", name: "Project Head", slug: "project-head",
    responsibility: "Overall supervision",
    accessLevel: "Project Management",
    informationLayer: "Full Access",
    accessControl: "User Account Suspension Authority",
    visibleModules: ["Dashboard", "Data Repository", "Political Mapping", "Threat Assessment", "Periodic Appraisal", "Terrain Mapping", "SPIN Intervention", "Voter Turnout", "Quick Count"],
    dataAccess: [
      { module: "Socio-Demographic Profile", level: "Full" },
      { module: "Social Welfare Accessing", level: "Full" },
      { module: "Political Profile", level: "Full" },
      { module: "Political Mapping", level: "Full" },
      { module: "Threat Assessment", level: "Full" },
      { module: "Periodic Appraisal", level: "Full" },
      { module: "Political Terrain Mapping", level: "Full" },
      { module: "SPIN Intervention", level: "Full" },
      { module: "Voter Turnout Monitoring", level: "Full" },
      { module: "Quick Count", level: "Full" },
    ],
  },
  {
    id: "R-002", name: "Data Management", slug: "data-management",
    responsibility: "Data Management; Multi-Division Political Operations Oversight",
    accessLevel: "Project Management",
    informationLayer: "Full Access",
    accessControl: "Operational Control",
    visibleModules: ["Dashboard", "Data Repository", "Political Mapping", "Threat Assessment", "Periodic Appraisal", "Terrain Mapping", "SPIN Intervention", "Voter Turnout", "Quick Count"],
    dataAccess: [
      { module: "Socio-Demographic Profile", level: "Full" },
      { module: "Social Welfare Accessing", level: "Full" },
      { module: "Political Profile", level: "Full" },
      { module: "Political Mapping", level: "Full" },
      { module: "Threat Assessment", level: "Full" },
      { module: "Periodic Appraisal", level: "Full" },
      { module: "Political Terrain Mapping", level: "Full" },
      { module: "SPIN Intervention", level: "Full" },
      { module: "Voter Turnout Monitoring", level: "Full" },
      { module: "Quick Count", level: "Full" },
    ],
  },
  {
    id: "R-003", name: "Political Officers", slug: "political-officers",
    responsibility: "Division Political Operation Oversight",
    accessLevel: "Restricted Reference",
    informationLayer: "Division",
    accessControl: "Read/Write (with admin approval)",
    visibleModules: ["Dashboard", "Data Repository", "Political Mapping", "Threat Assessment", "Periodic Appraisal", "Terrain Mapping", "SPIN Intervention", "Voter Turnout", "Quick Count"],
    dataAccess: [
      { module: "Socio-Demographic Profile", level: "Read/Write" },
      { module: "Social Welfare Accessing", level: "Read/Write" },
      { module: "Political Profile", level: "Read/Write" },
      { module: "Political Mapping", level: "Read/Write" },
      { module: "Threat Assessment", level: "Read/Write" },
      { module: "Periodic Appraisal", level: "Read/Write" },
      { module: "Political Terrain Mapping", level: "Read/Write" },
      { module: "SPIN Intervention", level: "Read/Write" },
      { module: "Voter Turnout Monitoring", level: "Read/Write" },
      { module: "Quick Count", level: "Read/Write" },
    ],
  },
  {
    id: "R-004", name: "Local Community Organizers", slug: "community-organizers",
    responsibility: "Political Operation at the Division Level",
    accessLevel: "Restricted Reference",
    informationLayer: "Division",
    accessControl: "Read Only",
    visibleModules: ["Dashboard", "Data Repository", "Political Mapping", "Threat Assessment", "Periodic Appraisal", "Terrain Mapping"],
    dataAccess: [
      { module: "Socio-Demographic Profile", level: "Read Only" },
      { module: "Social Welfare Accessing", level: "Read Only" },
      { module: "Political Profile", level: "Read Only" },
      { module: "Political Mapping", level: "Read Only" },
      { module: "Threat Assessment", level: "Read Only" },
      { module: "Periodic Appraisal", level: "Read Only" },
      { module: "Political Terrain Mapping", level: "Read Only" },
      { module: "SPIN Intervention", level: "No Access" },
      { module: "Voter Turnout Monitoring", level: "No Access" },
      { module: "Quick Count", level: "No Access" },
    ],
  },
  {
    id: "R-005", name: "Team Lead", slug: "team-lead",
    responsibility: "Political Operation at Section Level",
    accessLevel: "Open Data",
    informationLayer: "Section",
    accessControl: "Read Only",
    visibleModules: ["Dashboard", "Data Repository"],
    dataAccess: [
      { module: "Socio-Demographic Profile", level: "Read Only" },
      { module: "Social Welfare Accessing", level: "No Access" },
      { module: "Political Profile", level: "No Access" },
      { module: "Political Mapping", level: "No Access" },
      { module: "Threat Assessment", level: "No Access" },
      { module: "Periodic Appraisal", level: "No Access" },
      { module: "Political Terrain Mapping", level: "No Access" },
      { module: "SPIN Intervention", level: "No Access" },
      { module: "Voter Turnout Monitoring", level: "No Access" },
      { module: "Quick Count", level: "No Access" },
    ],
  },
];