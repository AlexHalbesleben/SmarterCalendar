import Chunk from "./Chunk";

export default class UserTask {
  name = "";
  duration = 60;
  chunks = 1;
  due: Date = new Date();

  _chunks: Chunk[] = [];
}
