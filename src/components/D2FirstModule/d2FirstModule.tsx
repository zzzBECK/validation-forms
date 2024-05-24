import { formatValue } from "@/helpers/formatValue";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
    item1: z.array(z.string()),
    item2: z.array(z.string()),
    item3: z.array(z.string()),
    item4: z.array(z.string()),
    item5: z.array(z.string()),
    item6: z.array(z.string()),
    item7: z.array(z.string()),
    item8: z.array(z.string()),
    item9: z.array(z.string()),
    item10: z.array(z.string()),
    item11: z.array(z.string()),
    item12: z.array(z.string()),
    item13: z.array(z.string()),
    item14: z.array(z.string()),
    item15: z.array(z.string()),
    item16: z.array(z.string()),
    item17: z.array(z.string()),
    excludeItems: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const items: Record<string, { title: string; data: string[] }> = {
    item1: {
        title: "Apresenta os tópicos para a formatação do curso",
        data: [
            "1.1- Título do curso",
            "1.2- Carga Horária (encontros coletivos presenciais e atividades diversificadas)",
            "1.3- Modalidade",
            "1.4- Objetivo Geral",
            "1.5- Objetivos de Aprendizagem e Desenvolvimento Profissional",
            "1.6- Fundamentação Teórica",
            "1.7- Estratégias Metodológicas",
            "1.8- Formas de avaliação e certificação",
            "1.9- Instituição, entidade ou equipe responsável pela formação",
            "1.10- Produtos Finais",
            "1.11- Cronograma",
        ],
    },
    item2: {
        title: "Experiência em alfabetização e letramento",
        data: [
            "2.1- Atuação em turmas de 1° e 2° anos do Ensino Fundamental",
            "2.2- Cursos e extensão e/ou pós-graduação em alfabetização e letramento",
            "2.3- Não apresenta experiência em alfabetização e letramento",
        ],
    },
    item3: {
        title: "Objetivo geral",
        data: [
            "3.1- Apresenta clareza e alinhamento às diretrizes do Compromisso Nacional Criança Alfabetizada",
            "3.2- Sinaliza a organização do percurso a partir das demandas e necessidades do público-alvo",
            "3.3- Sinaliza a articulação teórica com a ação crítica e reflexiva sobre a prática cotidiana",
            "3.4- Sinaliza o reconhecimento dos direitos de aprendizagem do estudante",
            "3.5- Sinaliza o papel do professor como mediador desse processo",
            "3.6- Sinaliza a intencionalidade pedagógica como tomada de decisão fundamental na mobilização dos saberes",
        ],
    },
    item4: {
        title: "Objetivos de aprendizagem",
        data: [
            "4.1- Os objetivos de aprendizagem preveem a apropriação e a ressignificação dos saberes sobre a alfabetização a partir de situações didáticas reflexivas sobre a prática cotidiana dos profissionais da educação",
            "4.2- Indicam objetivos de aprendizagem que contemplam a reflexão sobre: O caráter discursivo e enunciativo da língua",
            "4.3- Indicam objetivos de aprendizagem que contemplam a reflexão sobre: A função social da leitura e da escrita",
            "4.4- Indicam objetivos de aprendizagem que contemplam a reflexão sobre: A compreensão da multidimensionalidade do processo de alfabetização: linguística, cognitiva, sociocultural, afetiva e tecnológica",
            "4.5- Indicam objetivos de aprendizagem que contemplam a reflexão sobre: O reconhecimento e compromisso ético-político para o enfretamento e proposições para superar questões relativas ao racismo, a aporofobia e ao capacitismo",
            "4.6-  Indicam os objetivos de aprendizagem das unidades temáticas ou módulos",
        ],
    },
    item5: {
        title:
            "Apresenta ampliação do repertório como elemento estruturante da reflexão crítica e do aprofundamento da consciência profissional",
        data: [
            "5.1- Apresenta pesquisas no âmbito da alfabetização e letramento: Em Educação",
            "5.2- Apresenta pesquisas no âmbito da alfabetização e letramento: Desenvolvidas no Território",
            "5.3- Apresenta pesquisas no âmbito da alfabetização e letramento: Em áreas afins: Linguística, Psicologia, entre outras",
            "5.4- Apresenta pesquisas no âmbito da alfabetização e letramento: Em áreas afins: No âmbito nacional",
            "5.5- Apresenta pesquisas no âmbito da alfabetização e letramento: Em áreas afins: No âmbito internacional",
            "5.6- Apresenta revisão teórica e pesquisas anteriores relacionadas ao tema",
            "5.7- Inclui debates e tendências na área",
            "5.8- Apresenta evidências ou pesquisas que subsidiam as teorias e/ou conceitos abordados",
            "5.8- Apresenta pesquisas sobre a alfabetização na perspectiva do letramento no contexto inclusivo, no âmbito da: Educação Especial",
            "5.9- Apresenta pesquisas sobre a alfabetização na perspectiva do letramento no contexto inclusivo, no âmbito da: Educação do Campo",
            "5.10- Apresenta pesquisas sobre a alfabetização na perspectiva do letramento no contexto inclusivo, no âmbito da: Educação Indígena",
        ],
    },
    item6: {
        title: "Apresenta coerência",
        data: [
            "6.1- Premissas epistemológicas do processo de alfabetização do CNCA",
            "6.2- Diretrizes Nacionais da Educação Básica",
            "6.3- Diretrizes curriculares do território",
        ],
    },
    item7: {
        title:
            "Apresenta a diversidade de abordagens teóricas em alfabetização e letramento",
        data: [
            "7.1- Apresenta histórico sobre o conceito de alfabetização e embasamento teórico das metodologias de ensino",
            "7.2- Fundamenta a escolha epistemológica que embasa os processos de alfabetização",
            "7.3- Apresenta e compara as definições de literacia, letramento e multiletramentos",
            "7.4- Apresenta reflexões e proposições sobre a alfabetização, na perspectiva do letramento, no contexto inclusivo, no âmbito da: Educação Especial",
            "7.5- Apresenta reflexões e proposições sobre a alfabetização, na perspectiva do letramento, no contexto inclusivo, no âmbito da: Educação do Campo",
            "7.6- Apresenta reflexões e proposições sobre a alfabetização, na perspectiva do letramento, no contexto inclusivo, no âmbito da: Educação Indígena",
        ],
    },
    item8: {
        title:
            "Aponta as concepções sobre o papel do professor e do estudante no processo de ensino e aprendizagem",
        data: [
            "8.1- Papel protagonista do professor",
            "8.2- Papel ativo do estudante, sujeito cognoscente",
            "8.3- Relação dialógica entre professor e estudante",
            "8.4- Outras concepções sobre o papel do professor e do estudante e relação pedagógica",
        ],
    },
    item9: {
        title:
            "Apresenta e analisa os tipos de avaliações e fundamenta a correlação de cada uma com as tomadas de decisões pedagógicas",
        data: [
            "9.1- Diagnóstica",
            "9.2- Somativa ou classificatória",
            "9.3- Formativa ou qualitativa",
            "9.4- Autoavaliação",
        ],
    },
    item10: {
        title:
            "Reconhece os níveis de avaliação educacional e prevê o uso dos resultados como base para a reorganização dos objetivos de ensino e aprendizagem",
        data: [
            "10.1- Avaliação da aprendizagem",
            "10.2- Avaliação institucional",
            "10.3- Avaliação de larga escala",
        ],
    },
    item11: {
        title: "Coerência dos conteúdos",
        data: [
            "11.1- Apresentam coerência com os objetivos (Geral e de Aprendizagem)",
            "11.2- Apresentam coerência com a fundamentação teórica",
            "11.3- Apresentam coerência sistêmica com a proposta curricular e diretrizes estabelecidas pela rede de ensino",
        ],
    },
    item12: {
        title: "Organização dos conteúdos",
        data: [
            "12.1- Organizado em módulos e unidades",
            "12.2- Apresentam adequação à carga horária total",
            "12.3- Prevê uma distribuição equitativa",
        ],
    },
    item13: {
        title: "Conteúdos selecionados estão alinhados",
        data: [
            "13.1- As premissas epistemológicas do processo de alfabetização do CNCA",
            "13.2- As Diretrizes Nacionais da Educação Básica",
            "13.3- As Diretrizes curriculares do território",
        ],
    },
    item14: {
        title:
            "Os conteúdos contemplam as concepções de alfabetização e letramento",
        data: [
            "14.1- Indicam o reconhecimento da alfabetização como direito constituído para todos os estudantes numa perspectiva inclusiva",
            "14.2- Indicam o reconhecimento que toda criança é capaz de aprender. Entende o estudante como um sujeito cognoscente e deve ser apoiado em suas necessidades",
            "14.3- Indicam o reconhecimento da alfabetização como processo discursivo e de caráter enunciativo",
            "14.4- Indicam o reconhecimento dos aspectos centrais no processo de ensino e aprendizagem: afetividade",
            "14.5- Indicam o reconhecimento dos aspectos centrais no processo de ensino e aprendizagem: ludicidade",
            "14.6- Indicam o reconhecimento dos aspectos centrais no processo de ensino e aprendizagem: intencionalidade pedagógica",
        ],
    },
    item15: {
        title: "Os conteúdos elencados contemplam as temáticas",
        data: [
            "15.1- Práticas de linguagem: Oralidade, Leitura e escuta, Escrita/produção de texto, Análise linguística/semiótica",
            "15.2- Compreensão do Sistema de Escrita Alfabética",
            "15.3- Compreensão da Consciência Fonológica",
            "15.4- Sinalizam a apropriação da leitura e da escrita atrelado ao uso competente nas práticas sociais e a diversidade de gêneros discursivos",
            "15.5- A formação de leitor competente, a mobilização das estratégias cognitivas de leitura: objetiva, inferencial e avaliativa",
            "15.6- A escrita/produção de textos orais e escritos",
            "15.7- A análise linguística/semiótica: Reflexões conceituais e didáticas a partir da perspectiva dos multiletramentos",
            "15.8- Preveem articulação conceitual e práticas pedagógicas entre a alfabetização, letramento e ludicidade",
            "15.9- Abordam questões sobre a identidade, necessidades e características linguístico-culturais de crianças que não têm o português como língua materna",
            "15.10- Preveem reflexões e proposições sobre a alfabetização e letramento no contexto inclusivo, no âmbito da: Educação Especial",
            "15.11- Preveem reflexões e proposições sobre a alfabetização e letramento no contexto inclusivo, no âmbito da: Educação do Campo",
            "15.12- Preveem reflexões e proposições sobre a alfabetização e letramento no contexto inclusivo, no âmbito da: Educação Indígena",
        ],
    },
    item16: {
        title:
            "Os conteúdos contemplam a temática da avaliação e fundamenta a correlação de cada uma com as tomadas de decisões pedagógicas",
        data: [
            "16.1- Diagnóstica",
            "16.2- Somativa ou classificatória",
            "16.3- Formativa ou qualitativa",
            "16.4- Autoavaliação",
        ],
    },
    item17: {
        title:
            "Apresentam os níveis de avaliação educacional e preveem o uso dos resultados como base para a reorganização dos objetivos de ensino e aprendizagem",
        data: [
            "17.1- Avaliação da aprendizagem",
            "17.2- Avaliação institucional",
            "17.3- Avaliação de larga escala",
        ],
    },
};

