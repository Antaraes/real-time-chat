import { LucideProps, UserPlus } from "lucide-react";
import Image from "next/image";
export const Icons = {
  Logo: (props: LucideProps) => <p className="text-black text-8xl">LOGO</p>,
  UserPlus,
};

export type Icon = keyof typeof Icons;
