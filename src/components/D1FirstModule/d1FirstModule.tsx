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
    excludeItems: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const items: Record<string, { title: string; data: string[] }> = {
    item1: {
        title: "Profissionais da educação",
        data: [
            "1.1- Docentes",
            "1.2- Coordenadores Pedagógicos",
            "1.3 -Gestores",
            "1.4- Equipes Técnicas",
            "1.5- Famílias dos Estudantes",
            "1.6- Suportes Administrativos",
        ],
    },
    item2: {
        title:
            "Previsibilidade para a garantia de organização estrutural acessível",
        data: [
            "2.1- Levantamento e mapeamento dos profissionais da educação com deficiência e Transtorno do Espectro Autista",
        ],
    },
    item3: {
        title:
            "Previsibilidade para a garantia de organização estrutural que atenda a diversidade",
        data: [
            "3.1- Levantamento e mapeamento dos profissionais da educação que atuam em Escolas do Campo, Educação Bilíngue, Escolas Indígenas, Educação Especial",
        ],
    },
    item4: {
        title: "Demandas de formação",
        data: [
            "4.1- Processo de alfabetização (1° e 2° anos do Ensino Fundamental)",
            "4.2- Recomposição das aprendizagens (3°, 4° e 5° anos do Ensino Fundamental)",
        ],
    },
    item5: {
        title: "Contempla a alfabetização Matemática",
        data: [
            "5.1- Sinaliza uma proposta pedagógica na perspectiva interdisciplinar",
            "5.2- Contempla o bloco de conteúdo Número",
            "5.3- Contemplam os blocos de conteúdo: Números, Álgebra, Geometria, Grandezas e Medidas e Probabilidade e Estatística",
            "5.4- Sinalizam discussões e proposições no âmbito da Educação Especial",
            "5.5– Sinalizam discussões e proposições no âmbito da Educação do Campo",
            "5.6– Sinalizam discussões no âmbito da Educação Indígena",
            "Não se aplica",
        ],
    },
    item6: {
        title: "Turno de formação",
        data: [
            "6.1- Dentro da carga horária de trabalho",
            "6.2- Dentro de 1/3 da carga horária (coordenações, hora de atividades, planejamentos e reuniões)",
            "6.3- Sábados",
            "6.4– Contraturno (para além da carga horária)",
        ],
    },
    item7: {
        title: "Alcance dos profissionais da educação inscritos nas formações",
        data: [
            "7.1- 100%",
            "7.2- Entre 80 a 99%",
            "7.3- Entre 60 a 79%",
            "7.4- Até 59%",
        ],
    },
};

const calculateScore = (
    itemName: keyof FormData,
    selectedOptions: string[]
): number => {
    switch (itemName) {
        case "item1":
            if (selectedOptions.length === 1) return 0;
            if (selectedOptions.length === 2) return 0.25;
            if (selectedOptions.length === 3) return 0.5;
            if (selectedOptions.length === 4) return 0.75;
            if (selectedOptions.length >= 5) return 1;
            return 0;
        case "item2":
            return selectedOptions.length > 0 ? 1 : 0;
        case "item3":
            return selectedOptions.length > 0 ? 1 : 0;
        case "item4":
            if (
                selectedOptions.includes(
                    "4.1- Processo de alfabetização (1° e 2° anos do Ensino Fundamental)"
                ) &&
                selectedOptions.includes(
                    "4.2- Recomposição das aprendizagens (3°, 4° e 5° anos do Ensino Fundamental)"
                )
            )
                return 1;
            if (
                selectedOptions.includes(
                    "4.1- Processo de alfabetização (1° e 2° anos do Ensino Fundamental)"
                )
            )
                return 0.75;
            if (
                selectedOptions.includes(
                    "4.2- Recomposição das aprendizagens (3°, 4° e 5° anos do Ensino Fundamental)"
                )
            )
                return 0.5;
            return 0;
        case "item5":
            if (selectedOptions.includes("Não se aplica")) return 1;
            if (selectedOptions.length === 6) return 1;
            if (selectedOptions.length === 0) return 0;
            if (
                selectedOptions.includes(
                    "5.1- Sinaliza uma proposta pedagógica na perspectiva interdisciplinar"
                ) &&
                selectedOptions.includes("5.2- Contempla o bloco de conteúdo Número") &&
                selectedOptions.length === 2
            )
                return 0.5;
            if (
                selectedOptions.includes(
                    "5.1- Sinaliza uma proposta pedagógica na perspectiva interdisciplinar"
                ) &&
                selectedOptions.includes("5.2- Contempla o bloco de conteúdo Número") &&
                selectedOptions.includes(
                    "5.3- Contemplam os blocos de conteúdo: Números, Álgebra, Geometria, Grandezas e Medidas e Probabilidade e Estatística"
                )
            )
                return 0.75;
            if (selectedOptions.includes("5.2- Contempla o bloco de conteúdo Número"))
                return 0.25;
            return 0;
        case "item6":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.includes("6.3- Sábados")) return 0.25;
            if (
                selectedOptions.includes(
                    "6.4– Contraturno (para além da carga horária)"
                )
            )
                return 0.5;
            if (
                selectedOptions.includes(
                    "6.2- Dentro de 1/3 da carga horária (coordenações, hora de atividades, planejamentos e reuniões)"
                )
            )
                return 0.75;
            if (selectedOptions.includes("6.1- Dentro da carga horária de trabalho"))
                return 1;
            return 0;
        case "item7":
            if (selectedOptions.includes("7.1- 100%")) return 1;
            if (selectedOptions.includes("7.2- Entre 80 a 99%")) return 0.75;
            if (selectedOptions.includes("7.3- Entre 60 a 79%")) return 0.5;
            if (selectedOptions.includes("7.4- Até 59%")) return 0.25;
            return 0;
        default:
            return 0;
    }
};

