import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
    item1: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a number between 1 and 5" }),
    item2: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a number between 1 and 5" }),
    item3: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a number between 1 and 5" }),
    item4: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a number between 1 and 5" }),
    item5: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a number between 1 and 5" }),
    item6: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a number between 1 and 5" }),
});

type FormData = z.infer<typeof formSchema>;

export function ThirdModule() {

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item1: "1",
            item2: "1",
            item3: "1",
            item4: "1",
            item5: "1",
            item6: "1",
        },
    });

    function onSubmit(values: FormData) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }


    return (
        <Card>
            <CardHeader />
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-center">
                        {(Object.keys(formSchema.shape) as Array<keyof FormData>).map((itemName, index) => (
                            <FormField
                                key={itemName}
                                control={form.control}
                                name={itemName}
                                render={({ field }) => (
                                    <FormItem className="min-h-[128px] justify-center flex flex-col">
                                        <FormLabel>Item {index + 1}</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5].map(value => (
                                                        <SelectItem key={value} value={value.toString()}>
                                                            {value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Select a value for item {index + 1}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}