import { formatValue } from "@/helpers/formatValue";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
});

type FormData = z.infer<typeof formSchema>;

const items = {
    item1: {
        title: "Cronograma das demandas de formação",
        data: [
            "1.1- Semanais",
            "1.2- Quinzenais",
            "1.3– Mensais",
            "1.4– Semestrais",
            "1.5- Não há previsão de cronograma das demandas de formação",
        ],
    },
    item2: {
        title: "Encontros coletivos presenciais",
        data: [
            "2.1- Encontros semanais",
            "2.2- Encontros quinzenais",
            "2.3- Encontros mensais",
            "2.4- Encontros semestrais",
            "2.5– Não há previsão de encontros presenciais",
        ],
    },
    item3: {
        title:
            "Encontros síncronos em plataforma Virtual com mediação de profissional formador",
        data: [
            "3.1- Encontros semanais",
            "3.2- Encontros quinzenais",
            "3.3- Encontros mensais",
            "3.4- Encontros semestrais",
            "3.5– Não há previsão de encontros síncronos",
        ],
    },
    item4: {
        title: "Cronograma de atividades assíncronas",
        data: [
            "4.1- Semanal",
            "4.2- 0Quinzenal",
            "4.3- Mensal",
            "4.4- Semestral",
            "4.5– Não há previsão de atividades assíncronas",
        ],
    },
    item5: {
        title: "As atividades virtuais assíncronas contemplam propostas de estudos",
        data: [
            "5.1- Individual",
            "5.2- Em grupo",
            "5.3- Não há previsão de atividades assíncronas",
        ],
    },
    item6: {
        title: "A carga horária contempla momentos distintos de formação",
        data: [
            "6.1- Momentos presenciais coletivos",
            "6.2- Momentos de estudo individual",
            "6.3- Pesquisa",
            "6.4- Interação remota",
            "6.5- A carga horária não especifica a distribuição",
        ],
    },
    item7: {
        title: "Carga horária de referência",
        data: [
            "7.1- Atende a carga horária total mínima prevista",
            "7.2- Atende a carga horária presencial mínima prevista",
            "7.3- Atende a equivalência prevista da carga horária híbrida",
        ],
    },
    item8: {
        title: "Encontros coletivos presenciais",
        data: [
            "8.1- Encontros coletivos presenciais no ambiente escolar",
            "8.2- Encontros coletivos presenciais em outros espaços que favoreçam a interação entre profissionais de diferentes escolas",
            "8.3– Não há previsão de encontros coletivos presenciais",
        ],
    },
    item9: {
        title: "Encontros coletivos virtuais",
        data: [
            "9.1– Encontros coletivos síncronos entre pares em ambiente virtual",
            "9.2- Encontros coletivos síncronos que favoreçam a interação entre profissionais de diferentes escolas",
            "9.3- Não há previsão de encontros coletivos virtuais",
        ],
    },
    item10: {
        title: "Previsibilidade de acessibilidade nos encontros coletivos",
        data: [
            "10.1- Os espaços coletivos presenciais atendem os critérios de acessibilidade: arquitetura e de comunicação",
            "10.2- O ambiente virtual garante o acesso dos profissionais da educação com deficiência às tecnologias",
            "10.3- Não há previsibilidade de acessibilidade para os encontros coletivos",
        ],
    },
};

