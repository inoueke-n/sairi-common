import * as zlib from "zlib";
import { promisify } from "util";

type Compressor = (buf: Buffer) => Promise<Buffer>;
type Decompressor = (buf: Buffer) => Promise<Buffer>;

export namespace sairiCompress {
  export const compress: Compressor = async (buf) => {
    const brotliCompressAsync = promisify(zlib.brotliCompress);
    const compressed = await brotliCompressAsync(buf);
    return compressed;
  };

  export const decompress: Decompressor = async (buf) => {
    const brotliDecompressAsync = promisify(zlib.brotliDecompress);
    const decompressed = brotliDecompressAsync(buf);
    return decompressed;
  };
}
