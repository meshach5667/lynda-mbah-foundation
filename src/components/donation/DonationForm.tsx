import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, CreditCard } from 'lucide-react';
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

const donationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Please enter a valid donation amount." }),
  message: z.string().optional(),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"], {
    required_error: "Please select a payment method.",
  }),
});

interface DonationFormProps {
  projectId?: string;
  projectName?: string;
  onSuccess?: () => void;
}

const DonationForm = ({ projectId, projectName, onSuccess }: DonationFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasTransferred, setHasTransferred] = useState(false);

  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "50",
      message: "",
      paymentMethod: "credit_card",
    },
  });

  const selectedMethod = form.watch("paymentMethod");

  useEffect(() => {
    if (selectedMethod !== "bank_transfer") {
      setHasTransferred(false);
    }
  }, [selectedMethod]);

  const handleDonation = (values: z.infer<typeof donationSchema>) => {
    setIsProcessing(true);

    // Simulate donation processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      toast.success("Donation successful", {
        description: `Thank you for your $${values.amount} donation${projectName ? ` to ${projectName}` : ''}!`,
      });

      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-green-600 fill-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">Thank You!</h3>
          <p className="text-green-600 mb-4">
            Your donation makes a real difference in the lives of those we serve.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)} 
            variant="outline" 
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            Make Another Donation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleDonation)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donation Amount ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="5" 
                  step="5" 
                  placeholder="50" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="credit_card" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit/Debit Card
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="paypal" />
                    </FormControl>
                    <FormLabel className="font-normal">PayPal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bank_transfer" />
                    </FormControl>
                    <FormLabel className="font-normal">Bank Transfer</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedMethod === "bank_transfer" && (
          <div className="p-4 border rounded-md bg-yellow-50 text-sm text-gray-800 space-y-2">
            <p className="font-medium">Bank Transfer Details:</p>
            <ul className="list-disc list-inside">
              <li>Account Name: Green Sweep Initiative</li>
              <li>Bank Name: EcoBank</li>
              <li>Account Number: 1234567890</li>
              <li>SWIFT Code: ECOCNGLA</li>
            </ul>

            <div className="mt-3 flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="confirmTransfer" 
                checked={hasTransferred} 
                onChange={() => setHasTransferred(prev => !prev)} 
                className="h-4 w-4"
              />
              <label htmlFor="confirmTransfer" className="text-sm">
                I have completed the transfer.
              </label>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {projectName && (
          <div className="text-sm font-medium text-gray-500">
            Donating to: {projectName}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-foundation-accent hover:bg-foundation-highlight" 
          disabled={isProcessing || (selectedMethod === "bank_transfer" && !hasTransferred)}
        >
          {isProcessing ? (
            <>
              <span className="mr-2">Processing...</span>
              <span className="animate-spin">●</span>
            </>
          ) : (
            <>Donate Now<Heart className="ml-2" size={16} /></>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DonationForm;
