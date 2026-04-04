'use client';

import React from 'react';
import { CardSplitAccordion, AccordionItemData } from '@/components/ui/card-split-accordion';
import { HiCursorArrowRipple } from 'react-icons/hi2';
import { Layers, Send } from 'lucide-react';
import { PiHandTap } from 'react-icons/pi';
import { IoIosTimer } from 'react-icons/io';

const FAQ_ITEMS: AccordionItemData[] = [
  {
    id: 1,
    title: 'What is Interaction Design?',
    icon: (
      <HiCursorArrowRipple className="-rotate-10 size-6 md:size-[1.625rem]" />
    ),
    content:
      'Interaction design focuses on creating engaging interfaces with well-thought-out behaviors and actions.',
  },
  {
    id: 2,
    title: 'Principles & Patterns',
    icon: <Layers className="size-6 md:size-[1.625rem]" />,
    content:
      'Fundamental guidelines and repeated solutions that ensure consistency and usability in design.',
  },
  {
    id: 3,
    title: 'Usability & Accessibility',
    icon: <PiHandTap className="-rotate-20 size-6 md:size-[1.625rem]" />,
    content:
      'Designing experiences that are easy to use and accessible to people of all abilities.',
  },
  {
    id: 4,
    title: 'Prototyping & Testing',
    icon: <Send className="size-6 md:size-[1.625rem]" />,
    content:
      'Rapid experimentation and validation of ideas through prototypes and real user testing.',
  },
  {
    id: 5,
    title: 'UX Optimisation',
    icon: <IoIosTimer className="size-6 md:size-[1.625rem]" />,
    content:
      'Improving user experience by analyzing behavior and refining interactions over time.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-10 px-8 max-w-[1200px] mx-auto w-full">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <CardSplitAccordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
