export interface Player {
  uuid: string;
  name: string;
  pic: string;
  guess?: number;
  won: boolean;
}
