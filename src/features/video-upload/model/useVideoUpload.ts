import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { compressVideo } from './compressVideo'

export function useVideoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [durationInSeconds, setDurationInSeconds] = useState<number | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionError, setCompressionError] = useState<string | null>(null)

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null
    }

    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null

    setSelectedFile(file)
    setDurationInSeconds(null)
    setCompressedFile(null)
    setCompressionError(null)
  }

  const onPreviewLoaded = (duration: number) => {
    setDurationInSeconds(duration)
  }

  const compressSelectedVideo = async () => {
    if (!selectedFile || isCompressing) {
      return
    }

    setIsCompressing(true)
    setCompressionError(null)

    try {
        console.log('Starting compression for file:', selectedFile.name, 'size:', selectedFile.size)
      const nextCompressedFile = await compressVideo(selectedFile)
      console.log('Compression completed for file:', selectedFile.name, 'compressed size:', nextCompressedFile.size)
      setCompressedFile(nextCompressedFile)
    } catch (error) {
      setCompressedFile(null)
      setCompressionError(error instanceof Error ? error.message : 'Compression failed.')
    } finally {
      setIsCompressing(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setDurationInSeconds(null)
    setCompressedFile(null)
    setCompressionError(null)
  }

  return {
    selectedFile,
    previewUrl,
    durationInSeconds,
    compressedFile,
    isCompressing,
    compressionError,
    onFileSelect,
    onPreviewLoaded,
    compressSelectedVideo,
    clearSelection,
  }
}
