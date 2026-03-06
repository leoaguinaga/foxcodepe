import PhotoAnderson from "@/assets/images/staff/photo-anderson.png";
import PhotoDanfer from "@/assets/images/staff/photo-danfer.png";
import PhotoDaniel from "@/assets/images/staff/photo-daniel.jpg";
import PhotoLeonardo from "@/assets/images/staff/photo-leonardo.png";
import PhotoSandro from "@/assets/images/staff/photo-sandro.png";

export interface StaffMember {
    name: string;
    role: string;
    role2: string | null;
    imageUrl: string;
    href: string;
}

export const staffMembers: StaffMember[] = [
    {
        name: "Anderson Zapata",
        role: "Desarrollador Full Stack",
        role2: "Co-Founder",
        imageUrl: PhotoAnderson.src,
        href: "#",
    },
    {
        name: "Danfer Pérez",
        role: "Diseñador UI/UX",
        role2: "Co-Founder",
        imageUrl: PhotoDanfer.src,
        href: "#",
    },
    {
        name: "Daniel Sánchez",
        role: "Desarrollador Full Stack",
        role2: "Co-Founder",
        imageUrl: PhotoDaniel.src,
        href: "#",
    },
    {
        name: "Leonardo Aguinaga",
        role: "Desarrollador Full Stack",
        role2: "Co-Founder",
        imageUrl: PhotoLeonardo.src,
        href: "#",
    },
    // {
    //     name: "Sandro Fatticcioni",
    //     role: "Diseñador Gráfico",
    //     role2: null,
    //     imageUrl: PhotoSandro.src,
    //     href: "#",
    // }
];