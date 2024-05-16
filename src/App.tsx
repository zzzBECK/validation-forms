import { useState } from "react";
import { D1FirstModule } from "./components/D1FirstModule/d1FirstModule";
import { D2SecondModule } from "./components/D2SecondModule/d1SecondModule";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function App() {
  const [dimension, setDimension] = useState<string>();

  return (
    <main className="flex flex-col items-center w-screen min-h-screen container contain py-10">

      <Select onValueChange={(value) => setDimension(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a dimensão" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="d1">Dimensão 1</SelectItem>
            <SelectItem value="d2">Dimensão 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {dimension === "d1" &&
        <Tabs defaultValue="firstModule" className="w-full pt-10">
          <TabsList className="flex gap-4 w-full">
            <TabsTrigger className="w-full" value="d2FirstModule">
              D1 - CATEGORIA 1
            </TabsTrigger>
            <TabsTrigger className="w-full" value="d1SecondModule">
              D1 - CATEGORIA 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="d2FirstModule">
            <D1FirstModule />
          </TabsContent>
          <TabsContent value="d1SecondModule">
            <D2SecondModule />
          </TabsContent>
        </Tabs>}

      {dimension === "d2" &&
        <Tabs defaultValue="firstModule" className="w-full h-fit pt-10">
          <TabsList className="flex flex-col md:flex-row gap-4 w-full">
            <TabsTrigger className="w-full" value="d2FirstModule">
              D2 - CATEGORIA 1
            </TabsTrigger>
            <TabsTrigger className="w-full" value="d2SecondModule">
              D2 - CATEGORIA 2
            </TabsTrigger>
            <TabsTrigger className="w-full" value="d2ThirdModule">
              D2 - CATEGORIA 3
            </TabsTrigger>
            <TabsTrigger className="w-full" value="d2FourthModule">
              D2 - CATEGORIA 4
            </TabsTrigger>
          </TabsList>
          <TabsContent value="d2FirstModule">
            <D1FirstModule />
          </TabsContent>
        </Tabs>}

    </main>
  );
}

export default App;
