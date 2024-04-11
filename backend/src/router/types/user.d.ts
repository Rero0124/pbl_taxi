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
  inward: boolean;
  quickly: boolean;
  song: boolean;
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