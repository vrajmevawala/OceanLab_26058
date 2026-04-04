'use client';

import React, { useState, type FC } from 'react';
import { motion, MotionConfig, type Transition } from 'motion/react';
import { ChevronDown, Send, Layers } from 'lucide-react';
import useMeasure from 'react-use-measure';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AccordionItemData {
  id: number;
  title: string;
  icon: React.ReactNode;
  content: string;
}

interface AccordionItemProps {
  item: AccordionItemData;
  setOpenId: (id: number | null) => void;
  index: number;
  total: number;
  openIndex: number;
}

interface AccordionProps {
  items?: AccordionItemData[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = 'var(--info)';
const BG_CARD = '#161b22';
const BG_PAGE = '#0d1117';
const BORDER = '#30363d';
const TEXT_PRIMARY = '#e6edf3';
const TEXT_MUTED = '#8b949e';

const springTransition: Transition = {
  type: 'spring',
  stiffness: 600,
  damping: 50,
  mass: 1,
};

// ─── Icons (inline SVG to avoid react-icons dependency issues) ────────────────

const CursorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
  </svg>
);

const HandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

const TimerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

// ─── Default Items ────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: AccordionItemData[] = [
  {
    id: 1,
    title: 'What is Interaction Design?',
    icon: <CursorIcon />,
    content:
      'Interaction design focuses on creating engaging interfaces with well-thought-out behaviors and actions.',
  },
  {
    id: 2,
    title: 'Principles & Patterns',
    icon: <Layers size={20} color={ACCENT} />,
    content:
      'Fundamental guidelines and repeated solutions that ensure consistency and usability in design.',
  },
  {
    id: 3,
    title: 'Usability & Accessibility',
    icon: <HandIcon />,
    content:
      'Designing experiences that are easy to use and accessible to people of all abilities.',
  },
  {
    id: 4,
    title: 'Prototyping & Testing',
    icon: <Send size={20} color={ACCENT} />,
    content:
      'Rapid experimentation and validation of ideas through prototypes and real user testing.',
  },
  {
    id: 5,
    title: 'UX Optimisation',
    icon: <TimerIcon />,
    content:
      'Improving user experience by analyzing behavior and refining interactions over time.',
  },
];

// ─── AccordionItem ────────────────────────────────────────────────────────────

const AccordionItem: FC<AccordionItemProps> = ({
  item,
  setOpenId,
  index,
  total,
  openIndex,
}) => {
  const [ref, bounds] = useMeasure();
  const isOpen = index === openIndex;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isBeforeOpen = index === openIndex - 1;
  const isAfterOpen = index === openIndex + 1;
  const isAlone = (isAfterOpen && isLast) || (isBeforeOpen && isFirst);

  // Border widths — collapse adjacent borders to avoid double borders
  const borderTopWidth = isFirst || isAfterOpen || isOpen ? 1 : 0;
  const borderBottomWidth = isLast || isBeforeOpen || isOpen ? 1 : 0;

  // Corner radii
  let tl = 0, tr = 0, bl = 0, br = 0;
  if (isOpen || isAlone) { tl = tr = bl = br = 20; }
  else if (isBeforeOpen) { bl = br = 20; }
  else if (isAfterOpen) { tl = tr = 20; }
  else if (isFirst) { tl = tr = 20; }
  else if (isLast) { bl = br = 20; }

  return (
    <MotionConfig transition={springTransition}>
      <motion.li layout style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        <motion.div
          animate={{
            borderTopLeftRadius: tl,
            borderTopRightRadius: tr,
            borderBottomLeftRadius: bl,
            borderBottomRightRadius: br,
            marginTop: isOpen ? 10 : 0,
            marginBottom: isOpen ? 10 : 0,
          }}
          style={{
            overflow: 'hidden',
            backgroundColor: BG_CARD,
            borderLeft: `1px solid ${BORDER}`,
            borderRight: `1px solid ${BORDER}`,
            borderTop: borderTopWidth ? `1px solid ${BORDER}` : 'none',
            borderBottom: borderBottomWidth ? `1px solid ${BORDER}` : 'none',
            willChange: 'transform',
          }}
        >
          {/* Trigger button */}
          <button
            onClick={() => setOpenId(isOpen ? null : item.id)}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Icon wrapper — fixed size so it never overlaps text */}
              <div style={{ width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              style={{ flexShrink: 0, marginLeft: 12 }}
            >
              <ChevronDown size={18} color={TEXT_MUTED} />
            </motion.div>
          </button>

          {/* Expandable content */}
          <motion.div
            initial={false}
            animate={{
              height: isOpen ? bounds.height : 0,
              opacity: isOpen ? 1 : 0,
            }}
            style={{ overflow: 'hidden', willChange: 'height, opacity' }}
          >
            <div ref={ref}>
              <div
                style={{
                  padding: '2px 18px 18px 52px',
                  fontSize: 14,
                  fontWeight: 400,
                  color: TEXT_MUTED,
                  lineHeight: 1.7,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {item.content}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.li>
    </MotionConfig>
  );
};

// ─── CardSplitAccordion ───────────────────────────────────────────────────────

export const CardSplitAccordion: FC<AccordionProps> = ({ items }) => {
  const defaultItems = items ?? DEFAULT_ITEMS;
  const [openId, setOpenId] = useState<number | null>(null);
  const openIndex = defaultItems.findIndex((item) => item.id === openId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: BG_PAGE,
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}
        >
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: 15, color: TEXT_MUTED, margin: 0 }}>
          Everything you need to know about Interaction Design and our process.
        </p>
      </div>

      {/* Accordion list */}
      <ul
        style={{
          width: '100%',
          maxWidth: 560,
          padding: 0,
          margin: 0,
          listStyle: 'none',
        }}
      >
        {defaultItems.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            setOpenId={setOpenId}
            index={index}
            total={defaultItems.length}
            openIndex={openIndex}
          />
        ))}
      </ul>
    </div>
  );
};