interface UserParams {
  id: string;
}

interface UserCreateBody {
  id: string;
  pw: string;
  name?: string;
  phone: number;
  email?: string;
}

interface UserTendencyBody {
  inward: number | 0;
  quickly: number | 0;
  song: number | 0;
  songName: string | null;
}

interface UserLocateBody {
  x: number;
  y: number;
}

interface UserChangePasswordBody {
  pw: string;
  npw: string;
}

interface TargetUserBody {
  userId: string;
}

interface RateUserBody {
  userId: string;
  rate: number;
}