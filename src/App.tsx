import { useState } from "react";
import { D1FirstModule } from "./components/D1FirstModule/d1FirstModule";
import { D1SecondModule } from "./components/D1SecondModule/d1SecondModule";
import { D2FirstModule } from "./components/D2FirstModule/d2FirstModule";
import { D2SecondModule } from "./components/D2SecondModule/d2SecondModule";
import { ModeToggle } from "./components/mode-toggle";
import { Card, CardContent } from "./components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const states = [
  { abbreviation: "AC", name: "Acre" },
  { abbreviation: "AL", name: "Alagoas" },
  { abbreviation: "AP", name: "Amapá" },
  { abbreviation: "AM", name: "Amazonas" },
  { abbreviation: "BA", name: "Bahia" },
  { abbreviation: "CE", name: "Ceará" },
  { abbreviation: "DF", name: "Distrito Federal" },
  { abbreviation: "ES", name: "Espírito Santo" },
  { abbreviation: "GO", name: "Goiás" },
  { abbreviation: "MA", name: "Maranhão" },
  { abbreviation: "MT", name: "Mato Grosso" },
  { abbreviation: "MS", name: "Mato Grosso do Sul" },
  { abbreviation: "MG", name: "Minas Gerais" },
  { abbreviation: "PA", name: "Pará" },
  { abbreviation: "PB", name: "Paraíba" },
  { abbreviation: "PR", name: "Paraná" },
  { abbreviation: "PE", name: "Pernambuco" },
  { abbreviation: "PI", name: "Piauí" },
  { abbreviation: "RJ", name: "Rio de Janeiro" },
  { abbreviation: "RN", name: "Rio Grande do Norte" },
  { abbreviation: "RS", name: "Rio Grande do Sul" },
  { abbreviation: "RO", name: "Rondônia" },
  { abbreviation: "RR", name: "Roraima" },
  { abbreviation: "SC", name: "Santa Catarina" },
  { abbreviation: "SP", name: "São Paulo" },
  { abbreviation: "SE", name: "Sergipe" },
  { abbreviation: "TO", name: "Tocantins" },
];

function App() {
  const [dimension, setDimension] = useState<string>();
  const [state, setState] = useState<string>();

  return (
    <main className="flex flex-col items-center w-screen min-h-screen container contain py-10">

      <div className="flex w-full gap-4">
        <Select onValueChange={(value) => setDimension(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a dimensão" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="d1">DIMENSÃO 1: ARQUITETURA INSTITUCIONAL DO PROGRAMA DE FORMAÇÃO</SelectItem>
              <SelectItem value="d2">{"DIMENSÃO 2: Aspectos metodológicos privilegiados na formação continuada".toUpperCase()}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ModeToggle />
      </div>

      <Select onValueChange={(value) => setState(value)}>
        <SelectTrigger className="w-full mt-5">
          <SelectValue placeholder="Selecione o estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {states.map((state) => (
              <SelectItem key={state.abbreviation} value={state.name}>{state.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {state ? (
        <>
          {dimension === "d1" &&
            <Tabs defaultValue="d1FirstModule" className="w-full pt-10">
              <TabsList className="flex flex-col md:flex-row gap-4 w-full">
                <TabsTrigger className="w-full" value="d1FirstModule">
                  CATEGORIA: ORGANIZAÇÃO DA OFERTA NO  ÂMBITO DA ALFABETIZAÇÃO E LETRAMENTO
                </TabsTrigger>
                <TabsTrigger className="w-full" value="d1SecondModule">
                  CATEGORIA: ORGANIZAÇÃO DA CARGA HORÁRIA DOS PERCURSOS FORMATIVOS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="d1FirstModule">
                <D1FirstModule state={state} />
              </TabsContent>
              <TabsContent value="d1SecondModule">
                <D1SecondModule state={state} />
              </TabsContent>
            </Tabs>}

          {dimension === "d2" &&
            <Tabs defaultValue="d2FirstModule" className="w-full h-fit pt-10">
              <TabsList className="flex flex-col md:flex-row gap-4 w-full">
                <TabsTrigger className="w-full" value="d2FirstModule">
                  {"CATEGORIA: Organização Pedagógica do Percurso Formativo".toUpperCase()}
                </TabsTrigger>
                <TabsTrigger className="w-full" value="d2SecondModule">
                  {"CATEGORIA: Metodologia do percurso formativo: aspectos sobre a organização do trabalho pedagógico".toUpperCase()}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="d2FirstModule">
                <D2FirstModule state={state} />
              </TabsContent>
              <TabsContent value="d2SecondModule">
                <D2SecondModule state={state} />
              </TabsContent>
            </Tabs>}
        </>
      ) : (<Card className="w-full h-[70vh] mt-5">
        <CardContent className="flex justify-center items-center w-full h-full">Selecione a dimensão e o estado</CardContent>
      </Card>)}

    </main>
  );
}

export default App;
