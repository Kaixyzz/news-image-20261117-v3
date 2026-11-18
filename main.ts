import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The Day in Six Headlines: the entry is a single image file.
// Place an unchanged copy of it in the directory make.fun asks for.
async function placeImage(): Promise<void> {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = resolve(here, "entry.png");
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(outDir, "entry.png");
  await mkdir(outDir, { recursive: true });
  await copyFile(source, target);
  const [srcStat, dstStat] = await Promise.all([stat(source), stat(target)]);
  if (srcStat.size === 0 || srcStat.size !== dstStat.size) {
    throw new Error("entry.png copy is incomplete");
  }
}

await placeImage();
