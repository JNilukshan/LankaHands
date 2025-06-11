'use server';

/**
 * @fileOverview An AI-powered review wizard that helps customers write helpful reviews.
 *
 * - reviewWizard - A function that generates review suggestions based on product quality, delivery speed, and artisan engagement.
 * - ReviewWizardInput - The input type for the reviewWizard function.
 * - ReviewWizardOutput - The return type for the reviewWizard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewWizardInputSchema = z.object({
  productQuality: z
    .string()
    .describe('Description of the product quality, including materials and craftsmanship.'),
  deliverySpeed: z
    .string()
    .describe('Description of the delivery speed and packaging.'),
  artisanEngagement: z
    .string()
    .describe('Description of the artisan engagement and communication.'),
});
export type ReviewWizardInput = z.infer<typeof ReviewWizardInputSchema>;

const ReviewWizardOutputSchema = z.object({
  reviewSuggestion: z.string().describe('A suggested review incorporating details about product quality, delivery speed, and artisan engagement.'),
});
export type ReviewWizardOutput = z.infer<typeof ReviewWizardOutputSchema>;

export async function reviewWizard(input: ReviewWizardInput): Promise<ReviewWizardOutput> {
  return reviewWizardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewWizardPrompt',
  input: {schema: ReviewWizardInputSchema},
  output: {schema: ReviewWizardOutputSchema},
  prompt: `You are an AI assistant designed to help customers write helpful and informative reviews for products they have purchased.

  Based on the customer's feedback on product quality, delivery speed, and artisan engagement, generate a review suggestion that incorporates these details.

  Product Quality: {{{productQuality}}}
  Delivery Speed: {{{deliverySpeed}}}
  Artisan Engagement: {{{artisanEngagement}}}

  Review Suggestion:`,
});

const reviewWizardFlow = ai.defineFlow(
  {
    name: 'reviewWizardFlow',
    inputSchema: ReviewWizardInputSchema,
    outputSchema: ReviewWizardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
