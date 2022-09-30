import Chunk from "@/types/Chunk";
import Substore from "../Substore";

export default class ChunkModalStore extends Substore {
  chunk: Chunk | undefined = undefined;
}