interface Props {
    state: string;
}

export function D1FirstModule({ state }: Props) {
    const [scoreItem1, setScoreItem1] = useState(0);
    const [scoreItem2, setScoreItem2] = useState(0);
    const [scoreItem3, setScoreItem3] = useState(0);
    const [scoreItem4, setScoreItem4] = useState(0);
    const [scoreItem5, setScoreItem5] = useState(0);
    const [scoreItem6, setScoreItem6] = useState(0);
    const [scoreItem7, setScoreItem7] = useState(0);
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
        excludeItems: [],
    };

    const savedFormData = useMemo(() => {
        return JSON.parse(localStorage.getItem("d1m1") || "{}");
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
            excludeItems: savedFormData.excludeItems || [],
        },
    });

    useEffect(() => {
        form.watch((value) => {
            localStorage.setItem("d1m1", JSON.stringify(value));
        });
    }, [form, form.watch]);

    useEffect(() => {
        const { item1, item2, item3, item4, item5, item6, item7, excludeItems } =
            savedFormData;
        setScoreItem1(calculateScore("item1", item1 || []));
        setScoreItem2(calculateScore("item2", item2 || []));
        setScoreItem3(calculateScore("item3", item3 || []));
        setScoreItem4(calculateScore("item4", item4 || []));
        setScoreItem5(calculateScore("item5", item5 || []));
        setScoreItem6(calculateScore("item6", item6 || []));
        setScoreItem7(calculateScore("item7", item7 || []));
        setExcludedItems(excludeItems || []);
    }, [savedFormData]);

    const handleCheckboxChange = (
        field: { value: string[]; onChange: (value: string[]) => void },
        itemName: keyof FormData,
        value: string
    ) => {
        return (checked: boolean) => {
            let newValue;

            if (
                (itemName === "item5" && value === "Não se aplica") ||
                itemName === "item6" ||
                itemName === "item7"
            ) {
                newValue = checked ? [value] : [];
            } else {
                newValue = checked
                    ? [...field.value, value]
                    : field.value.filter((v) => v !== value);

                if (itemName === "item5" && newValue.includes("Não se aplica")) {
                    newValue = ["Não se aplica"];
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
                default:
                    break;
            }
        };
    };

    const handleResetForm = () => {
        localStorage.removeItem("d1m1");
        form.reset(initialFormData);
        setScoreItem1(0);
        setScoreItem2(0);
        setScoreItem3(0);
        setScoreItem4(0);
        setScoreItem5(0);
        setScoreItem6(0);
        setScoreItem7(0);
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
        scoreItem6,
        scoreItem7,
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
                                        ]
                                            .filter(Boolean)
                                            .join(" + ")}) / ${7 - excludedItems.length
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
