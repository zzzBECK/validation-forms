import { zodResolver } from "@hookform/resolvers/zod";
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
import { useD1Module } from "../useModule";

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
            if (selectedOptions.includes("3.3 -Encontros mensais")) return 0.5;
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
            if (selectedOptions.includes("4.2-Quinzenal")) return 0.75;
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

    const {
        m2ScoreItem1,
        m2SetScoreItem1,
        m2ScoreItem2,
        m2SetScoreItem2,
        m2ScoreItem3,
        m2SetScoreItem3,
        m2ScoreItem4,
        m2SetScoreItem4,
        m2ScoreItem5,
        m2SetScoreItem5,
        m2ScoreItem6,
        m2SetScoreItem6,
        m2ScoreItem7,
        m2SetScoreItem7,
        m2ScoreItem8,
        m2SetScoreItem8,
        m2ScoreItem9,
        m2SetScoreItem9,
        m2ScoreItem10,
        m2SetScoreItem10,
        m2FinalResult,
        m2SetFinalResult

    } = useD1Module();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
        },
    });

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
                    value === "10.3- Não há previsibilidade de acessibilidade para os encontros coletivos") ||
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
                    newValue = ["10.3- Não há previsibilidade de acessibilidade para os encontros coletivos"];
                }
            }

            field.onChange(newValue);

            const score = calculateScore(itemName, newValue);

            switch (itemName) {
                case "item1":
                    m2SetScoreItem1(score);
                    break;
                case "item2":
                    m2SetScoreItem2(score);
                    break;
                case "item3":
                    m2SetScoreItem3(score);
                    break;
                case "item4":
                    m2SetScoreItem4(score);
                    break;
                case "item5":
                    m2SetScoreItem5(score);
                    break;
                case "item6":
                    m2SetScoreItem6(score);
                    break;
                case "item7":
                    m2SetScoreItem7(score);
                    break;
                case "item8":
                    m2SetScoreItem8(score);
                    break;
                case "item9":
                    m2SetScoreItem9(score);
                    break;
                case "item10":
                    m2SetScoreItem10(score);
                    break;
                default:
                    break;
            }
        };
    };

    function onSubmit() {
        m2SetFinalResult(
            (
                m2ScoreItem1 +
                m2ScoreItem2 +
                m2ScoreItem3 +
                m2ScoreItem4 +
                m2ScoreItem5 +
                m2ScoreItem6 +
                m2ScoreItem7 +
                m2ScoreItem8 +
                m2ScoreItem9 +
                m2ScoreItem10) /
            10
        );
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
                                                        return m2ScoreItem1;
                                                    case "item2":
                                                        return m2ScoreItem2;
                                                    case "item3":
                                                        return m2ScoreItem3;
                                                    case "item4":
                                                        return m2ScoreItem4;
                                                    case "item5":
                                                        return m2ScoreItem5;
                                                    case "item6":
                                                        return m2ScoreItem6;
                                                    case "item7":
                                                        return m2ScoreItem7;
                                                    case "item8":
                                                        return m2ScoreItem8;
                                                    case "item9":
                                                        return m2ScoreItem9;
                                                    case "item10":
                                                        return m2ScoreItem10;
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
                        <Button type="submit">Calcular</Button>
                        {m2FinalResult !== 0 && (
                            <div>{`Resultado final: ${m2FinalResult}`}</div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
