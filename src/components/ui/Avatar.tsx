import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  if (!src) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
      height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
      className={`${sizes[size]} rounded-full object-cover`}
    />
  )
}

