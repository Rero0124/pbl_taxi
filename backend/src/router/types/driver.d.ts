interface UserIdParam {
  id: string;
}

interface SendMessageBody {
  userIds: string[];
  message: any;
  messageType: string;
}