
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, CreditCard } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from '@/lib/supabase';

const donationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Please enter a valid donation amount." }),
  message: z.string().optional(),
  transferConfirmation: z.string().min(2, { message: "Please confirm your transfer." }),
});

interface DonationFormProps {
  projectId?: string;
  projectName?: string;
  onSuccess?: () => void;
}

const DonationForm = ({ projectId, projectName, onSuccess }: DonationFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "50",
      message: "",
      transferConfirmation: "",
    },
  });

  const handleDonation = async (values: z.infer<typeof donationSchema>) => {
    setIsProcessing(true);

    try {
      const amount = parseFloat(values.amount);
      
      // Save donation to Supabase
      const { data, error } = await supabase
        .from('donations')
        .insert([
          {
            name: values.name,
            email: values.email,
            amount,
            message: values.message || null,
            project_id: projectId || null,
            project_name: projectName || null,
            transfer_confirmation: values.transferConfirmation,
            status: 'pending'
          }
        ])
        .select();
      
      if (error) throw error;

      // If this is a project donation, update the project's raised amount
      if (projectId) {
        // First get the current raised amount
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('raised')
          .eq('id', projectId)
          .single();
          
        if (!projectError && projectData) {
          // Update the project with the new total
          const newRaised = (projectData.raised || 0) + amount;
          await supabase
            .from('projects')
            .update({ raised: newRaised })
            .eq('id', projectId);
        }
      }

      setIsSuccess(true);

      toast.success("Donation successful", {
        description: `Thank you for your $${values.amount} donation${projectName ? ` to ${projectName}` : ''}!`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error("Donation failed", {
        description: "There was an error processing your donation. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-2xl mx-auto">
      {isSuccess ? (
        <Card className="w-full bg-green-50 border-green-200">
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
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDonation)} className="space-y-4 bg-white rounded-lg p-6 shadow-md">
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
                  <FormLabel>Donation Amount (₦)</FormLabel>
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
              <div className="flex items-center space-x-3 py-2">
                <CreditCard className="h-5 w-5 text-foundation-primary" />
                <span className="font-medium">Bank Transfer</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md text-sm mt-2">
                <p><strong>Bank Name:</strong> Zenith bank</p>
                <p><strong>Account Name:</strong> Lynda Oby Mbah</p>
                <p><strong>Account Number:</strong> 1020065693</p>
                <p><strong>Reference:</strong> Your Name or Email</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="transferConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm You Have Transferred</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., Done, I have sent it"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                <>Donate Now<Heart className="ml-2" size={16} /></>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DonationForm;
