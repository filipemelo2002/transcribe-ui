
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AudioLines } from "lucide-react"

export function InputForm() {
  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        <CardTitle>Transcribe.ai</CardTitle>
        <CardDescription>Transcribe audio in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Label htmlFor="picture">Audio file</Label>
          <Input id="picture" type="file" />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline"><AudioLines/> Process</Button>
      </CardFooter>
    </Card>
  )
}


export const Dashboard = () => {
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground font-sans items-center justify-center">
      <div className="mt-auto mb-auto ml-auto mr-auto">
        <InputForm />
      </div>
    </div>
  )
}