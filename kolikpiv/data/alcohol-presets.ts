export interface AlcoholPreset {
  id: string;
  label: string;
  volumeMl: number;
  abv: number;
}

export const ALCOHOL_PRESETS: AlcoholPreset[] = [
  { id: "pivo-10", label: "Pivo 10° (0.5l)", volumeMl: 500, abv: 4.0 },
  { id: "pivo-12", label: "Pivo 12° (0.5l)", volumeMl: 500, abv: 5.0 },
  { id: "vino", label: "Víno (2 dcl)", volumeMl: 200, abv: 12.0 },
  { id: "panak", label: "Panák 40%", volumeMl: 40, abv: 40.0 },
  { id: "gin-tonic", label: "Gin tonic", volumeMl: 200, abv: 5.5 },
  { id: "prosecco", label: "Prosecco (1.5 dcl)", volumeMl: 150, abv: 11.0 },
  { id: "cider", label: "Cider (0.5l)", volumeMl: 500, abv: 4.5 },
];
