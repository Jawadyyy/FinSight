import { FileText, Sparkles, Target, type LucideIcon } from 'lucide-react';

/** The brand purple, shared by every landing section. */
export const BRAND = '#644fef';

export const NAV = [
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
];

/**
 * The hero visual: the product's own output, fanned like a hand of cards.
 * FinSight does not issue cards — what it hands you is a pile of statement
 * lines already sorted, so that is what the arc shows.
 */
export const FANNED = [
  { merchant: 'FOODPANDA', amount: '1,850', category: 'Food', tint: '#eb6834' },
  { merchant: 'IESCO', amount: '8,920', category: 'Bills', tint: '#e34948' },
  { merchant: 'NETFLIX', amount: '2,500', category: 'Entertainment', tint: '#e87ba4' },
  { merchant: 'SHELL', amount: '5,780', category: 'Transport', tint: '#2a78d6' },
  { merchant: 'DARAZ.PK', amount: '3,299', category: 'Shopping', tint: '#4a3aa7' },
];

export const STEPS = [
  { step: '01', title: 'Upload a statement', body: 'Drop in a CSV or PDF from your bank. Duplicates from a re-upload are skipped.' },
  { step: '02', title: 'It gets sorted', body: 'Every row is parsed, matched to a merchant, and given a category you can change.' },
  { step: '03', title: 'See the picture', body: 'Budgets, spending by category, trends, and what you actually saved.' },
];

export const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileText,
    title: 'Reads messy statements',
    body: 'CSV and PDF, mixed date formats, multi-line rows, reference numbers glued to amounts. It handles the statements banks actually produce.',
  },
  {
    icon: Sparkles,
    title: 'Categorizes automatically',
    body: 'Known merchants match instantly. Everything else goes to AI, with a confidence score on each answer. You can correct any of it, and your correction sticks.',
  },
  {
    icon: Target,
    title: 'Budgets that track pace',
    body: 'Set a monthly limit per category and see spending against how far through the month you are, not just a running total.',
  },
];
