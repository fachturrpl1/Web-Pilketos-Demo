"use client"

import React from "react"
import Image, { ImageProps } from "next/image"

function getHostname(url?: string | null): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

const allowedHosts = new Set<string>([
  "smansara.com",
  "images.unsplash.com",
  "via.placeholder.com",
  "placehold.co",
  "i.imgur.com",
  "images.pexels.com",
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
  "cdn.discordapp.com",
  "media.licdn.com",
  "pbs.twimg.com",
])

export type ExternalImageProps = Omit<ImageProps, "src"> & {
  src: string
  fallbackClassName?: string
}

export function ExternalImage({ src, alt, className, fallbackClassName, ...rest }: ExternalImageProps) {
  const host = getHostname(src)
  const isAllowed = host ? Array.from(allowedHosts).some(h => host === h || host.endsWith(`.${h}`)) : false

  if (!isAllowed) {
    return (
      <img
        src={src}
        alt={alt as string}
        className={fallbackClassName || className}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      {...rest}
    />
  )
}




