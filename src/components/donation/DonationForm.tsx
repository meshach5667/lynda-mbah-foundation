
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, CreditCard } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const donationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Please enter a valid donation amount." }),
  message: z.string().optional(),
  paymentMethod: z.literal("bank_transfer"),
})

interface DonationFormProps {
  projectId?: string;
  projectName?: string;
  onSuccess?: () => void;
}

const DonationForm = ({ projectId, projectName, onSuccess }: DonationFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  
  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "50",
      message: "",
      paymentMethod: "bank_transfer",
    },
  });

  const handleDonation = (values: z.infer<typeof donationSchema>) => {
    setIsProcessing(true);
    
    // Show bank details instead of processing payment
    setShowBankDetails(true);
    setIsProcessing(false);
    
    // Show success toast
    toast.success("Please complete your bank transfer", {
      description: `Bank details have been provided for your $${values.amount} donation${projectName ? ` to ${projectName}` : ''}.`,
    });
  };

  const handleConfirmation = () => {
    setIsSuccess(true);
    if (onSuccess) {
      onSuccess();
    }
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

  if (showBankDetails) {
    return (
      <Card className="w-full max-w-md mx-auto border-foundation-accent">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold text-center mb-4">Bank Transfer Details</h3>
          <div className="space-y-4 mb-6">
            <div className="bg-foundation-accent/10 p-4 rounded-md">
              <p className="font-semibold text-foundation-accent">Bank Name</p>
              <p>Universal Bank</p>
            </div>
            <div className="bg-foundation-accent/10 p-4 rounded-md">
              <p className="font-semibold text-foundation-accent">Account Name</p>
              <p>Lynda Mbah Foundation</p>
            </div>
            <div className="bg-foundation-accent/10 p-4 rounded-md">
              <p className="font-semibold text-foundation-accent">Account Number</p>
              <p>1234567890</p>
            </div>
            <div className="bg-foundation-accent/10 p-4 rounded-md">
              <p className="font-semibold text-foundation-accent">Reference</p>
              <p>{projectName ? `Donation-${projectName}` : 'Donation-General'}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Please use the reference above when making your transfer so we can properly allocate your donation.
          </p>
          <Button 
            onClick={handleConfirmation}
            className="w-full bg-foundation-accent hover:bg-foundation-highlight"
          >
            I've Completed My Transfer
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

        <div className="bg-gray-50 p-4 rounded-md mb-2">
          <FormLabel className="mb-2 block">Payment Method</FormLabel>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" checked readOnly />
            <FormLabel htmlFor="bank_transfer" className="font-normal cursor-pointer">
              Bank Transfer
            </FormLabel>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You'll receive our bank details to complete your transfer.
          </p>
        </div>

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
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="mr-2">Processing...</span>
              <span className="animate-spin">●</span>
            </>
          ) : (
            <>Continue<Heart className="ml-2" size={16} /></>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DonationForm;
