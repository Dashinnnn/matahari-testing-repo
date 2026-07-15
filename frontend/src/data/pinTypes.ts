export interface PinData {
  id: string;
  lat: string;
  lng: string;
  label: string;
}

export interface PinGroup {
  id: string;
  header: string;
  color: string;
  pins: PinData[];
}

export const GROUP_COLORS = ['#EF4444', '#22C55E'] as const; // red, green

export const createPin = (): PinData => ({
  id: crypto.randomUUID(),
  lat: '',
  lng: '',
  label: '',
});

export const createGroup = (_colorIndex: number): PinGroup => ({
  id: crypto.randomUUID(),
  header: '',
  color: '#EF4444', // default red
  pins: [createPin()],
});
