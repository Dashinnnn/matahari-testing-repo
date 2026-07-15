// components/FormFields.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const radioStyle = { borderWidth: '1px', borderColor: '#2362EA' } as const

export function FullNameFields({
  lastName, firstName, middleName, onChange
}: {
  lastName: string; firstName: string; middleName: string
  onChange: (field: 'lastName' | 'firstName' | 'middleName', value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">FULL NAME</Label>
      <div className="grid grid-cols-3 gap-3">
        <Input placeholder="LAST NAME/" value={lastName} onChange={e => onChange('lastName', e.target.value)} />
        <Input placeholder="FIRST NAME/" value={firstName} onChange={e => onChange('firstName', e.target.value)} />
        <Input placeholder="MIDDLE NAME/" value={middleName} onChange={e => onChange('middleName', e.target.value)} />
      </div>
    </div>
  )
}

export function DobField({ value, onChange }: { value: Date | undefined; onChange: (d: Date | undefined) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">Date of birth</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-auto justify-start text-left font-normal", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function GenderField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">Gender</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto"><SelectValue placeholder="Select a gender" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function EducationField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">Educational Attainment</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto"><SelectValue placeholder="Select an Educational Attainment" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="High School">High School</SelectItem>
          <SelectItem value="Elementary">Elementary</SelectItem>
          <SelectItem value="Vocational">Vocational</SelectItem>
          <SelectItem value="Graduate/Post-graduate">Graduate/Post-graduate</SelectItem>
          <SelectItem value="No Formal Education">No Formal Education</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function EmploymentField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">Employment Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto"><SelectValue placeholder="Select an Employment Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Employed">Employed</SelectItem>
          <SelectItem value="Unemployed">Unemployed</SelectItem>
          <SelectItem value="Self-Employed">Self-Employed</SelectItem>
          <SelectItem value="Student">Student</SelectItem>
          <SelectItem value="Retired">Retired</SelectItem>
          <SelectItem value="Homemaker">Homemaker</SelectItem>
          <SelectItem value="Disabled">Disabled</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function VoterRadio({ value, onChange, idPrefix }: {
  value: string; onChange: (v: string) => void; idPrefix: string
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Label className="text-sm font-medium text-gray-700">Register Voter?</Label>
      <RadioGroup className="flex flex-row gap-15" value={value} onValueChange={onChange}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id={`${idPrefix}-voter-yes`} className="border-[#2362EA] text-[#2362EA]" style={radioStyle} />
          <Label htmlFor={`${idPrefix}-voter-yes`} className="cursor-pointer">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`${idPrefix}-voter-no`} className="border-[#2362EA] text-[#2362EA]" style={radioStyle} />
          <Label htmlFor={`${idPrefix}-voter-no`} className="cursor-pointer">No</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

export function CivilStatusField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">Civil Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto"><SelectValue placeholder="Select a civil status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Single">Single</SelectItem>
          <SelectItem value="Married">Married</SelectItem>
          <SelectItem value="Widowed">Widowed</SelectItem>
          <SelectItem value="Separated">Separated</SelectItem>
          <SelectItem value="Divorced">Divorced</SelectItem>
          <SelectItem value="Annulled">Annulled</SelectItem>
          <SelectItem value="Common-law">Common-law</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function RelationToHeadField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">Relation to Head</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto"><SelectValue placeholder="Select relation" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Son">Son</SelectItem>
          <SelectItem value="Daughter">Daughter</SelectItem>
          <SelectItem value="Grandchild">Grandchild</SelectItem>
          <SelectItem value="Nephew">Nephew</SelectItem>
          <SelectItem value="Niece">Niece</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// ── Shared type & factory ──────────────────────────────────────
export type PersonFields = {
  lastName: string; firstName: string; middleName: string
  dob: Date | undefined
  gender: string
  civilStatus?: string  // optional — only used on page 1
  registeredVoter: string
  relationToHead?: string
  education: string; employment: string; job: string
}

export const emptyPerson = (): PersonFields => ({
  lastName: "", firstName: "", middleName: "",
  dob: undefined,
  gender: "",
  civilStatus: "",
  registeredVoter: "",
  relationToHead: "",
  education: "", employment: "", job: "",
})

// ── Composite block used on pages 1, 2, and each child card ───
export function PersonFormBlock({
  value, onChange, idPrefix, showPicture = true, showCivilStatus = false, showVoterAndContact = false, showRelationToHead = false
}: {
  value: PersonFields
  onChange: (field: keyof PersonFields, val: string | Date | undefined) => void
  idPrefix: string
  showPicture?: boolean
  showCivilStatus?: boolean
  showVoterAndContact?: boolean
  showRelationToHead?: boolean
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <FullNameFields
        lastName={value.lastName} firstName={value.firstName} middleName={value.middleName}
        onChange={(f, v) => onChange(f, v)}
      />
      {showPicture && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Picture (Optional)</Label>
          <Input type="file" accept="image/*" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <DobField value={value.dob} onChange={d => onChange('dob', d)} />
        <GenderField value={value.gender} onChange={v => onChange('gender', v)} />

        {/* Only shown on page 1 */}
        {showCivilStatus && (
          <CivilStatusField value={value.civilStatus ?? ""} onChange={v => onChange('civilStatus', v)} />
        )}

        <EducationField value={value.education} onChange={v => onChange('education', v)} />
        <EmploymentField value={value.employment} onChange={v => onChange('employment', v)} />
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Job</Label>
          <Input placeholder="Occupation" value={value.job} onChange={e => onChange('job', e.target.value)} />
        </div>
      </div>
      {showVoterAndContact && (
        <VoterRadio value={value.registeredVoter} onChange={v => onChange('registeredVoter', v)} idPrefix={idPrefix} />
      )}

      {showRelationToHead && (
        <RelationToHeadField value={value.relationToHead ?? ""} onChange={v => onChange('relationToHead', v)} />
      )}
    </div>
  )
}