# Client Profile — Radius Agent

A rich client profile UI built with React, Tailwind CSS v4, and shadcn/ui.

**GitHub:** https://github.com/krishmjradiusagent/client-profile  
**Figma:** https://www.figma.com/design/SiG9YWtyZNqc3MdqC1pqKU/Unified-Client-Profile-Flow--Copy-

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI) |
| Animation | Framer Motion (`motion`) |
| WebGL FX | [ogl](https://github.com/oframe/ogl) |
| Icons | lucide-react |
| Themes | next-themes |

---

## Dev Setup

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build
```

---

## shadcn/ui — Install Commands

```bash
npx shadcn@latest add accordion
npx shadcn@latest add alert-dialog
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add calendar
npx shadcn@latest add card
npx shadcn@latest add carousel
npx shadcn@latest add checkbox
npx shadcn@latest add collapsible
npx shadcn@latest add command
npx shadcn@latest add dialog
npx shadcn@latest add drawer
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add input-otp
npx shadcn@latest add label
npx shadcn@latest add popover
npx shadcn@latest add progress
npx shadcn@latest add radio-group
npx shadcn@latest add resizable
npx shadcn@latest add scroll-area
npx shadcn@latest add select
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add sidebar
npx shadcn@latest add skeleton
npx shadcn@latest add slider
npx shadcn@latest add sonner
npx shadcn@latest add switch
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add textarea
npx shadcn@latest add toggle
npx shadcn@latest add toggle-group
npx shadcn@latest add tooltip
```

---

## Custom / React Bits Components

| Component | Source | Path |
|-----------|--------|------|
| `Aurora` | [React Bits](https://reactbits.dev) — WebGL aurora gradient | `ui/Aurora.tsx` |
| `Orb` | [React Bits](https://reactbits.dev) — WebGL orb shader | `ui/Orb.tsx` |
| `AuroraBars` | Custom bar animation | `ui/aurora-bars.tsx` |
| `FlipButton` | Custom flip interaction | `ui/flip-button.tsx` |

---

## Key Libraries

```bash
pnpm add ogl                                        # WebGL renderer (Aurora, Orb)
pnpm add motion                                     # Framer Motion
pnpm add lucide-react                               # Icons
pnpm add next-themes                                # Dark/light mode
pnpm add recharts                                   # Charts
pnpm add react-dnd react-dnd-html5-backend          # Drag and drop
pnpm add react-resizable-panels                     # Resizable layout
pnpm add sonner                                     # Toast notifications
pnpm add date-fns                                   # Date utilities
pnpm add tailwind-merge clsx class-variance-authority  # Class utilities
```
