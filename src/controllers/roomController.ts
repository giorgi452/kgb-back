import { rooms } from "../utils/variables";
export const createRoom = (req: Request, res: any) => {
  const roomId = Math.random().toString(36).substring(2, 8);
  rooms[roomId] = { players: [], started: false };
  res.json({ roomId });
}
