type AvatarProps = {
  src: string;
  alt?: string;
  size?: number; // 可选大小，默认 32px
};

export const Avatar = ({ src, alt = 'avatar', size = 24 }: AvatarProps) => {
  return <img src={src} alt={alt} className="rounded-full shrink-0" style={{ width: size, height: size }} />;
};
