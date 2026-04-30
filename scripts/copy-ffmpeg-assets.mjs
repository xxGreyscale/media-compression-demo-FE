import { cp, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(scriptDirectory, '..')
const publicFfmpegDirectory = resolve(workspaceRoot, 'public', 'ffmpeg')

const assetPairs = [
  {
    source: resolve(workspaceRoot, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm', 'ffmpeg-core.js'),
    destination: resolve(publicFfmpegDirectory, 'ffmpeg-core.js'),
  },
  {
    source: resolve(workspaceRoot, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm', 'ffmpeg-core.wasm'),
    destination: resolve(publicFfmpegDirectory, 'ffmpeg-core.wasm'),
  },
]

await mkdir(publicFfmpegDirectory, { recursive: true })

await Promise.all(
  assetPairs.map(({ source, destination }) => cp(source, destination))
)