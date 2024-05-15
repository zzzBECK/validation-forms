import { FirstModule } from "./components/FirstModule/firstModule";
import { SecondModule } from "./components/SecondModule/secondModule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function App() {
  return (
    <main className="flex justify-center items-center w-screen min-h-screen py-10">
      <Tabs defaultValue="firstModule" className="w-fit">
        <TabsList className="flex gap-4 w-full">
          <TabsTrigger className="w-1/3" value="firstModule">
            D1 - CATEGORIA 1
          </TabsTrigger>
          <TabsTrigger className="w-1/3" value="secondModule">
            D1 - CATEGORIA 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="firstModule">
          <FirstModule />
        </TabsContent>
        <TabsContent value="secondModule">
          <SecondModule />
        </TabsContent>
        {/* <TabsContent value="thirdModule">
          <ThirdModule />
        </TabsContent> */}
      </Tabs>
    </main>
  );
}

export default App;
