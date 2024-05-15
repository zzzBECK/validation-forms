import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

const formSchema = z.object({
    item1: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
    item2: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
    item3: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
    item4: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
    item5: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
    item6: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
    item7: z
        .array(z.string())
        .nonempty({ message: "Select at least one option" }),
});

type FormData = z.infer<typeof formSchema>;

const items = {
    item1: [
        "1.1- Docentes",
        "1.2- Coordenadores Pedagógicos",
        "1.3 -Gestores",
        "1.4- Equipes Técnicas",
        "1.5- Famílias dos Estudantes",
        "1.6 - Suportes Administrativos",
    ],
    item2: [
        "2.1- Levantamento e mapeamento dos profissionais da educação com deficiência e Transtorno do Espectro Autista",
    ],
    item3: [
        "3.1- Levantamento e mapeamento dos profissionais da educação que atuam em Escolas do Campo, Educação Bilíngue, Escolas Indígenas, Educação Especial",
    ],
    item4: [
        "4.1- Processo de alfabetização (1° e 2° anos do Ensino Fundamental)",
        "4.2 - Recomposição das aprendizagens (3°, 4° e 5° anos do Ensino Fundamental)",
    ],
    item5: [
        "5.1- Sinaliza uma proposta pedagógica na perspectiva interdisciplinar",
        "5.2- Contempla o bloco de conteúdo Número",
        "5.3- Contemplam os blocos de conteúdo: Números, Álgebra, Geometria, Grandezas e Medidas e Probabilidade e Estatística",
        "5.4- Sinalizam discussões e proposições no âmbito da Educação Especial",
        "5.5 – Sinalizam discussões e proposições no âmbito da Educação do Campo",
        "5.6 – Sinalizam discussões no âmbito da Educação Indígena",
        "Não se aplica",
    ],
    item6: [
        "6.1- Dentro da carga horária de trabalho",
        "6.2- Dentro de 1/3 da carga horária (coordenações, hora de atividades, planejamentos e reuniões)",
        "6.3- Sábados",
        "6.4 – Contraturno (para além da carga horária)",
    ],
    item7: [
        "7.1- 100%",
        "7.2- Entre 80 a 99%",
        "7.3- Entre 60 a 79%",
        "7.4 - Até 59%",
    ],
};

const calculateScore = (
    itemName: keyof FormData,
    selectedOptions: string[]
) => {
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
                    "4.2 - Recomposição das aprendizagens (3°, 4° e 5° anos do Ensino Fundamental)"
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
                    "4.2 - Recomposição das aprendizagens (3°, 4° e 5° anos do Ensino Fundamental)"
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
                    "6.4 – Contraturno (para além da carga horária)"
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
            if (selectedOptions.includes("7.4 - Até 59%")) return 0.25;
            return 0;
        default:
            return 0;
    }
};

export function FirstModule() {
    const [scoreItem1, setScoreItem1] = useState(0);
    const [scoreItem2, setScoreItem2] = useState(0);
    const [scoreItem3, setScoreItem3] = useState(0);
    const [scoreItem4, setScoreItem4] = useState(0);
    const [scoreItem5, setScoreItem5] = useState(0);
    const [scoreItem6, setScoreItem6] = useState(0);
    const [scoreItem7, setScoreItem7] = useState(0);
    const [finalResult, setFinalResut] = useState(0);

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

            if (itemName === "item5" && value === "Não se aplica") {
                newValue = checked ? [value] : [];
            } else {
                newValue = checked
                    ? [...field.value, value]
                    : field.value.filter((v: string) => v !== value);

                if (itemName === "item5" && newValue.includes("Não se aplica")) {
                    newValue = ["Não se aplica"];
                }

                if (itemName === "item7") {
                    newValue = [value];
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

    function onSubmit() {
        setFinalResut(
            (
                scoreItem1 +
                scoreItem2 +
                scoreItem3 +
                scoreItem4 +
                scoreItem5 +
                scoreItem6 +
                scoreItem7
            ) / 7
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
                        {Object.keys(formSchema.shape).map((itemName, index) => (
                            <FormField
                                key={itemName}
                                control={form.control}
                                name={itemName as keyof FormData}
                                render={({ field }) => (
                                    <FormItem className="justify-center flex flex-col">
                                        <FormLabel>
                                            Item {index + 1} - Score:{" "}
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
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                {items[itemName as keyof FormData].map((value) => (
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
                        {finalResult !== 0 && <div>{`Resultado final: ${finalResult}`}</div>}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
