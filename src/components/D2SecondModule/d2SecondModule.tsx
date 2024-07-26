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
  excludeItems: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const items: Record<string, { title: string; data: string[] }> = {
  item1: {
    title: "Estratégias pedagógicas",
    data: [
      "1.1- Sinalizam práticas que privilegiem a fruição e experimentação com linguagens e suas expressões por meio de atividades artísticas, como pintura, música, teatro e poesia",
      "1.2- Organizam sequências de atividades que proporcionam apreciar as diversas linguagens artísticas: arte, música, dança, teatro, artes visuais",
      "1.3- Sinalizam práticas para apreciar a literatura infantil em sua diversidade",
      "1.4- Sinalizam práticas para lidar com textos variados com o intuito de descobrir a estética presente na literatura infantil",
      "1.5- Sinalizam práticas para vivenciar a fantasia e a imaginação",
      "1.6- Organizam vivencias que possibilitem explorar e expressar suas ideias, emoções e experiências de forma criativa e pessoal",
    ],
  },
  item2: {
    title:
      "O planejamento prevê momentos que privilegiam a “Escuta democrática” como base para a reflexão da prática pedagógica",
    data: [
      "2.1- Prevê momentos para apresentar as demandas e necessidades de formação e desenvolvimento profissional",
      "2.2- Apresenta flexibilidade no planejamento do percurso formativo para atender às demandas e necessidades dos cursistas",
      "2.3- Prevê momentos para troca de experiências exitosas",
      "2.4- Prevê momentos para levantar inquietações sobre o processo de alfabetização",
      "2.5- Privilegia momentos para compartilhamento de práticas sociais culturais",
      "2.6- Privilegia momentos de roda de conversas para conhecer, compartilhar e refletir sobre os conhecimentos prévios",
    ],
  },
  item3: {
    title:
      "Estratégias metodológicas visando à ampliação do repertório profissional",
    data: [
      "3.1- Contemplam espaços dialógicos entre a prática pedagógica e os conteúdos previstos",
      "3.2- Preveem momentos de reflexão, pesquisa, ação, descoberta, organização, fundamentação e revisão e construção teórica",
      "3.3- Preveem o acompanhamento sistematizado da prática pedagógica",
      "3.4- Contemplam espaços dialógicos entre a prática pedagógica e os conteúdos previstos na perspectiva inclusiva, no âmbito da Educação do Campo",
      "3.5- Contemplam espaços dialógicos entre a prática pedagógica e os conteúdos previstos na perspectiva inclusiva, no âmbito da Educação Especial",
      "3.6- Contemplam espaços dialógicos entre a prática pedagógica e os conteúdos previstos na perspectiva inclusiva, no âmbito da Educação Indígena",
      "3.7- Preveem, a partir dos conteúdos, sugestões de mudanças no contexto das práticas sociais, visando à reflexão crítica, como também, à transformação dessas práticas",
      "3.8- Preveem um espaço dialógico que contemple a relação teoria e prática a partir do compartilhamento de questões, levantamento de respostas, de análises, validações entre pares, e sistematizações conceituais para lidar com as demandas identificadas no processo de alfabetização",
      "3.9- Preveem atividades que promovam a conscientização sobre a identidade como parte de uma comunidade profissional de leitores e escritores",
    ],
  },
  item4: {
    title: "As práticas pedagógicas",
    data: [
      "4.1- Sinalizam o protagonismo dos profissionais da educação produzirem seus próprios planejamentos e recursos didáticos",
      "4.2- Preveem o processo criativo do trabalho docente, exerce o direito de pensar, elaborar, organizar e avaliar as suas ações no contexto escolar",
      "4.3- Preveem a análise crítica das atividades propostas em relação aos objetivos de aprendizagem",
      "4.4- Preveem a análise e escolha intencional dos objetivos de aprendizagem a partir das necessidades dos estudantes",
      "4.5- Preveem engajamento ético-político e estético dos profissionais da educação",
      "4.6- Preveem discussões sobre a equidade, diversidade, inclusão e justiça social",
    ],
  },
  item5: {
    title:
      "As práticas pedagógicas contemplam as concepções teóricos metodológicas indicadas para o ensino da leitura e da escrita das crianças a partir",
    data: [
      "5.1- Do reconhecimento do estudante como usuário competente e participante efetivo de práticas sociais que envolvem a leitura e a escrita",
      "5.2- Da construção de leitores ativos que percebem a leitura como forma de comunicar significados e de construir ativamente significados nos textos",
      "5.3- De atividades que condizem com textos que circulam em um contexto real",
    ],
  },
  item6: {
    title: "Atividades pedagógicas para ampliação do repertório didático",
    data: [
      "6.1- Prevê oficinas e/ou outras atividades semelhantes voltadas para as práticas pedagógicas",
      "6.2- Prevê estratégias colaborativas para refletir sobre atividades práticas em sala de aula",
      "6.3- Prevê visibilidade às diferentes realidades do cotidiano escolar para refletir, avaliar e trocar experiências entre pares",
      "6.4- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Projetos didáticos",
      "6.5- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Sequências didáticas",
      "6.6- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Pautas de reunião",
      "6.7- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Instrumentos de observação",
      "6.8- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Registro da prática",
      "6.9- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Jogos pedagógicos inéditos",
      "6.10- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Recursos pedagógicos inéditos",
      "6.11- Prevê a elaboração individual e/ou coletiva de instrumentos de trabalho pedagógico: Outros",
    ],
  },
  item7: {
    title:
      "As atividades preveem a discussão e proposição de materiais, recursos e instrumentos acessíveis na perspectiva",
    data: [
      "7.1- Adaptativa contemplando cada deficiência e/ou TEA",
      "7.2- Desenho Universal para as aprendizagens",
    ],
  },
  item8: {
    title:
      "Estratégias didáticas para o acompanhamento das aprendizagens dos profissionais da Educação",
    data: [
      "8.1- No decorrer do processo formativo privilegiam momentos de reflexão individual",
      "8.2- No decorrer do processo formativo privilegiam momentos de reflexão por meio de uma avaliação coletiva",
      "8.3- Registros sobre as percepções dos encontros formativos",
      "8.4- Registros indicativos de próximas temáticas a serem discutidas",
      "8.5- Momentos coletivos para compartilhar as experiências do processo formativo",
      "8.6- Autoavaliação",
      "8.7- Outras estratégias",
    ],
  },
  item9: {
    title: "Cronograma para o retorno dos feedbacks",
    data: [
      "9.1- Semanal",
      "9.2- Quinzenal",
      "9.3- Mensal",
      "9.4- Semestral",
      "9.5- Ao final de cada módulo",
    ],
  },
  item10: {
    title:
      "Formatos para as devolutivas sobre o processo de aprendizagem dos profissionais da Educação",
    data: ["10.1- Oral", "10.2- Escrito", "10.3- Oral e Escrito"],
  },
  item11: {
    title:
      "Formas de registro e de sistematização das aprendizagens dos profissionais da educação",
    data: [
      "11.1- Produtos individuais",
      "11.2- Produtos individuais: Diário profissional formativo",
      "11.3- Produtos individuais: Portfólio",
      "11.4- Produtos individuais: Outras formas de registro",
      "11.5- Produtos compartilhados entre os pares",
      "11.6- Produtos compartilhados entre os pares: Caderno compartilhado de registros",
      "11.7- Produtos compartilhados entre os pares: Caderno compartilhado de sugestões de práticas pedagógicas e gestão",
      "11.8- Produtos compartilhados entre os pares: Caderno compartilhado de resenhas de textos, filmes ou outras indicações de ampliação de repertório",
      "11.9- Produtos compartilhados entre os pares: Coletânea de relatos de práticas ou artigos",
      "11.10- Produtos compartilhados entre os pares: Coletânea de sequência didáticas e projetos didáticos desenvolvidos pelos profissionais da educação participantes",
      "11.11- Produtos compartilhados entre os pares: Coletâneas de pautas ou reuniões de formação e de gestão escolar, com comentários analíticos do grupo",
    ],
  },
  item12: {
    title:
      "Formas de disseminação e compartilhamento das aprendizagens e dos resultados do processo formativo",
    data: [
      "12.1- Modalidade: Presencial",
      "12.2- Modalidade: Virtual",
      "12.3- Modalidade: Híbrida",
      "12.4- Modalidade: Não há previsão para a disseminação e compartilhamento das aprendizagens e resultados",
    ],
  },
  item13: {
    title:
      "Formas de disseminação e compartilhamento das aprendizagens e dos resultados do processo formativo",
    data: [
      "13.1- Os seminários serão realizados contemplando as esferas da federação: Seminários municipais",
      "13.2- Os seminários serão realizados contemplando as esferas da federação: Seminários regionais",
      "13.3- Os seminários serão realizados contemplando as esferas da federação: Seminários estaduais",
      "13.4- Modalidade: Não há previsão para a disseminação e compartilhamento das aprendizagens e resultados",
    ],
  },
  item14: {
    title:
      "Previsão de formatos para a disseminação e compartilhamento das aprendizagens consolidadas",
    data: [
      "14.1- Painéis",
      "14.2- Grupos de discussão",
      "14.3- Oficinas",
      "14.4- Debates",
      "14.5- Mesas Temáticas",
      "14.6- Conferências",
      "14.7- Outros formatos",
    ],
  },
  item15: {
    title: "A análise dos Livros Didáticos objetiva",
    data: [
      "15.1- Verificar a consonância com os referenciais curriculares dos territórios",
      "15.2- Identificar a conformidade com a perspectiva inclusiva",
      "15.3- Analisar se a proposta reconhece a alfabetização como processo discursivo",
      "15.4- Discutir o protagonismo docente para selecionar e adaptar os temas e as atividades propostas nos livros de acordo com as necessidades dos estudantes",
      "15.5- Refletir sobre o planejamento e criação de atividades complementares que estimulem a reflexão e o debate",
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
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 3) return 0.5;
      if (selectedOptions.length <= 5) return 0.75;
      if (selectedOptions.length === 6) return 1;
      return 0;
    case "item2":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 3) return 0.5;
      if (selectedOptions.length <= 5) return 0.75;
      if (selectedOptions.length === 6) return 1;
      return 0;
    case "item3":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 4) return 0.5;
      if (selectedOptions.length <= 8) return 0.75;
      if (selectedOptions.length === 9) return 1;
      return 0;
    case "item4":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 3) return 0.5;
      if (selectedOptions.length <= 5) return 0.75;
      if (selectedOptions.length === 6) return 1;
      return 0;
    case "item5":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.5;
      if (selectedOptions.length === 2) return 0.75;
      if (selectedOptions.length === 3) return 1;
      return 0;
    case "item6":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 5) return 0.5;
      if (selectedOptions.length <= 10) return 0.75;
      if (selectedOptions.length === 11) return 1;
      return 0;
    case "item7":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.75;
      if (selectedOptions.length === 2) return 1;
      return 0;
    case "item8":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 3) return 0.5;
      if (selectedOptions.length <= 6) return 0.75;
      if (selectedOptions.length === 7) return 1;
      return 0;
    case "item9":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.includes("9.4- Semestral")) return 0.25;
      if (
        selectedOptions.includes("9.3- Mensal") ||
        selectedOptions.includes("9.5")
      )
        return 0.5;
      if (selectedOptions.includes("9.2- Quinzenal")) return 0.75;
      if (selectedOptions.includes("9.1- Semanal")) return 1;
      return 0;
    case "item10":
      if (selectedOptions.length === 0) return 0;
      if (
        selectedOptions.includes("10.1- Oral") &&
        selectedOptions.includes("10.2- Escrito") &&
        selectedOptions.includes("10.3- Oral e Escrito")
      )
        return 1;
      if (
        selectedOptions.includes("10.1- Oral") &&
        selectedOptions.includes("10.2- Escrito")
      )
        return 0.75;
      if (
        selectedOptions.includes("10.1- Oral") ||
        selectedOptions.includes("10.2- Escrito")
      )
        return 0.5;
      return 0;
    case "item11":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length <= 3) return 0.25;
      if (selectedOptions.length <= 5) return 0.5;
      if (selectedOptions.length <= 10) return 0.75;
      if (selectedOptions.length === 11) return 1;
      return 0;
    case "item12":
      if (selectedOptions.includes("12.1- Modalidade: Presencial")) return 0.75;
      if (selectedOptions.includes("12.2- Modalidade: Virtual")) return 0.5;
      if (selectedOptions.includes("12.3- Modalidade: Híbrida")) return 1;
      if (
        selectedOptions.includes(
          "12.4- Modalidade: Não há previsão para a disseminação e compartilhamento das aprendizagens e resultados"
        )
      )
        return 0;
      return 0;
    case "item13":
      if (
        selectedOptions.includes(
          "13.4- Modalidade: Não há previsão para a disseminação e compartilhamento das aprendizagens e resultados"
        )
      ) {
        return 0;
      }
      if (selectedOptions.length > 0) {
        if (selectedOptions.length === 3) return 1;
        else {
          return selectedOptions.length * 0.33;
        }
      } else {
        return 0;
      }
    case "item14":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length <= 2) return 0.25;
      if (selectedOptions.length <= 4) return 0.5;
      if (selectedOptions.length <= 6) return 0.75;
      if (selectedOptions.length === 7) return 1;
      return 0;
    case "item15":
      if (selectedOptions.length === 0) return 0;
      if (selectedOptions.length === 1) return 0.25;
      if (selectedOptions.length <= 3) return 0.5;
      if (selectedOptions.length === 4) return 0.75;
      if (selectedOptions.length === 5) return 1;
      return 0;
    default:
      return 0;
  }
};

