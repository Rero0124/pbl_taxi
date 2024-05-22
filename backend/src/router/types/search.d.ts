interface UserIdParam {
  id: string
}

interface LocateQuery {
  x: string;
  y: string;
}

interface SearchResult {
  userId: string,
  geom: string,
  distance: number,
  inward: boolean,
  quickly: boolean,
  song: boolean,
  point: number,
  songName: string | null
}

interface MatchAddress {
  start: AddressType;
  end: AddressType;
}

interface MatchDriverBody {
  driverId: string;
  address: MatchAddress;
}