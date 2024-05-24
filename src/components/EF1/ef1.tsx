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
    item1Percent: z.number().min(0).max(100).optional(),
    item2: z.array(z.string()),
    item3: z.array(z.string()),
    item4: z.array(z.string()),
    item5: z.array(z.string()),
    excludeItems: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const items: Record<keyof Omit<FormData, "excludeItems" | "item1Percent">, { title: string; data: string[] }> = {
    item1: {
        title: "Organização da oferta",
        data: [
            "1.1- Alcance da formação",
            "1.2- Participação de outros profissionais",
            "1.3- Mapeamento sobre perfil e condições de acesso",
            "1.4- Período de realização da formação",
            "1.5- Disponibilidade de materiais para atividades",
            "1.6- Previsibilidade de materiais para cursistas com deficiências",
            "1.7- Previsibilidade de estratégias para cursistas sem acesso à internet",
        ],
    },
    item2: {
        title: "Organização da carga horária e regularidade das atividades formativas",
        data: [
            "2.1- Carga horária total mínima",
            "2.2- Atende à carga horária mínima presencial",
            "2.3- Equivalência entre carga horária on-line e presencial",
            "2.4- Carga horária distribuída e mensurada",
            "2.5- Regularidade das atividades formativas",
            "2.6- Regularidade dos encontros presenciais",
            "2.7- Regularidade dos encontros síncronos",
        ],
    },
    item3: {
        title: "Organização do trabalho pedagógico",
        data: [
            "3.1- Diversidade e dinamicidade de estratégias formativas",
            "3.2- Metodologia possibilita o trabalho coletivo",
            "3.3- Estratégias propiciam desenvolvimento responsivo das cursistas",
            "3.4- Flexibilidade para reorganização e replanejamento",
            "3.5- Estratégias para conter/combater a evasão",
        ],
    },
    item4: {
        title: "Organização dos processos avaliativos",
        data: [
            "4.1- Especificação sobre formas de avaliação e certificação",
            "4.2- Estratégias avaliativas coadunam com avaliação processual",
            "4.3- Avaliativos internos consideram feedbacks",
            "4.4- Registros e sistematização do percurso",
        ],
    },
    item5: {
        title: "Organização do roteiro de formação",
        data: [
            "5.1- Quantidade e qualidade das informações do roteiro",
            "5.2- Coerência entre planejamento e execução prática",
            "5.3- Coerência entre objetivos, metodologia, materiais e conteúdo",
        ],
    },
};

const calculateScore = (
    itemName: keyof FormData,
    selectedOptions: string[],
    percent?: number
): number => {
    let score: number;
    switch (itemName) {
        case "item1": {
            score = 0;
            if (percent !== undefined) {
                if (percent >= 100) score = 1;
                else if (percent >= 90) score = 0.75;
                else if (percent >= 80) score = 0.5;
                else score = 0;
            }
            return score;
        }
        case "item2":
            if (selectedOptions.includes("2.1- Carga horária total mínima")) return 1;
            if (selectedOptions.length >= 5) return 0.75;
            if (selectedOptions.length >= 3) return 0.5;
            if (selectedOptions.length >= 1) return 0.25;
            return 0;
        case "item3":
            if (selectedOptions.length === 5) return 1;
            if (selectedOptions.length >= 3) return 0.75;
            if (selectedOptions.length >= 2) return 0.5;
            if (selectedOptions.length === 1) return 0.25;
            return 0;
        case "item4":
            if (selectedOptions.length === 4) return 1;
            if (selectedOptions.length === 3) return 0.75;
            if (selectedOptions.length === 2) return 0.5;
            if (selectedOptions.length === 1) return 0.25;
            return 0;
        case "item5":
            if (selectedOptions.length === 3) return 1;
            if (selectedOptions.length === 2) return 0.75;
            if (selectedOptions.length === 1) return 0.5;
            return 0;
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
        field: { value: string[]; onChange: (value: string[]) => void },
        itemName: keyof FormData,
        value: string
    ) => {
        return (checked: boolean) => {
            const newValue = checked
                ? [...field.value, value]
                : field.value.filter((v) => v !== value);

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
                                                    <label
                                                        key={idx}
                                                        className={`flex items-center space-x-2 ${excludedItems.includes(itemName)
                                                            ? "opacity-50"
                                                            : ""
                                                            }`}
                                                    >
                                                        {value === "1.1- Alcance da formação" ? (
                                                            <>
                                                                <span>{value}</span>
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
                                                                    checked={field.value.includes(value)}
                                                                    onCheckedChange={handleCheckboxChange(
                                                                        field,
                                                                        itemName as keyof FormData,
                                                                        value
                                                                    )}
                                                                    disabled={excludedItems.includes(itemName)}
                                                                />
                                                                <span>{value}</span>
                                                            </>
                                                        )}
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