const calculateScore = (
    itemName: keyof FormData,
    selectedOptions: string[]
) => {
    switch (itemName) {
        case "item1":
            if (
                selectedOptions.includes(
                    "1.5- Não há previsão de cronograma das demandas de formação"
                )
            )
                return 0;
            if (selectedOptions.includes("1.4– Semestrais")) return 0.25;
            if (selectedOptions.includes("1.3– Mensais")) return 0.5;
            if (selectedOptions.includes("1.2- Quinzenais")) return 0.75;
            if (selectedOptions.includes("1.1- Semanais")) return 1;
            return 0;
        case "item2":
            if (
                selectedOptions.includes(
                    "2.5– Não há previsão de encontros presenciais"
                )
            )
                return 0;
            if (selectedOptions.includes("2.4- Encontros semestrais")) return 0.25;
            if (selectedOptions.includes("2.3- Encontros mensais")) return 0.5;
            if (selectedOptions.includes("2.2- Encontros quinzenais")) return 0.75;
            if (selectedOptions.includes("2.1- Encontros semanais")) return 1;
            return 0;
        case "item3":
            if (
                selectedOptions.includes("3.5– Não há previsão de encontros síncronos")
            )
                return 0;
            if (selectedOptions.includes("3.4- Encontros semestrais")) return 0.25;
            if (selectedOptions.includes("3.3- Encontros mensais")) return 0.5;
            if (selectedOptions.includes("3.2- Encontros quinzenais")) return 0.75;
            if (selectedOptions.includes("3.1- Encontros semanais")) return 1;
            return 0;
        case "item4":
            if (
                selectedOptions.includes(
                    "4.5– Não há previsão de atividades assíncronas"
                )
            )
                return 0;
            if (selectedOptions.includes("4.4- Semestral")) return 0.25;
            if (selectedOptions.includes("4.3- Mensal")) return 0.5;
            if (selectedOptions.includes("4.2- Quinzenal")) return 0.75;
            if (selectedOptions.includes("4.1- Semanal")) return 1;
            return 0;
        case "item5":
            if (
                selectedOptions.includes(
                    "5.3- Não há previsão de atividades assíncronas"
                )
            )
                return 0;
            if (selectedOptions.length === 1) return 0.5;
            if (selectedOptions.length === 2) return 1;
            return 0;
        case "item6":
            if (
                selectedOptions.includes(
                    "6.5- A carga horária não especifica a distribuição"
                )
            )
                return 0;
            if (selectedOptions.length === 1) return 0.25;
            if (selectedOptions.length === 2) return 0.5;
            if (selectedOptions.length === 3) return 0.75;
            if (selectedOptions.length === 4) return 1;
            return 0;
        case "item7":
            if (selectedOptions.length === 0) return 0;
            if (selectedOptions.length === 3) return 1;
            if (
                selectedOptions.includes(
                    "7.3- Atende a equivalência prevista da carga horária híbrida"
                )
            )
                return 0.75;

            if (
                selectedOptions.includes(
                    "7.2- Atende a carga horária presencial mínima prevista"
                )
            )
                return 0.5;
            if (
                selectedOptions.includes(
                    "7.1- Atende a carga horária total mínima prevista"
                )
            )
                return 0.25;
            return 0;
        case "item8":
            if (
                selectedOptions.includes(
                    "8.3– Não há previsão de encontros coletivos presenciais"
                )
            )
                return 0;
            if (selectedOptions.length === 1) return 0.75;
            if (selectedOptions.length === 2) return 1;
            return 0;
        case "item9":
            if (
                selectedOptions.includes(
                    "9.3- Não há previsão de encontros coletivos virtuais"
                )
            )
                return 0;
            if (selectedOptions.length === 1) return 0.75;
            if (selectedOptions.length === 2) return 1;
            return 0;
        case "item10":
            if (
                selectedOptions.includes(
                    "10.3- Não há previsibilidade de acessibilidade para os encontros coletivos"
                )
            )
                return 0;
            if (selectedOptions.length === 1) return 0.75;
            if (selectedOptions.length === 2) return 1;
            return 0;
        default:
            return 0;
    }
};

