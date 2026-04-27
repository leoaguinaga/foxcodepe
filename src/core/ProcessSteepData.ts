import SearchIcon from "@/assets/icons/search.svg?url";
import CodeIcon from "@/assets/icons/code.svg?url";
import ScrewdriverIcon from "@/assets/icons/screwdriver.svg?url";
import RocketIcon from "@/assets/icons/rocket.svg?url";

export interface ProcessStepData {
    icon: string;
    title: string;
    description: string;
}

export const processData: ProcessStepData[] = [
    {
        icon: SearchIcon,
        title: "Investigación y análisis",
        description: "Comprendemos las necesidades del cliente y el mercado para definir los requisitos del proyecto."
    },
    {
        icon: CodeIcon,
        title: "Diseño y prototipado",
        description: "Creamos diseños y prototipos interactivos para visualizar la solución antes del desarrollo."
    },
    {
        icon: ScrewdriverIcon,
        title: "Desarrollo ágil",
        description: "Utilizamos metodologías ágiles para desarrollar el software de manera iterativa y colaborativa."
    },
    {
        icon: RocketIcon,
        title: "Lanzamiento y soporte",
        description: "Implementamos la solución y ofrecemos soporte continuo para asegurar su éxito."
    }
]