const calculateScore = (
    itemName: keyof FormData,
    selectedOptions: string[]
) => {
    switch (itemName) {
        case "item1":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length <= 4) return 0.25;
            if (selectedOptions.length <= 7) return 0.5;
            if (selectedOptions.length < 11) return 0.75;
            if (selectedOptions.length === 11) return 1;
            return 0;
        case "item2":
            if (
                selectedOptions.includes(
                    "2.3- Não apresenta experiência em alfabetização e letramento"
                )
            )
                return 0;
            if (selectedOptions.length === 1) return 0.75;
            if (selectedOptions.length === 2) return 1;
            return 0;
        case "item3":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length <= 2) return 0.25;
            if (selectedOptions.length <= 3) return 0.5;
            if (selectedOptions.length <= 5) return 0.75;
            if (selectedOptions.length === 6) return 1;
            return 0;
        case "item4":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length <= 2) return 0.25;
            if (selectedOptions.length <= 3) return 0.5;
            if (selectedOptions.length <= 5) return 0.75;
            if (selectedOptions.length === 6) return 1;
            return 0;
        case "item5":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length <= 3) return 0.25;
            if (selectedOptions.length <= 6) return 0.5;
            if (selectedOptions.length < 10) return 0.75;
            if (selectedOptions.length === 10) return 1;
            return 0;
        case "item6":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 2) return 0.75;
            if (
                selectedOptions.includes(
                    "6.1- Premissas epistemológicas do processo de alfabetização do CNCA"
                )
            )
                return 0.5;
            if (selectedOptions.length === 3) return 1;
            return 0;
        case "item7":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length <= 2) return 0.25;
            if (selectedOptions.length <= 3) return 0.5;
            if (selectedOptions.length < 6) return 0.75;
            if (selectedOptions.length === 6) return 1;
            return 0;
        case "item8":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.25;
            if (selectedOptions.length <= 2) return 0.5;
            if (selectedOptions.length <= 3) return 0.75;
            if (selectedOptions.length === 4) return 1;
            return 0;
        case "item9":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.25;
            if (selectedOptions.length <= 2) return 0.5;
            if (selectedOptions.length <= 3) return 0.75;
            if (selectedOptions.length === 4) return 1;
            return 0;
        case "item10":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length === 2) return 0.75;
            if (selectedOptions.length === 3) return 1;
            return 0;
        case "item11":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length === 2) return 0.75;
            if (selectedOptions.length === 3) return 1;
            return 0;
        case "item12":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length === 2) return 0.75;
            if (selectedOptions.length === 3) return 1;
            return 0;
        case "item13":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length === 2) return 0.75;
            if (selectedOptions.length === 3) return 1;
            return 0;
        case "item14":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length < 6) return 0.75;
            if (selectedOptions.length === 6) return 1;
            return 0;
        case "item15":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.25;
            if (selectedOptions.length <= 5) return 0.5;
            if (selectedOptions.length < 9) return 0.75;
            if (selectedOptions.length === 12) return 1;
            return 0;
        case "item16":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.25;
            if (selectedOptions.length === 2) return 0.5;
            if (selectedOptions.length === 3) return 0.75;
            if (selectedOptions.length === 4) return 1;
            return 0;
        case "item17":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length === 2) return 0.75;
            if (selectedOptions.length === 3) return 1;
            return 0;
        default:
            return 0;
    }
};

