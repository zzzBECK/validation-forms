import { formatValue } from "@/helpers/formatValue";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "../ui/input";

const formSchema = z.object({
    item1: z.array(z.string()),
    item2: z.array(z.string()),
    item3: z.array(z.string()),
    item4: z.array(z.string()),
    item5: z.array(z.string()),
    item1Percent: z.number().min(0).max(100).optional(),
    excludeItems: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const items: Record<keyof Omit<FormData, "excludeItems" | "item1Percent">, { title: string; data: { id: number, text: string, subItems?: { id: number, text: string }[] }[] }> = {
    item1: {
        title: "Organização da oferta",
        data: [
            { id: 1.1, text: "1.1- Alcance da formação" },
            { id: 1.2, text: "1.2- Participação de outros profissionais" },
            {
                id: 1.3, text: "1.3- Mapeamento sobre perfil e condições de acesso", subItems: [
                    { id: 1.31, text: "Formação" },
                    { id: 1.32, text: "Regime trabalhista" },
                    { id: 1.33, text: "Jornada de trabalho" },
                    { id: 1.34, text: "Condições de trabalho (1/3 da carga horária)" },
                    { id: 1.35, text: "Distância de deslocamento para atividades in loco" },
                    { id: 1.36, text: "Tempo de deslocamento" },
                    { id: 1.37, text: "Meios de transporte utilizados" },
                    { id: 1.38, text: "Acesso às tecnologias utilizadas" },
                    { id: 1.39, text: "Cursistas com deficiências e TEA" },
                    { id: 1.310, text: "Diversidade de contextos de atuação" },
                    { id: 1.311, text: "Necessidades formativas" },
                    { id: 1.312, text: "Outros" },
                ]
            },
            { id: 1.4, text: "1.4- Período de realização da formação" },
            { id: 1.5, text: "1.5- Disponibilidade de materiais para atividades" },
            { id: 1.6, text: "1.6- Previsibilidade de materiais para cursistas com deficiências" },
            { id: 1.7, text: "1.7- Previsibilidade de estratégias para cursistas sem acesso à internet" },
        ],
    },
    item2: {
        title: "Organização da carga horária e regularidade das atividades formativas",
        data: [
            { id: 2.1, text: "2.1- Carga horária total mínima" },
            { id: 2.2, text: "2.2- Atende à carga horária mínima presencial" },
            { id: 2.3, text: "2.3- Equivalência entre carga horária on-line e presencial" },
            {
                id: 2.4, text: "2.4- Carga horária distribuída e mensurada", subItems: [
                    { id: 2.41, text: "Momentos de leituras, estudos e atividades individuais" },
                    { id: 2.42, text: "Atividades interativas online" },
                    { id: 2.43, text: "Estudos e atividades em pequenos grupos, duplas, trios etc." },
                    { id: 2.44, text: "Estudos e atividades coletivas" },
                    { id: 2.45, text: "Atividades presenciais" },
                    { id: 2.46, text: "Atividades de pesquisa" },
                ]
            },
            { id: 2.5, text: "2.5- Regularidade das atividades formativas" },
            { id: 2.6, text: "2.6- Regularidade dos encontros presenciais" },
            { id: 2.7, text: "2.7- Regularidade dos encontros síncronos" },
        ],
    },
    item3: {
        title: "Organização do trabalho pedagógico",
        data: [
            {
                id: 3.1, text: "3.1- Diversidade e dinamicidade de estratégias formativas", subItems: [
                    { id: 3.11, text: "Debates a partir de estudos de caso" },
                    { id: 3.12, text: "Oficinas" },
                    { id: 3.13, text: "Pesquisas" },
                    { id: 3.14, text: "Rodas de conversa" },
                    { id: 3.15, text: "Fóruns de Discussão" },
                    { id: 3.16, text: "Questionários" },
                    { id: 3.17, text: "Lives, seminários e conferências" },
                    { id: 3.18, text: "Atividades no AVAMEC Interativo" },
                    { id: 3.19, text: "Grupos de leitura" },
                    { id: 3.110, text: "Registros de memória" },
                    { id: 3.111, text: "Outras" },
                ]
            },
            {
                id: 3.2, text: "3.2- Metodologia possibilita o trabalho coletivo e interação", subItems: [
                    { id: 3.21, text: "Atividades e propostas em grupos, duplas, trios e coletivamente" },
                    { id: 3.22, text: "Momentos estruturados para compartilhamento de inquietações e dúvidas" },
                    { id: 3.23, text: "Criação de jogos e/ou recursos pedagógicos" },
                    { id: 3.24, text: "Atividades que envolvam tomada de decisão" },
                    { id: 3.25, text: "Organização e elaboração de instrumentos de observação e documentação pedagógica" },
                    { id: 3.26, text: "Compartilhamento e reflexão sobre experiências profissionais" },
                    { id: 3.27, text: "Oportuniza a pesquisa e o compartilhamento de novos conhecimentos" },
                ]
            },
            {
                id: 3.3, text: "3.3- Estratégias formativas propiciam o desenvolvimento de posturas responsivas", subItems: [
                    { id: 3.31, text: "Propostas periódicas de leitura em diferentes formatos" },
                    { id: 3.32, text: "Orientação e incentivo a produções escritas autorais" },
                ]
            },
            { id: 3.4, text: "3.4- Flexibilidade para reorganização e replanejamento" },
            { id: 3.5, text: "3.5- Estratégias para conter/combater a evasão entre cursistas" },
        ],
    },
    item4: {
        title: "Organização dos processos avaliativos",
        data: [
            { id: 4.1, text: "4.1- Especificação sobre formas de avaliação e certificação" },
            { id: 4.2, text: "4.2- Estratégias avaliativas coadunam com avaliação processual" },
            { id: 4.3, text: "4.3- Avaliativos internos consideram feedbacks" },
            {
                id: 4.4, text: "4.4- Registros e sistematização do percurso", subItems: [
                    { id: 4.41, text: "Criação de registros que apoiam a aprendizagem e avaliação" },
                    { id: 4.42, text: "Previsão de diferentes tipos de registros" },
                    { id: 4.43, text: "Previsão de registros individuais e coletivos" },
                    { id: 4.44, text: "Registros organizados/realizados de modo regular" },
                    { id: 4.45, text: "Cursistas têm fácil acesso aos registros" },
                    { id: 4.46, text: "Formadores mantêm registros organizados de forma sistemática" },
                ]
            },
        ],
    },
    item5: {
        title: "Organização do roteiro de formação",
        data: [
            {
                id: 5.1, text: "5.1- Quantidade e qualidade das informações do Roteiro", subItems: [
                    { id: 5.11, text: "Objetivo geral da formação" },
                    { id: 5.12, text: "Objetivos de aprendizagem e desenvolvimento profissional" },
                    { id: 5.13, text: "Conteúdos previstos" },
                    { id: 5.14, text: "Cronograma da formação" },
                    { id: 5.15, text: "Produtos a serem entregues" },
                    { id: 5.16, text: "Estratégias metodológicas" },
                    { id: 5.17, text: "Forma de avaliação e certificação" },
                    { id: 5.18, text: "Materiais e referências" },
                    { id: 5.19, text: "Concepção pedagógica" },
                ]
            },
            {
                id: 5.2, text: "5.2- Coerência entre planejamento e execução prática", subItems: [
                    { id: 5.21, text: "Cronograma" },
                    { id: 5.22, text: "Conteúdos" },
                    { id: 5.23, text: "Registros" },
                    { id: 5.24, text: "Metodologia" },
                ]
            },
            { id: 5.3, text: "5.3- Coerência entre objetivos, metodologia, materiais e conteúdo" },
        ],
    },
};



const calculateScore = (
    itemName: keyof FormData,
    selectedOptionIds: number[],
    percent?: number
): number => {
    let score: number;
    let subItem1: number;
    let subItem2: number;
    let subItem3: number;
    let subItem4: number;
    let subItem5: number;
    let subItem6: number;
    let subItem7: number;

    switch (itemName) {
        case "item1": {
            subItem1 = 0;
            subItem2 = 0;
            subItem3 = 0;
            subItem4 = 0;
            subItem5 = 0;
            subItem6 = 0;
            subItem7 = 0;

            // Subitem 1.1
            if (percent !== undefined) {
                if (percent >= 100) subItem1 = 1;
                else if (percent >= 90) subItem1 = 0.75;
                else if (percent >= 80) subItem1 = 0.5;
                else subItem1 = 0;
            }

            // Subitem 1.2
            if (selectedOptionIds.includes(1.2)) {
                subItem2 = 1;
            } else {
                subItem2 = 0;
            }

            // Subitem 1.3
            const mappingSubItems = [
                1.31,
                1.32,
                1.33,
                1.34,
                1.35,
                1.36,
                1.37,
                1.38,
                1.39,
                1.310,
                1.311,
                1.312,
            ];
            const mappedItemsCount = selectedOptionIds.filter(id =>
                mappingSubItems.includes(id)
            ).length;

            if (mappedItemsCount >= 6) subItem3 = 1;
            else if (mappedItemsCount >= 4) subItem3 = 0.75;
            else if (mappedItemsCount >= 1) subItem3 = 0.5;
            else subItem3 = 0;

            // Subitem 1.4
            if (selectedOptionIds.includes(1.4)) subItem4 = 1;
            else if (selectedOptionIds.includes(1.41)) subItem4 = 0.75;
            else if (selectedOptionIds.includes(1.43) || selectedOptionIds.includes(1.44)) subItem4 = 0;
            else subItem4 = 0;

            // Subitem 1.5
            const materialIds = [
                1.5, // Placeholder for specific options, if needed
            ];
            const availableMaterialsCount = selectedOptionIds.filter(id =>
                materialIds.includes(id)
            ).length;

            if (availableMaterialsCount >= 6) subItem5 = 1;
            else if (availableMaterialsCount === 5) subItem5 = 0.75;
            else if (availableMaterialsCount >= 3) subItem5 = 0.5;
            else subItem5 = 0;

            // Subitem 1.6
            if (selectedOptionIds.includes(1.6)) {
                subItem6 = 1;
            } else {
                subItem6 = 0;
            }

            // Subitem 1.7
            if (selectedOptionIds.includes(1.7)) {
                subItem7 = 1;
            } else {
                subItem7 = 0;
            }

            score = (subItem1 + subItem2 + subItem3 + subItem4 + subItem5 + subItem6 + subItem7) / 7;
            return score;
        }
        case "item2": {
            // Similar logic for item2 sub-items and main items, adapt as per the rules
            subItem1 = 0;
            subItem2 = 0;
            subItem3 = 0;
            subItem4 = 0;
            subItem5 = 0;
            subItem6 = 0;
            subItem7 = 0;

            if (selectedOptionIds.includes(2.1)) subItem1 = 1;
            if (selectedOptionIds.includes(2.2)) subItem2 = 1;
            if (selectedOptionIds.includes(2.3)) {
                // Logic for subitem 2.3 equivalence calculation
                subItem3 = 1;
            }
            const loadDistributionSubItems = [
                2.41, 2.42, 2.43, 2.44, 2.45, 2.46,
            ];
            const loadDistributionCount = selectedOptionIds.filter(id =>
                loadDistributionSubItems.includes(id)
            ).length;
            if (loadDistributionCount >= 6) subItem4 = 1;
            else if (loadDistributionCount >= 4) subItem4 = 0.75;
            else if (loadDistributionCount >= 2) subItem4 = 0.5;
            else subItem4 = 0;

            if (selectedOptionIds.includes(2.5)) subItem5 = 1;
            if (selectedOptionIds.includes(2.6)) subItem6 = 1;
            if (selectedOptionIds.includes(2.7)) subItem7 = 1;

            score = (subItem1 + subItem2 + subItem3 + subItem4 + subItem5 + subItem6 + subItem7) / 7;
            return score;
        }
        case "item3": {
            // Similar logic for item3 sub-items and main items, adapt as per the rules
            subItem1 = 0;
            subItem2 = 0;
            subItem3 = 0;
            subItem4 = 0;
            subItem5 = 0;

            const strategyDiversitySubItems = [
                3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.17, 3.18, 3.19, 3.110, 3.111,
            ];
            const strategyDiversityCount = selectedOptionIds.filter(id =>
                strategyDiversitySubItems.includes(id)
            ).length;
            if (strategyDiversityCount >= 9) subItem1 = 1;
            else if (strategyDiversityCount >= 6) subItem1 = 0.75;
            else if (strategyDiversityCount >= 3) subItem1 = 0.5;
            else subItem1 = 0;

            const methodologySubItems = [
                3.21, 3.22, 3.23, 3.24, 3.25, 3.26, 3.27,
            ];
            const methodologyCount = selectedOptionIds.filter(id =>
                methodologySubItems.includes(id)
            ).length;
            if (methodologyCount >= 7) subItem2 = 1;
            else if (methodologyCount >= 5) subItem2 = 0.75;
            else if (methodologyCount >= 3) subItem2 = 0.5;
            else subItem2 = 0;

            const responsiveDevelopmentSubItems = [
                3.31, 3.32,
            ];
            const responsiveDevelopmentCount = selectedOptionIds.filter(id =>
                responsiveDevelopmentSubItems.includes(id)
            ).length;
            if (responsiveDevelopmentCount >= 2) subItem3 = 1;
            else subItem3 = 0;

            if (selectedOptionIds.includes(3.4)) subItem4 = 1;
            if (selectedOptionIds.includes(3.5)) subItem5 = 1;

            score = (subItem1 + subItem2 + subItem3 + subItem4 + subItem5) / 5;
            return score;
        }
        case "item4": {
            // Similar logic for item4 sub-items and main items, adapt as per the rules
            subItem1 = 0;
            subItem2 = 0;
            subItem3 = 0;
            subItem4 = 0;

            if (selectedOptionIds.includes(4.1)) subItem1 = 1;
            if (selectedOptionIds.includes(4.2)) subItem2 = 1;
            if (selectedOptionIds.includes(4.3)) subItem3 = 1;

            const registerSubItems = [
                4.41, 4.42, 4.43, 4.44, 4.45, 4.46,
            ];
            const registerCount = selectedOptionIds.filter(id =>
                registerSubItems.includes(id)
            ).length;
            if (registerCount >= 6) subItem4 = 1;
            else if (registerCount >= 5) subItem4 = 0.75;
            else if (registerCount >= 3) subItem4 = 0.5;
            else subItem4 = 0;

            score = (subItem1 + subItem2 + subItem3 + subItem4) / 4;
            return score;
        }
        case "item5": {
            // Similar logic for item5 sub-items and main items, adapt as per the rules
            subItem1 = 0;
            subItem2 = 0;
            subItem3 = 0;

            const routeInfoSubItems = [
                5.11, 5.12, 5.13, 5.14, 5.15, 5.16, 5.17, 5.18, 5.19,
            ];
            const routeInfoCount = selectedOptionIds.filter(id =>
                routeInfoSubItems.includes(id)
            ).length;
            if (routeInfoCount >= 9) subItem1 = 1;
            else if (routeInfoCount >= 6) subItem1 = 0.75;
            else if (routeInfoCount >= 4) subItem1 = 0.5;
            else subItem1 = 0;

            const planningExecutionSubItems = [
                5.21, 5.22, 5.23, 5.24,
            ];
            const planningExecutionCount = selectedOptionIds.filter(id =>
                planningExecutionSubItems.includes(id)
            ).length;
            if (planningExecutionCount >= 4) subItem2 = 1;
            else if (planningExecutionCount >= 3) subItem2 = 0.75;
            else if (planningExecutionCount >= 2) subItem2 = 0.5;
            else subItem2 = 0;

            if (selectedOptionIds.includes(5.3)) subItem3 = 1;

            score = (subItem1 + subItem2 + subItem3) / 3;
            return score;
        }
        default:
            return 0;
    }
};



interface Props {
    state: string;
}

export function EF1({ state }: Props) {
    const [scoreItem1, setScoreItem1] = useState(0);
    const [scoreItem2, setScoreItem2] = useState(0);
    const [scoreItem3, setScoreItem3] = useState(0);
    const [scoreItem4, setScoreItem4] = useState(0);
    const [scoreItem5, setScoreItem5] = useState(0);
    const [finalResult, setFinalResult] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [excludedItems, setExcludedItems] = useState<string[]>([]);
    const pdfRef = useRef<HTMLDivElement>(null);

    const initialFormData = {
        item1: [],
        item1Percent: undefined,
        item2: [],
        item3: [],
        item4: [],
        item5: [],
        excludeItems: [],
    };

    const savedFormData = useMemo(() => {
        return JSON.parse(localStorage.getItem("ef1") || "{}");
    }, []);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item1: savedFormData.item1 || [],
            item1Percent: savedFormData.item1Percent || undefined,
            item2: savedFormData.item2 || [],
            item3: savedFormData.item3 || [],
            item4: savedFormData.item4 || [],
            item5: savedFormData.item5 || [],
            excludeItems: savedFormData.excludeItems || [],
        },
    });

    useEffect(() => {
        form.watch((value) => {
            localStorage.setItem("ef1", JSON.stringify(value));
        });
    }, [form, form.watch]);

    useEffect(() => {
        const { item1, item1Percent, item2, item3, item4, item5, excludeItems } =
            savedFormData;
        setScoreItem1(calculateScore("item1", item1 || [], item1Percent));
        setScoreItem2(calculateScore("item2", item2 || []));
        setScoreItem3(calculateScore("item3", item3 || []));
        setScoreItem4(calculateScore("item4", item4 || []));
        setScoreItem5(calculateScore("item5", item5 || []));
        setExcludedItems(excludeItems || []);
    }, [savedFormData]);

    const handleCheckboxChange = (
        field: { value: number[]; onChange: (value: number[]) => void },
        itemName: keyof FormData,
        value: { id: number; text: string }
    ) => {
        return (checked: boolean) => {
            const newValue = checked
                ? [...field.value, value.id]
                : field.value.filter((v) => v !== value.id);

            field.onChange(newValue);

            const score = calculateScore(itemName, newValue, form.getValues("item1Percent"));

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
                default:
                    break;
            }
        };
    };

    const handlePercentChange = (value: number) => {
        form.setValue("item1Percent", value);
        setScoreItem1(calculateScore("item1", form.getValues("item1"), value));
    };

    const handleResetForm = () => {
        localStorage.removeItem("ef1");
        form.reset(initialFormData);
        setScoreItem1(0);
        setScoreItem2(0);
        setScoreItem3(0);
        setScoreItem4(0);
        setScoreItem5(0);
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
        scoreItem2,
        scoreItem3,
        scoreItem4,
        scoreItem5,
    ]);

    const downloadPDF = useReactToPrint({
        content: () => pdfRef.current,
        documentTitle: `Dimensão 1 - Categoria 1 - ${state}`,
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
                                key={itemName as keyof typeof items}
                                control={form.control}
                                name={itemName as keyof FormData}
                                render={({ field }) => (
                                    <FormItem className="justify-center flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>
                                                {items[itemName as keyof typeof items].title} - Score:{" "}
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
                                                {items[itemName as keyof typeof items].data.map((value, idx) => (
                                                    <div key={idx}>
                                                        <label
                                                            className={`flex items-center space-x-2 ${excludedItems.includes(itemName)
                                                                ? "opacity-50"
                                                                : ""
                                                                }`}
                                                        >
                                                            {value.id === 1.1 ? (
                                                                <>
                                                                    <span>{value.text}</span>
                                                                    <Controller
                                                                        name="item1Percent"
                                                                        control={form.control}
                                                                        render={({ field }) => (
                                                                            <Input
                                                                                type="number"
                                                                                className="w-1/12"
                                                                                value={field.value ?? ""}
                                                                                onChange={(e) => {
                                                                                    const percentValue = parseFloat(e.target.value);
                                                                                    field.onChange(percentValue);
                                                                                    handlePercentChange(percentValue);
                                                                                }}
                                                                                disabled={excludedItems.includes(itemName)}
                                                                            />
                                                                        )}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Checkbox
                                                                        checked={field.value ? field.value.includes(value.id) : false}
                                                                        onCheckedChange={handleCheckboxChange(
                                                                            field,
                                                                            itemName as keyof FormData,
                                                                            value
                                                                        )}
                                                                        disabled={excludedItems.includes(itemName)}
                                                                    />
                                                                    <span>{value.text}</span>
                                                                </>
                                                            )}
                                                        </label>
                                                        {value.subItems && (
                                                            <div className="ml-6 flex flex-col gap-2">
                                                                {value.subItems.map((subItem) => (
                                                                    <label
                                                                        key={subItem.id}
                                                                        className={`flex items-center space-x-2 ${excludedItems.includes(itemName)
                                                                            ? "opacity-50"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        <Checkbox
                                                                            checked={field.value ? field.value.includes(subItem.id) : false}
                                                                            onCheckedChange={handleCheckboxChange(
                                                                                field,
                                                                                itemName as keyof FormData,
                                                                                subItem
                                                                            )}
                                                                            disabled={excludedItems.includes(itemName)}
                                                                        />
                                                                        <span>{subItem.text}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
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
                                {[...Array(7 - excludedItems.length)].map((_, index) => (
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
                                            `${formatValue(scoreItem5, { decimalPlace: 2 })}`
                                        ]
                                            .filter(Boolean)
                                            .join(" + ")}) / ${5 - excludedItems.length
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
