import zlib
import struct
from pathlib import Path


def write_png(path, size, color):
    width = height = size
    pixels = bytes([color[0], color[1], color[2]] * width * height)

    def png_chunk(chunk_type, data):
        return struct.pack(
            ">I", len(data)
        ) + chunk_type + data + struct.pack(
            ">I", zlib.crc32(chunk_type + data) & 0xFFFFFFFF
        )

    png = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(
        ">IIBBBBB",
        width,
        height,
        8,
        2,
        0,
        0,
        0,
    )
    png += png_chunk(b"IHDR", ihdr)

    raw = b"".join(
        b"\x00" + pixels[i : i + width * 3]
        for i in range(0, len(pixels), width * 3)
    )
    png += png_chunk(b"IDAT", zlib.compress(raw, 9))
    png += png_chunk(b"IEND", b"")

    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)


if __name__ == "__main__":
    root = Path("public/icons")
    write_png(root / "icon-180x180.png", 180, (234, 179, 8))
    write_png(root / "icon-192x192.png", 192, (234, 179, 8))
    write_png(root / "icon-512x512.png", 512, (234, 179, 8))
    print("created", [str(root / f) for f in [
        "icon-180x180.png",
        "icon-192x192.png",
        "icon-512x512.png",
    ]])