interface Props {
  state: string;
}

export function D2SecondModule({ state }: Props) {
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
    excludeItems: [],
  };

  const savedFormData = useMemo(() => {
    return JSON.parse(localStorage.getItem("d2m2") || "{}");
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
      excludeItems: savedFormData.excludeItems || [],
    },
  });

  useEffect(() => {
    form.watch((value) => {
      localStorage.setItem("d2m2", JSON.stringify(value));
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

      if (itemName === "item9" || itemName === "item12") {
        newValue = checked ? [value] : [];
      } else {
        // eslint-disable-next-line prefer-const
        newValue = checked
          ? [...field.value, value]
          : field.value.filter((v: string) => v !== value);

        if (
          itemName === "item10" &&
          value === "10.3- Oral e Escrito" &&
          checked
        ) {
          newValue = ["10.1- Oral", "10.2- Escrito", "10.3- Oral e Escrito"];
        }

        if (
          itemName === "item13" &&
          value ===
            "13.4- Modalidade: Não há previsão para a disseminação e compartilhamento das aprendizagens e resultados" &&
          checked
        ) {
          newValue = [
            "13.4- Modalidade: Não há previsão para a disseminação e compartilhamento das aprendizagens e resultados",
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
        default:
          break;
      }
    };
  };

  const handleResetForm = () => {
    localStorage.removeItem("d2m2");
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
    documentTitle: `Dimensão 2 - Categoria 2 - ${state}`,
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

      if (finalResult !== 0) {
        onSubmit();
      }
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
        <h1 className="flex w-fit text-2xl md:text-3xl font-bold">{`Dimensão 2 - Categoria 2 - ${state}`}</h1>
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
                            className={`flex items-center space-x-2 ${
                              excludedItems.includes(itemName)
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
                {[...Array(15 - excludedItems.length)].map((_, index) => (
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
                    ]
                      .filter(Boolean)
                      .join(" + ")}) / ${
                      15 - excludedItems.length
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
