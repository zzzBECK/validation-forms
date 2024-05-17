import { useState } from "react";
import { D1FirstModule } from "./components/D1FirstModule/d1FirstModule";
import { D1SecondModule } from "./components/D1SecondModule/d1SecondModule";
import { D2FirstModule } from "./components/D2FirstModule/d2FirstModule";
import { D2SecondModule } from "./components/D2SecondModule/d2SecondModule";
import { ModeToggle } from "./components/mode-toggle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function App() {
  const [dimension, setDimension] = useState<string>();

  return (
    <main className="flex flex-col items-center w-screen min-h-screen container contain py-10">

      <div className="flex w-full gap-4">
        <Select onValueChange={(value) => setDimension(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a dimensão" />
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
            <D1FirstModule />
          </TabsContent>
          <TabsContent value="d1SecondModule">
            <D1SecondModule />
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
            <D2FirstModule />
          </TabsContent>
          <TabsContent value="d2SecondModule">
            <D2SecondModule />
          </TabsContent>
        </Tabs>}

    </main>
  );
}

export default App;