interface Props {
    state: string;
}

export function D2FirstModule({ state }: Props) {
    const [scoreItem1, setScoreItem1] = useState(0);
    const [scoreItem2, setScoreItem2] = useState(0);
    const [scoreItem3, setScoreItem3] = useState(0);
    const [scoreItem4, setScoreItem4] = useState(0);
    const [scoreItem5, setScoreItem5] = useState(0);
    const [scoreItem6, setScoreItem6] = useState(0);
    const [scoreItem7, setScoreItem7] = useState(0);
    const [scoreItem8, setScoreItem8] = useState(0);
    const [scoreItem9, setScoreItem9] = useState(0);
    const [scoreItem10, setScoreItem10] = useState(0);
    const [scoreItem11, setScoreItem11] = useState(0);
    const [scoreItem12, setScoreItem12] = useState(0);
    const [scoreItem13, setScoreItem13] = useState(0);
    const [scoreItem14, setScoreItem14] = useState(0);
    const [scoreItem15, setScoreItem15] = useState(0);
    const [scoreItem16, setScoreItem16] = useState(0);
    const [scoreItem17, setScoreItem17] = useState(0);
    const [finalResult, setFinalResult] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [excludedItems, setExcludedItems] = useState<string[]>([]);
    const pdfRef = useRef<HTMLDivElement>(null);

    const initialFormData = {
        item1: [],
        item2: [],
        item3: [],
        item4: [],
        item5: [],
        item6: [],
        item7: [],
        item8: [],
        item9: [],
        item10: [],
        item11: [],
        item12: [],
        item13: [],
        item14: [],
        item15: [],
        item16: [],
        item17: [],
        excludeItems: [],
    };

    const savedFormData = useMemo(() => {
        return JSON.parse(localStorage.getItem("d2m1") || "{}");
    }, []);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item1: savedFormData.item1 || [],
            item2: savedFormData.item2 || [],
            item3: savedFormData.item3 || [],
            item4: savedFormData.item4 || [],
            item5: savedFormData.item5 || [],
            item6: savedFormData.item6 || [],
            item7: savedFormData.item7 || [],
            item8: savedFormData.item8 || [],
            item9: savedFormData.item9 || [],
            item10: savedFormData.item10 || [],
            item11: savedFormData.item11 || [],
            item12: savedFormData.item12 || [],
            item13: savedFormData.item13 || [],
            item14: savedFormData.item14 || [],
            item15: savedFormData.item15 || [],
            item16: savedFormData.item16 || [],
            item17: savedFormData.item17 || [],
            excludeItems: savedFormData.excludeItems || [],
        },
    });

    useEffect(() => {
        form.watch((value) => {
            localStorage.setItem("d2m1", JSON.stringify(value));
        });
    }, [form, form.watch]);

    useEffect(() => {
        const {
            item1,
            item2,
            item3,
            item4,
            item5,
            item6,
            item7,
            item8,
            item9,
            item10,
            item11,
            item12,
            item13,
            item14,
            item15,
            item16,
            item17,
            excludeItems,
        } = savedFormData;
        setScoreItem1(calculateScore("item1", item1 || []));
        setScoreItem2(calculateScore("item2", item2 || []));
        setScoreItem3(calculateScore("item3", item3 || []));
        setScoreItem4(calculateScore("item4", item4 || []));
        setScoreItem5(calculateScore("item5", item5 || []));
        setScoreItem6(calculateScore("item6", item6 || []));
        setScoreItem7(calculateScore("item7", item7 || []));
        setScoreItem8(calculateScore("item8", item8 || []));
        setScoreItem9(calculateScore("item9", item9 || []));
        setScoreItem10(calculateScore("item10", item10 || []));
        setScoreItem11(calculateScore("item11", item11 || []));
        setScoreItem12(calculateScore("item12", item12 || []));
        setScoreItem13(calculateScore("item13", item13 || []));
        setScoreItem14(calculateScore("item14", item14 || []));
        setScoreItem15(calculateScore("item15", item15 || []));
        setScoreItem16(calculateScore("item16", item16 || []));
        setScoreItem17(calculateScore("item17", item17 || []));
        setExcludedItems(excludeItems || []);
    }, [savedFormData]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCheckboxChange = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field: any,
        itemName: keyof FormData,
        value: string
    ) => {
        return (checked: boolean) => {
            let newValue;

            if (
                itemName === "item2" &&
                value === "2.3- Não apresenta experiência em alfabetização e letramento"
            ) {
                newValue = checked ? [value] : [];
            } else {
                newValue = checked
                    ? [...field.value, value]
                    : field.value.filter((v: string) => v !== value);

                if (
                    itemName === "item2" &&
                    newValue.includes(
                        "2.3- Não apresenta experiência em alfabetização e letramento"
                    )
                ) {
                    newValue = [
                        "2.3- Não apresenta experiência em alfabetização e letramento",
                    ];
                }
            }

            field.onChange(newValue);

            const score = calculateScore(itemName, newValue);

            switch (itemName) {
                case "item1":
                    setScoreItem1(score);
                    break;
                case "item2":
                    setScoreItem2(score);
                    break;
                case "item3":
                    setScoreItem3(score);
                    break;
                case "item4":
                    setScoreItem4(score);
                    break;
                case "item5":
                    setScoreItem5(score);
                    break;
                case "item6":
                    setScoreItem6(score);
                    break;
                case "item7":
                    setScoreItem7(score);
                    break;
                case "item8":
                    setScoreItem8(score);
                    break;
                case "item9":
                    setScoreItem9(score);
                    break;
                case "item10":
                    setScoreItem10(score);
                    break;
                case "item11":
                    setScoreItem11(score);
                    break;
                case "item12":
                    setScoreItem12(score);
                    break;
                case "item13":
                    setScoreItem13(score);
                    break;
                case "item14":
                    setScoreItem14(score);
                    break;
                case "item15":
                    setScoreItem15(score);
                    break;
                case "item16":
                    setScoreItem16(score);
                    break;
                case "item17":
                    setScoreItem17(score);
                    break;
                default:
                    break;
            }
        };
    };

    const handleResetForm = () => {
        localStorage.removeItem("d2m1");
        form.reset(initialFormData);
        setScoreItem1(0);
        setScoreItem2(0);
        setScoreItem3(0);
        setScoreItem4(0);
        setScoreItem5(0);
        setScoreItem6(0);
        setScoreItem7(0);
        setScoreItem8(0);
        setScoreItem9(0);
        setScoreItem10(0);
        setScoreItem11(0);
        setScoreItem12(0);
        setScoreItem13(0);
        setScoreItem14(0);
        setScoreItem15(0);
        setScoreItem16(0);
        setScoreItem17(0);
        setFinalResult(0);
        setExcludedItems([]);
    };

    const onSubmit = useCallback(() => {
        setIsLoading(true);

        const scores = [
            !excludedItems.includes("item1") && scoreItem1,
            !excludedItems.includes("item2") && scoreItem2,
            !excludedItems.includes("item3") && scoreItem3,
            !excludedItems.includes("item4") && scoreItem4,
            !excludedItems.includes("item5") && scoreItem5,
            !excludedItems.includes("item6") && scoreItem6,
            !excludedItems.includes("item7") && scoreItem7,
            !excludedItems.includes("item8") && scoreItem8,
            !excludedItems.includes("item9") && scoreItem9,
            !excludedItems.includes("item10") && scoreItem10,
            !excludedItems.includes("item11") && scoreItem11,
            !excludedItems.includes("item12") && scoreItem12,
            !excludedItems.includes("item13") && scoreItem13,
            !excludedItems.includes("item14") && scoreItem14,
            !excludedItems.includes("item15") && scoreItem15,
            !excludedItems.includes("item16") && scoreItem16,
            !excludedItems.includes("item17") && scoreItem17,
        ].filter((score) => score !== false) as number[];

        setFinalResult(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
        );

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, [
        excludedItems,
        scoreItem1,
        scoreItem10,
        scoreItem11,
        scoreItem12,
        scoreItem13,
        scoreItem14,
        scoreItem15,
        scoreItem16,
        scoreItem17,
        scoreItem2,
        scoreItem3,
        scoreItem4,
        scoreItem5,
        scoreItem6,
        scoreItem7,
        scoreItem8,
        scoreItem9,
    ]);

    const downloadPDF = useReactToPrint({
        content: () => pdfRef.current,
        documentTitle: `Dimensão 2 - Categoria 1 - ${state}`,
        onAfterPrint: () => alert("Download realizado com sucesso!"),
    });

    const handleExcludeChange = (itemName: keyof FormData) => {
        return (checked: boolean) => {
            let newExcludeItems;

            if (checked) {
                newExcludeItems = [...excludedItems, itemName];
            } else {
                newExcludeItems = excludedItems.filter((v) => v !== itemName);
            }

            setExcludedItems(newExcludeItems);
            form.setValue("excludeItems", newExcludeItems);
        };
    };

    useEffect(() => {
        if (finalResult !== 0) {
            onSubmit();
        }
    }, [excludedItems, finalResult, onSubmit]);

    return (
        <Card ref={pdfRef}>
            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <h1 className="flex w-fit text-5xl md:text-6xl">{state}</h1>
                <div className="w-fit md:mt-0 no-print">
                    <Button onClick={handleResetForm}>Limpar formulário</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        {Object.keys(items).map((itemName) => (
                            <FormField
                                key={items[itemName].data[0]}
                                control={form.control}
                                name={itemName as keyof FormData}
                                render={({ field }) => (
                                    <FormItem className="justify-center flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>
                                                {items[itemName].title} - Score:{" "}
                                                {(() => {
                                                    switch (itemName) {
                                                        case "item1":
                                                            return scoreItem1;
                                                        case "item2":
                                                            return scoreItem2;
                                                        case "item3":
                                                            return scoreItem3;
                                                        case "item4":
                                                            return scoreItem4;
                                                        case "item5":
                                                            return scoreItem5;
                                                        case "item6":
                                                            return scoreItem6;
                                                        case "item7":
                                                            return scoreItem7;
                                                        case "item8":
                                                            return scoreItem8;
                                                        case "item9":
                                                            return scoreItem9;
                                                        case "item10":
                                                            return scoreItem10;
                                                        case "item11":
                                                            return scoreItem11;
                                                        case "item12":
                                                            return scoreItem12;
                                                        case "item13":
                                                            return scoreItem13;
                                                        case "item14":
                                                            return scoreItem14;
                                                        case "item15":
                                                            return scoreItem15;
                                                        case "item16":
                                                            return scoreItem16;
                                                        case "item17":
                                                            return scoreItem17;
                                                        default:
                                                            return 0;
                                                    }
                                                })()}
                                            </FormLabel>
                                            <label className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={excludedItems.includes(itemName)}
                                                    onCheckedChange={handleExcludeChange(
                                                        itemName as keyof FormData
                                                    )}
                                                />
                                                <span>Desconsiderar</span>
                                            </label>
                                        </div>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                {items[itemName].data.map((value, idx) => (
                                                    <label
                                                        key={idx}
                                                        className={`flex items-center space-x-2 ${excludedItems.includes(itemName)
                                                                ? "opacity-50"
                                                                : ""
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            checked={field.value.includes(value)}
                                                            onCheckedChange={handleCheckboxChange(
                                                                field,
                                                                itemName as keyof FormData,
                                                                value
                                                            )}
                                                            disabled={excludedItems.includes(itemName)}
                                                        />
                                                        <span>{value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <Separator />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        {isLoading ? (
                            <Button disabled className="no-print">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Calculando
                            </Button>
                        ) : (
                            <Button type="submit" className="no-print">
                                Calcular
                            </Button>
                        )}
                        {isLoading ? (
                            <div className="flex flex-col gap-4">
                                {[...Array(17 - excludedItems.length)].map((_, index) => (
                                    <Skeleton key={index} className="w-1/6 h-8" />
                                ))}
                                <Skeleton className="w-full h-10" />
                            </div>
                        ) : (
                            finalResult !== 0 && (
                                <>
                                    {!excludedItems.includes("item1") && (
                                        <div>
                                            {`Item-1: ${formatValue(scoreItem1, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item2") && (
                                        <div>
                                            {`Item-2: ${formatValue(scoreItem2, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item3") && (
                                        <div>
                                            {`Item-3: ${formatValue(scoreItem3, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item4") && (
                                        <div>
                                            {`Item-4: ${formatValue(scoreItem4, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item5") && (
                                        <div>
                                            {`Item-5: ${formatValue(scoreItem5, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item6") && (
                                        <div>
                                            {`Item-6: ${formatValue(scoreItem6, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item7") && (
                                        <div>
                                            {`Item-7: ${formatValue(scoreItem7, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item8") && (
                                        <div>
                                            {`Item-8: ${formatValue(scoreItem8, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item9") && (
                                        <div>
                                            {`Item-9: ${formatValue(scoreItem9, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item10") && (
                                        <div>
                                            {`Item-10: ${formatValue(scoreItem10, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item11") && (
                                        <div>
                                            {`Item-11: ${formatValue(scoreItem11, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item12") && (
                                        <div>
                                            {`Item-12: ${formatValue(scoreItem12, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item13") && (
                                        <div>
                                            {`Item-13: ${formatValue(scoreItem13, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item14") && (
                                        <div>
                                            {`Item-14: ${formatValue(scoreItem14, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item15") && (
                                        <div>
                                            {`Item-15: ${formatValue(scoreItem15, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item16") && (
                                        <div>
                                            {`Item-16: ${formatValue(scoreItem16, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    {!excludedItems.includes("item17") && (
                                        <div>
                                            {`Item-17: ${formatValue(scoreItem17, {
                                                decimalPlace: 2,
                                            })}`}
                                        </div>
                                    )}
                                    <h1>Cálculo Resultado Final:</h1>
                                    <div>
                                        {`(${[
                                            !excludedItems.includes("item1") &&
                                            `${formatValue(scoreItem1, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item2") &&
                                            `${formatValue(scoreItem2, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item3") &&
                                            `${formatValue(scoreItem3, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item4") &&
                                            `${formatValue(scoreItem4, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item5") &&
                                            `${formatValue(scoreItem5, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item6") &&
                                            `${formatValue(scoreItem6, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item7") &&
                                            `${formatValue(scoreItem7, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item8") &&
                                            `${formatValue(scoreItem8, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item9") &&
                                            `${formatValue(scoreItem9, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item10") &&
                                            `${formatValue(scoreItem10, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item11") &&
                                            `${formatValue(scoreItem11, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item12") &&
                                            `${formatValue(scoreItem12, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item13") &&
                                            `${formatValue(scoreItem13, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item14") &&
                                            `${formatValue(scoreItem14, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item15") &&
                                            `${formatValue(scoreItem15, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item16") &&
                                            `${formatValue(scoreItem16, { decimalPlace: 2 })}`,
                                            !excludedItems.includes("item17") &&
                                            `${formatValue(scoreItem17, { decimalPlace: 2 })}`,
                                        ]
                                            .filter(Boolean)
                                            .join(" + ")}) / ${17 - excludedItems.length
                                            } = ${formatValue(finalResult, {
                                                decimalPlace: 2,
                                            })}`}
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={downloadPDF}
                                        className="no-print"
                                    >
                                        Baixar PDF
                                    </Button>
                                </>
                            )
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