export function D2SecondModule() {
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
    const [finalResult, setFinalResut] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const savedFormData = JSON.parse(localStorage.getItem("d1m2") || "{}");

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
        },
    });

    useEffect(() => {
        form.watch((value) => {
            localStorage.setItem("d1m2", JSON.stringify(value));
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
        } = savedFormData;
        setScoreItem1(calculateScore("item1", item1 || []));
        setScoreItem2(calculateScore("item2", item2 || []));
        setScoreItem3(calculateScore("item3", item3 || []));
        setScoreItem4(calculateScore("item4", item4 || []));
        setScoreItem5(calculateScore("item5", item5 || []));
        setScoreItem6(calculateScore("item6", item6 || []));
        setScoreItem7(calculateScore("item7", item7 || []));
        setScoreItem7(calculateScore("item8", item8 || []));
        setScoreItem7(calculateScore("item9", item9 || []));
        setScoreItem7(calculateScore("item10", item10 || []));
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
                (itemName === "item5" &&
                    value === "5.3- Não há previsão de atividades assíncronas") ||
                (itemName === "item6" &&
                    value === "6.5- A carga horária não especifica a distribuição") ||
                (itemName === "item8" &&
                    value ===
                    "8.3– Não há previsão de encontros coletivos presenciais") ||
                (itemName === "item9" &&
                    value === "9.3- Não há previsão de encontros coletivos virtuais") ||
                (itemName === "item10" &&
                    value ===
                    "10.3- Não há previsibilidade de acessibilidade para os encontros coletivos") ||
                itemName === "item1" ||
                itemName === "item2" ||
                itemName === "item3" ||
                itemName === "item4"
            ) {
                newValue = checked ? [value] : [];
            } else {
                newValue = checked
                    ? [...field.value, value]
                    : field.value.filter((v: string) => v !== value);

                if (
                    itemName === "item5" &&
                    newValue.includes("5.3- Não há previsão de atividades assíncronas")
                ) {
                    newValue = ["5.3- Não há previsão de atividades assíncronas"];
                }

                if (
                    itemName === "item6" &&
                    newValue.includes(
                        "6.5- A carga horária não especifica a distribuição"
                    )
                ) {
                    newValue = ["6.5- A carga horária não especifica a distribuição"];
                }

                if (
                    itemName === "item8" &&
                    newValue.includes(
                        "8.3– Não há previsão de encontros coletivos presenciais"
                    )
                ) {
                    newValue = [
                        "8.3– Não há previsão de encontros coletivos presenciais",
                    ];
                }

                if (
                    itemName === "item9" &&
                    newValue.includes(
                        "9.3- Não há previsão de encontros coletivos virtuais"
                    )
                ) {
                    newValue = ["9.3- Não há previsão de encontros coletivos virtuais"];
                }

                if (
                    itemName === "item10" &&
                    newValue.includes(
                        "10.3- Não há previsibilidade de acessibilidade para os encontros coletivos"
                    )
                ) {
                    newValue = [
                        "10.3- Não há previsibilidade de acessibilidade para os encontros coletivos",
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
                default:
                    break;
            }
        };
    };

    function onSubmit() {
        setIsLoading(true);

        setFinalResut(
            (scoreItem1 +
                scoreItem2 +
                scoreItem3 +
                scoreItem4 +
                scoreItem5 +
                scoreItem6 +
                scoreItem7 +
                scoreItem8 +
                scoreItem9 +
                scoreItem10) /
            10
        );

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }

    return (
        <Card>
            <CardHeader />
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        {Object.keys(formSchema.shape).map((itemName) => (
                            <FormField
                                key={itemName}
                                control={form.control}
                                name={itemName as keyof FormData}
                                render={({ field }) => (
                                    <FormItem className="justify-center flex flex-col">
                                        <FormLabel>
                                            {items[itemName as keyof FormData].title} - Score:{" "}
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
                                                    default:
                                                        return 0;
                                                }
                                            })()}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                {items[itemName as keyof FormData].data.map((value) => (
                                                    <label
                                                        key={value}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            checked={field.value.includes(value)}
                                                            onCheckedChange={handleCheckboxChange(
                                                                field,
                                                                itemName as keyof FormData,
                                                                value
                                                            )}
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
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Calculando
                            </Button>
                        ) : (
                            <Button type="submit">Calcular</Button>
                        )}
                        {isLoading ? (
                            <div className="flex flex-col gap-4">
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-1/6 h-8" />
                                <Skeleton className="w-2/6 h-8" />
                            </div>
                        ) : (
                            finalResult !== 0 && (
                                <>
                                    <div>
                                        {`Item-1: ${formatValue(scoreItem1, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-2: ${formatValue(scoreItem2, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-3: ${formatValue(scoreItem3, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-4: ${formatValue(scoreItem4, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-5: ${formatValue(scoreItem5, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-6: ${formatValue(scoreItem6, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-7: ${formatValue(scoreItem7, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-8: ${formatValue(scoreItem8, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-9: ${formatValue(scoreItem9, { decimalPlace: 2 })}`}
                                    </div>
                                    <div>
                                        {`Item-10: ${formatValue(scoreItem10, { decimalPlace: 2 })}`}
                                    </div>
                                    <h1>Cálculo Resultado Final:</h1>
                                    <div>
                                        {`(${formatValue(scoreItem1, {
                                            decimalPlace: 2,
                                        })} + ${formatValue(scoreItem2, {
                                            decimalPlace: 2,
                                        })} + ${formatValue(scoreItem3, {
                                            decimalPlace: 2,
                                        })} + ${formatValue(scoreItem4, {
                                            decimalPlace: 2,
                                        })} + ${formatValue(scoreItem5, {
                                            decimalPlace: 2,
                                        })} + ${formatValue(scoreItem6, {
                                            decimalPlace: 2,
                                        })} + ${formatValue(scoreItem7, {
                                            decimalPlace: 2,
                                        })} + + ${formatValue(scoreItem8, {
                                            decimalPlace: 2,
                                        })} + + ${formatValue(scoreItem9, {
                                            decimalPlace: 2,
                                        })} + + ${formatValue(scoreItem10, {
                                            decimalPlace: 2,
                                        })}) / 10 = ${formatValue(finalResult, {
                                            decimalPlace: 2,
                                        })}`}
                                    </div>
                                </>
                            )
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
