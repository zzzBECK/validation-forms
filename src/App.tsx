import { FirstModule } from "./components/FirstModule/firstModule"
import { SecondModule } from "./components/SecondModule/secondModule"
import { ThirdModule } from "./components/ThirdModule/thirdModule"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"



function App() {

  return (
    <main className="flex justify-center items-center w-screen min-h-screen py-10">
      <Tabs defaultValue="firstModule" className="w-fit">
        <TabsList className="flex gap-4 w-full">
          <TabsTrigger className="w-1/3" value="firstModule">First Module</TabsTrigger>
          <TabsTrigger className="w-1/3" value="secondModule">Second Module</TabsTrigger>
          <TabsTrigger className="w-1/3" value="thirdModule">Third Module</TabsTrigger>
        </TabsList>
        <TabsContent value="firstModule">
          <FirstModule />
        </TabsContent>
        <TabsContent value="secondModule">
          <SecondModule />
        </TabsContent>
        <TabsContent value="thirdModule">
          <ThirdModule />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default App
