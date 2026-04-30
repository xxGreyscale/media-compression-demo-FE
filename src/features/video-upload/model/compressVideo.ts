import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

const ffmpeg = new FFmpeg()

let ffmpegLoadPromise: Promise<FFmpeg> | null = null

function getPublicAssetUrl(path: string) {
    console.log(`Getting public asset URL for: ${path}`)
    console.log(`Base URL from environment: ${import.meta.env.BASE_URL}`)
    console.log(`Current location: ${globalThis.location.href}`)
  return new URL(`${import.meta.env.BASE_URL}${path}`, globalThis.location.href).toString()
}

async function ensureFfmpegLoaded() {
  if (!ffmpegLoadPromise) {
    ffmpeg.on('log', ({ type, message }) => {
      console.log(`[FFmpeg ${type}] ${message}`)
    })

    ffmpegLoadPromise = (async () => {
      try {
        const coreURL = getPublicAssetUrl('ffmpeg/ffmpeg-core.js')
        const wasmURL = getPublicAssetUrl('ffmpeg/ffmpeg-core.wasm')

        await ffmpeg.load({ coreURL, wasmURL })

        return ffmpeg
      } catch (error) {
        ffmpegLoadPromise = null

        throw new Error(
          'Failed to load local FFmpeg assets. Run the build first so public/ffmpeg files are available.',
          { cause: error }
        )
      }
    })()
  }

  return ffmpegLoadPromise
}

function createCompressedFileName(fileName: string) {
  const extensionIndex = fileName.lastIndexOf('.')

  if (extensionIndex <= 0) {
    return `${fileName}-compressed`
  }

  const baseName = fileName.slice(0, extensionIndex)
  const extension = fileName.slice(extensionIndex)

  return `${baseName}-compressed${extension}`
}

export async function compressVideo(file: File) {
  const inputName = file.name

  const ffmpeg = await ensureFfmpegLoaded()
  console.log('FFmpeg loaded successfully, starting to write file to virtual FS:', inputName)

  if (ffmpeg == null) {
    throw new Error('FFmpeg instance is not available after loading.')
  }

  await ffmpeg.writeFile(inputName, await fetchFile(file))

  // Replace this read-back placeholder with ffmpeg.exec(...) when you add real compression.
  const data = await ffmpeg.readFile(inputName)

  console.log('Simulated compression - original file bytes:', data)
  await ffmpeg.deleteFile(inputName)

  if (typeof data === 'string') {
    throw new TypeError('Expected binary video data from ffmpeg.')
  }

  const outputBytes = new Uint8Array(data.byteLength)
  console.log('Simulated compression - output file bytes before set:', outputBytes)
  outputBytes.set(data)

  return new File([outputBytes], createCompressedFileName(file.name), {
    type: file.type,
    lastModified: Date.now(),
  })
}