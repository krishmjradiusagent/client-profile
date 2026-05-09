import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClientRightPanel } from './ClientRightPanel';
import { useTheme } from 'next-themes';
import { ChevronRight, ChevronDown, ChevronLeft, Plus, MessageSquare, Bell, Activity as ActivityIcon, StickyNote, Building2, Briefcase, Mail, Phone, MapPin, Archive, FileTextIcon, Sparkles, Sun, Moon, PhoneCall, MessageCircle, Smartphone, RefreshCw, Clock, Ban, X, Pencil, Trash2, MoreVertical, Send, CheckCircle2, XCircle, GripVertical, Users, Droplet } from 'lucide-react';
import { DSButton, DSBadge } from './ds';
import { cn } from './ui/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from './ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { Separator } from './ui/separator';
import { FlipButton } from './ui/flip-button';
import { RainbowButton } from './ui/rainbow-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { AddFamilyMemberDialog } from './client-profile/AddFamilyMemberDialog';
import { AddCollaboratorDialog } from './client-profile/AddCollaboratorDialog';
import { BRBCCard } from './client-profile/BRBCCard';
import type { FamilyMemberDraft } from './client-profile/AddFamilyMemberDialog';
import type { CollaboratorDraft } from './client-profile/AddCollaboratorDialog';
import type { BRBCAgreementData } from './client-profile/BRBCCard';
import imgAvatar from "figma:asset/425014815828544c6be381aa86661be1b4dad5c3.png";

function InfIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" />
    </svg>
  );
}

function SidebarMetadataRow({ label, value, variant = 'default' }: {
  label: string;
  value: string;
  variant?: 'default' | 'accent';
}) {
  return (
    <div className={cn(
      'flex min-h-12 w-full items-center justify-between border-b border-border px-4 py-0 text-sm',
      variant === 'accent'
        ? 'bg-sky-50 dark:bg-sky-950/40'
        : 'bg-emerald-50 dark:bg-emerald-950/40'
    )}>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-none">{label}</span>
      <span className={cn('text-sm font-semibold leading-none',
        variant === 'accent'
          ? 'text-sky-900 dark:text-sky-300'
          : 'text-emerald-900 dark:text-emerald-300'
      )}>{value}</span>
    </div>
  );
}

function SidebarRow({ icon: Icon, label, right }: {
  icon?: React.ElementType;
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 min-h-12 px-4 py-0 border-b border-border">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span className="flex-1 text-sm font-medium text-muted-foreground leading-none">{label}</span>
      {right}
    </div>
  );
}

export function ThreePanelClientProfile() {
  const [activeTab, setActiveTab] = useState('activity');
  const [noteText, setNoteText] = useState('');
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [melSummaryExists, setMelSummaryExists] = useState(true);
  const [melGenerating, setMelGenerating] = useState(false);
  const [expandedPast, setExpandedPast] = useState<number | null>(null);
  const [melOpen, setMelOpen] = useState(true);

  // Contact data
  const contactEmails = [
    { id: 'e1', value: 'violet.cole@email.com', label: 'Primary' },
    { id: 'e2', value: 'v.cole@techsolutions.com', label: 'Work' },
    { id: 'e3', value: 'violet.cole.backup@email.com', label: 'Personal' },
  ];
  const contactPhones = [
    { id: 'p1', value: '(555) 123-4567', label: 'Mobile' },
    { id: 'p2', value: '(555) 987-6543', label: 'Work' },
  ];

  // Family members state
  const [familyMembers, setFamilyMembers] = useState([
    { id: 'fm1', name: 'Smith Zeglaya', relationship: 'Spouse', phone: '(818) 888-1234', email: 'smith.z@email.com', initials: 'SZ', color: 'from-pink-400 to-violet-400' },
    { id: 'fm2', name: 'Emma Cole', relationship: 'Child', phone: '', email: 'emma.cole@email.com', initials: 'EC', color: 'from-sky-400 to-blue-500' },
  ]);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [deleteFamilyTarget, setDeleteFamilyTarget] = useState<{ id: string; name: string } | null>(null);

  // Collaborators state
  const [collaborators, setCollaborators] = useState([
    { id: 'c1', name: 'Monica Miller', role: 'Co-agent', access: 'Full access', initials: 'MM', color: 'from-pink-400 to-violet-400', isInvited: false },
    { id: 'c2', name: 'David Chen', role: 'T.C.', access: 'Default level access', initials: 'DC', color: 'from-sky-400 to-blue-500', isInvited: false },
    { id: 'c3', name: 'Sarah Wilson', role: 'Lender', access: 'View only', initials: 'SW', color: 'from-emerald-400 to-teal-500', isInvited: true },
  ]);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [removeCollabTarget, setRemoveCollabTarget] = useState<{ id: string; name: string } | null>(null);

  // BRBC
  const [brbcAgreement] = useState<BRBCAgreementData>({
    status: 'agent_signature_pending',
    createdDate: 'May 1, 2026',
    recipients: [
      { name: 'You (Agent)', role: 'Agent', email: 'agent@radius.com', initials: 'AG', signingStatus: 'pending' },
      { name: 'Violet Cole', role: 'Buyer', email: 'violet.cole@email.com', initials: 'VC', signingStatus: 'signed' },
    ],
  });

  // Custom Fields
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [customFieldTab, setCustomFieldTab] = useState<'my' | 'team'>('my');
  const [customFields, setCustomFields] = useState([
    { id: 'cf1', name: 'Lead Temperature', type: 'Text', visibility: 'me', value: 'Warm' },
    { id: 'cf2', name: 'Follow-up Date', type: 'Date', visibility: 'team', value: '2025-02-01' },
  ]);
  const [showAddCustomField, setShowAddCustomField] = useState(false);
  const [cfDraft, setCfDraft] = useState({ name: '', type: 'Text', visibility: 'me' });
  // BRBC entries (supports multiple)
  const [brbcEntries] = useState([{
    status: 'agent_signature_pending' as const,
    createdDate: 'May 1, 2026',
    recipients: [
      { name: 'You (Agent)', role: 'Agent' as const, email: 'agent@radius.com', initials: 'AG', signingStatus: 'pending' as const },
      { name: 'Violet Cole', role: 'Buyer' as const, email: 'violet.cole@email.com', initials: 'VC', signingStatus: 'signed' as const },
    ],
  }]);

  const pastSummaries = [
    { date: 'Oct 12, 2025', preview: 'Client app activity reviewed. No new transaction movement.', full: 'Violet\'s client app showed last activity on Oct 12, 2025. No new transaction movement detected. Relationship and contact details remain unchanged.' },
    { date: 'Jun 3, 2024',  preview: 'Client added from Radius Marketplace and assigned to Monica Miller.', full: 'Violet Cole was added via Radius Marketplace on Jun 3, 2024. Assigned to Monica Miller as primary agent. Initial client type set to New Client.' },
  ];

  const handleGenerateMel = () => {
    setMelGenerating(true);
    setTimeout(() => { setMelGenerating(false); setMelSummaryExists(true); }, 1800);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`flex-1 h-screen flex overflow-hidden ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'}`}>
          {/* LEFT PANEL - always dark sidebar */}
          <Sidebar
            collapsible="none"
            className={`w-[288px] border-r ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}
            style={isDark ? {
              '--sidebar': '#1a1a1a',
              '--sidebar-foreground': '#e5e5e5',
              '--sidebar-border': '#2d2d2d',
              '--sidebar-accent': '#262626',
              '--sidebar-accent-foreground': '#ffffff',
            } as React.CSSProperties : {
              '--sidebar': '#ffffff',
              '--sidebar-foreground': '#171717',
              '--sidebar-border': '#e5e5e5',
              '--sidebar-accent': '#f5f5f5',
              '--sidebar-accent-foreground': '#171717',
            } as React.CSSProperties}
          >
          <SidebarHeader className={`px-4 pt-3 pb-4 border-b ${isDark ? 'border-[#2d2d2d]' : 'border-[#e5e5e5]'}`}>
            {/* Back nav */}
            <button className={`flex items-center gap-1.5 text-xs mb-4 -ml-0.5 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
              <span>Back to active clients</span>
            </button>

          {/* Profile Card + Tags wrapper */}
          <div className="flex flex-col items-center w-full mb-3">
          <div className={`group relative rounded-xl border overflow-hidden w-full z-10 ${isDark ? 'bg-[#262626] border-[#3d3d3d]' : 'bg-white border-slate-200'}`}>
            {/* Hover actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button className={`flex items-center justify-center h-6 w-6 rounded-md transition-colors ${isDark ? 'bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                <Pencil className="h-3 w-3" />
              </button>
              <button className={`flex items-center justify-center h-6 w-6 rounded-md transition-colors ${isDark ? 'bg-red-900/40 hover:bg-red-900/70 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-500'}`}>
                <Archive className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3">
              <Avatar className={`h-11 w-11 shrink-0 ring-2 ${isDark ? 'ring-[#3d3d3d]' : 'ring-slate-200'}`}>
                <AvatarImage src={imgAvatar} alt="Violet Cole" className="object-cover object-center" />
                <AvatarFallback className={`text-sm ${isDark ? 'bg-[#3d3d3d] text-white' : 'bg-slate-100 text-slate-700'}`}>VC</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className={`text-sm font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>Violet Cole</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Palo Alto, CA</p>
              </div>
            </div>
            <div className={`h-px ${isDark ? 'bg-[#3d3d3d]' : 'bg-slate-200'}`} />
            <div className="flex items-center px-3 py-2 gap-0">
              {[
                { label: 'Buyer',    cls: isDark ? 'text-emerald-400' : 'text-emerald-600' },
                { label: 'Seller',   cls: isDark ? 'text-blue-400'    : 'text-blue-600'    },
                { label: 'Landlord', cls: isDark ? 'text-teal-400'    : 'text-teal-600'    },
                { label: 'Tenant',   cls: isDark ? 'text-purple-400'  : 'text-purple-600'  },
              ].map(({ label, cls }, i, arr) => (
                <React.Fragment key={label}>
                  <span className={`text-[11px] font-medium ${cls}`}>{label}</span>
                  {i < arr.length - 1 && (
                    <span className={`inline-block w-px h-3 mx-2 self-center rounded-full ${isDark ? 'bg-[#3d3d3d]' : 'bg-slate-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className={`h-px ${isDark ? 'bg-[#3d3d3d]' : 'bg-slate-200'}`} />
            <div className="grid grid-cols-3">
              <button className="flex items-center justify-center py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all duration-150">
                <PhoneCall className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center py-2.5 border-x border-blue-400 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white transition-all duration-150">
                <MessageSquare className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center py-2.5 bg-violet-500 hover:bg-violet-600 active:scale-95 text-white transition-all duration-150">
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tags sub-card — attached below */}
          <div
            className="w-[calc(100%-32px)] -mt-px rounded-b-2xl rounded-t-none border border-t-0 border-border bg-card px-3 py-1.5 z-0 cursor-default"
            onMouseEnter={() => setTagsExpanded(true)}
            onMouseLeave={() => setTagsExpanded(false)}
          >
            <div
              className="overflow-hidden transition-[max-height] duration-[280ms]"
              style={{ maxHeight: tagsExpanded ? '80px' : '16px', transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)' }}
            >
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="text-[10px] font-medium text-muted-foreground shrink-0">Tags:</span>
              {[
                { tag: '901',          cls: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800/50 dark:text-stone-300 dark:border-transparent' },
                { tag: 'First Client', cls: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:border-transparent' },
                { tag: 'Buyer',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-transparent' },
                { tag: 'Lease',        cls: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-transparent' },
                { tag: 'FSBO',         cls: 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-transparent' },
                { tag: 'Investor',     cls: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/50 dark:text-purple-300 dark:border-transparent' },
                { tag: 'Future',       cls: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/50 dark:text-teal-300 dark:border-transparent' },
              ].map(({ tag, cls }) => (
                <span key={tag} className={cn('inline-flex items-center h-4 rounded-full border px-1.5 text-[9px] font-medium whitespace-nowrap leading-none', cls)}>{tag}</span>
              ))}
            </div>
            </div>
          </div>
          </div>{/* end wrapper */}

          {/* Status and Owner */}
          <div className="space-y-2">
            <Select defaultValue="new-client">
              <SelectTrigger className={`w-full text-xs h-8 ${isDark ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-700'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-client">New Client</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="monica">
              <SelectTrigger className={`w-full text-xs h-8 ${isDark ? 'bg-[#262626] border-[#3d3d3d] text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-[10px] bg-pink-500 text-white">MM</AvatarFallback>
                  </Avatar>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monica">Monica Miller</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Mobile clients + Client App — banner rows */}
          <div className="mt-2 border-y border-border -mx-4">
            <div className="relative flex items-center gap-2 px-4 py-2.5 overflow-hidden bg-blue-50 dark:bg-blue-950/40">
              <Droplet className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="text-xs text-blue-700 dark:text-blue-300 flex-1 truncate">My mobile clients</span>
              <Button size="sm" className="h-6 text-[10px] px-2 font-medium bg-blue-500 hover:bg-blue-600 active:scale-95 text-white transition-all duration-150 border-0">Claim Lead</Button>
              <motion.span
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
                initial={{ x: "-100%" }}
                animate={{ x: "300%" }}
                transition={{ repeat: Infinity, repeatDelay: 1.2, duration: 1.4, ease: "easeInOut" }}
              />
            </div>
            <Separator />
            <div className="flex items-center gap-2 px-4 py-2.5">
              <Smartphone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground flex-1">Client App</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[10px] text-muted-foreground">Last active Oct 12</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="h-6 text-[10px] px-2 ml-1 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white transition-all duration-150 border-0">Invite</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem>Invite via email</DropdownMenuItem>
                  <DropdownMenuItem>Invite via text</DropdownMenuItem>
                  <DropdownMenuItem>Copy invite</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-0 gap-0">
          {/* Mel Summary — premium AI card */}
          <Collapsible open={melOpen} onOpenChange={setMelOpen}>
            <div className="relative overflow-hidden border-b border-border bg-background">
              {/* Header row */}
              <CollapsibleTrigger asChild>
                <button onClick={() => setMelOpen(o => !o)} className="relative flex w-full items-center justify-between px-4 pt-3 pb-2 text-left">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">Mel Summary</span>
                    {melSummaryExists && (
                      <span className="text-[11px] text-muted-foreground font-normal">· Updated today</span>
                    )}
                  </span>
                  <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', melOpen ? 'rotate-180' : '')} />
                </button>
              </CollapsibleTrigger>

              {/* CTA — always visible */}
              <div className="relative px-4 pb-3">
                <RainbowButton
                  onClick={handleGenerateMel}
                  disabled={melGenerating}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                    <InfIcon className="h-4 w-4 text-violet-500" />
                    {melGenerating ? 'Generating…' : 'Summarise, Violet'}
                  </span>
                  <span className="flex items-center gap-0.5 rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                    <span>⌘</span><span>S</span>
                  </span>
                </RainbowButton>
              </div>

              {/* Collapsible body */}
              <CollapsibleContent>
                <div className="relative px-4 pb-4 flex flex-col gap-3">
                  <Separator className="bg-border/60" />

                  {melSummaryExists ? (
                    <div className="rounded-lg border border-violet-100 bg-white/60 p-3 flex flex-col gap-2 dark:border-violet-900/30 dark:bg-violet-950/20">
                      <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                        Violet is a multi-role client connected to buyer, seller, landlord, and tenant workflows. She was added from Radius Marketplace and is currently marked as New Client. Monica Miller owns the relationship. She has one spouse relationship on file and client app activity was last seen Oct 12, 2025.
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-muted-foreground">Generated by Mel · Today</p>
                        <button className="text-[11px] font-medium text-violet-600 dark:text-violet-400 hover:underline">
                          View all
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Generate a quick client summary using profile details, relationships, source, status, and recent activity.
                    </p>
                  )}

                  {pastSummaries.length > 0 && (
                    <div className="flex flex-col">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Past summaries</p>
                      {pastSummaries.map((s, i) => (
                        <div key={i} className="border-t border-border/60 first:border-0">
                          <button
                            className="w-full flex items-center justify-between py-2 text-left group hover:bg-muted/40 -mx-1 px-1 rounded transition-colors"
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                              <span className="text-[11px] font-medium text-muted-foreground">{s.date}</span>
                              <span className="text-xs text-muted-foreground truncate">{s.preview}</span>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground shrink-0 transition-colors" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>

            </div>
          </Collapsible>

          {/* Co-agent */}
          <Accordion type="single" collapsible defaultValue="coagent">
            <AccordionItem value="coagent" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border [&[data-state=open]]:text-foreground transition-colors duration-150">
                Co-agent
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-sky-400 to-blue-500 text-white">SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-tight">Sarah Johnson</p>
                    <p className="text-[11px] mt-0.5 text-muted-foreground truncate">sarah.johnson@realty.com</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Contact */}
          <Accordion type="single" collapsible defaultValue="contact">
            <AccordionItem value="contact" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border [&[data-state=open]]:text-foreground transition-colors duration-150">
                <span className="flex items-center gap-2">
                  Contact
                  <Badge className="h-4 px-1.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border-border">{contactEmails.length + contactPhones.length + 1}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {[
                  ...contactEmails.map((e, i) => ({ type: 'email' as const, id: e.id, value: e.value, label: e.label, rowIdx: i })),
                  ...contactPhones.map((p, i) => ({ type: 'phone' as const, id: p.id, value: p.value, label: p.label, rowIdx: contactEmails.length + i })),
                  { type: 'address' as const, id: 'addr', value: '123 Mission Street, Palo Alto, CA 54323', label: '', rowIdx: contactEmails.length + contactPhones.length },
                ].map((item, listIdx, arr) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.rowIdx * 0.055, duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="group flex items-center gap-2.5 min-h-10 px-4 py-1.5">
                      {/* Colored icon pill */}
                      <span className={cn(
                        'flex items-center justify-center h-6 w-6 rounded-full shrink-0',
                        item.type === 'email'   && (isDark ? 'bg-blue-500/15'    : 'bg-blue-50'),
                        item.type === 'phone'   && (isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'),
                        item.type === 'address' && (isDark ? 'bg-rose-500/15'    : 'bg-rose-50'),
                      )}>
                        {item.type === 'email'   && <Mail    className="h-3 w-3 text-blue-500" />}
                        {item.type === 'phone'   && <Phone   className="h-3 w-3 text-emerald-500" />}
                        {item.type === 'address' && <MapPin  className="h-3 w-3 text-rose-500" />}
                      </span>
                      <p className="text-xs leading-tight text-foreground flex-1 truncate">{item.value}</p>
                      {item.label && (
                        <Badge variant="outline" className={cn(
                          'text-[10px] h-4 px-2 rounded-full shrink-0 font-normal border',
                          isDark ? 'border-[#3d3d3d] text-gray-400' : 'border-gray-200 text-gray-500'
                        )}>
                          {item.label}
                        </Badge>
                      )}
                      <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                        <button className={`p-1 rounded ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Pencil className="h-3 w-3 text-muted-foreground" /></button>
                        {item.type !== 'address' && <button className={`p-1 rounded ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Trash2 className="h-3 w-3 text-muted-foreground" /></button>}
                      </div>
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><button className="p-1 rounded"><MoreVertical className="h-3.5 w-3.5 text-muted-foreground" /></button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-28">
                            <DropdownMenuItem><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                            {item.type !== 'address' && <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {listIdx < arr.length - 1 && <div className={`h-px mx-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`} />}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (contactEmails.length + contactPhones.length + 1) * 0.055 + 0.1, duration: 0.2 }}
                  className={`px-4 py-2.5 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-100'}`}
                >
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3 w-3" /> Add contact detail
                  </button>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* AI Prospecting */}
          <div className="group flex items-center gap-3 min-h-12 px-4 py-0 border-b border-border">
            <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium text-muted-foreground leading-none">AI Prospecting</span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted mr-1">
              <Pencil className="h-3 w-3 mr-0.5" />Edit
            </button>
            <Switch defaultChecked className="scale-75 origin-right" />
          </div>

          {/* AI Chat Replies */}
          <div className="flex items-center gap-3 min-h-12 px-4 py-0 border-b border-border">
            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium text-muted-foreground leading-none">AI chat replies</span>
            <Switch className="scale-75 origin-right" />
          </div>

          {/* Buyer/Tenant Representation */}
          <Accordion type="single" collapsible>
            <AccordionItem value="brbc" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border">
                <span className="flex items-center gap-2 flex-1">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  Buyer/Tenant Representation
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                {brbcEntries.length === 0 ? (
                  <div className="px-4 py-4 space-y-2.5">
                    <p className="text-xs text-muted-foreground">No buyer representation added yet</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="w-full text-xs h-8">
                          <Plus className="h-3 w-3 mr-1" />Add Buyer Representation
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem>Create New</DropdownMenuItem>
                        <DropdownMenuItem>Upload Existing Form</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="px-4 py-3 space-y-3">
                    {brbcEntries.map((entry, idx) => (
                      <div key={idx} className={cn('space-y-2', idx > 0 && 'pt-3 border-t border-border')}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <FileTextIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs font-medium text-foreground">BRBC</span>
                          </div>
                          <Badge variant="outline" className={cn(
                            'text-[10px] h-5 px-1.5 shrink-0 rounded-full',
                            entry.status === 'agent_signature_pending' || entry.status === 'buyer_signature_pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : entry.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          )}>
                            {entry.status === 'agent_signature_pending' ? 'Your sig. pending'
                              : entry.status === 'buyer_signature_pending' ? 'Buyer sig. pending'
                              : entry.status === 'completed' ? 'Completed'
                              : entry.status === 'draft_ready' ? 'Draft ready'
                              : entry.status === 'expired' ? 'Expired'
                              : entry.status === 'declined' ? 'Declined'
                              : 'Not started'}
                          </Badge>
                        </div>
                        {(entry.status === 'agent_signature_pending' || entry.status === 'buyer_signature_pending') && (
                          <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2">
                            <Clock className="h-3 w-3 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-700 leading-tight">
                              {entry.status === 'agent_signature_pending' ? 'Your signature is pending.' : 'Waiting for buyer signature.'}
                            </p>
                          </div>
                        )}
                        {entry.recipients.length > 0 && (
                          <div className={`rounded-lg border overflow-hidden ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
                            {entry.recipients.map((r, i) => {
                              const signed = r.signingStatus === 'signed';
                              const dec = r.signingStatus === 'declined';
                              return (
                                <div key={i} className={cn('flex items-center gap-2 px-2.5 py-1.5', i > 0 && (isDark ? 'border-t border-[#2d2d2d]' : 'border-t border-gray-100'))}>
                                  <Avatar className="h-6 w-6 shrink-0">
                                    <AvatarFallback className={`text-[9px] font-semibold ${isDark ? 'bg-[#3d3d3d] text-white' : 'bg-slate-200 text-slate-700'}`}>{r.initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1 text-[11px] font-medium truncate text-foreground">{r.name}</span>
                                  {signed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                                  {dec && <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                                  {!signed && !dec && <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex gap-1.5">
                          {entry.status === 'agent_signature_pending' && (
                            <Button size="sm" className="flex-1 text-xs h-7">Review &amp; Sign</Button>
                          )}
                          {entry.status === 'not_started' && (
                            <Button size="sm" className="flex-1 text-xs h-7"><Plus className="h-3 w-3 mr-1" />Create BRBC</Button>
                          )}
                          {entry.status === 'draft_ready' && (
                            <Button size="sm" className="flex-1 text-xs h-7"><Send className="h-3 w-3 mr-1" />Send for Sig.</Button>
                          )}
                          {(entry.status === 'expired' || entry.status === 'declined') && (
                            <Button size="sm" className="flex-1 text-xs h-7"><Plus className="h-3 w-3 mr-1" />New BRBC</Button>
                          )}
                          <Button size="sm" variant="outline" className="text-xs h-7">View</Button>
                        </div>
                      </div>
                    ))}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">
                          <Plus className="h-3 w-3" />Add another
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem>Create New</DropdownMenuItem>
                        <DropdownMenuItem>Upload Existing Form</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Family Members */}
          <Accordion type="single" collapsible>
            <AccordionItem value="family" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border [&[data-state=open]]:text-foreground transition-colors duration-150">
                <span className="flex items-center gap-2 flex-1">
                  Family Members
                  {familyMembers.length > 0 && <Badge className="h-4 px-1.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border-border">{familyMembers.length}</Badge>}
                  <span className="ml-auto flex items-center gap-1 mr-1">
                    <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); }} onKeyDown={e => e.key==='Enter'&&e.stopPropagation()} className={`p-1 rounded cursor-pointer ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`} title="Send app invite"><Send className="h-3.5 w-3.5 text-muted-foreground" /></span>
                    <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); setShowAddFamily(true); }} onKeyDown={e => e.key==='Enter'&&(e.stopPropagation(),setShowAddFamily(true))} className={`p-1 rounded cursor-pointer ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Plus className="h-3.5 w-3.5 text-muted-foreground" /></span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                {familyMembers.length === 0 ? (
                  <p className="text-xs px-4 py-2.5 text-muted-foreground">No family members added.</p>
                ) : familyMembers.map((m, i) => (
                  <div key={m.id}>
                    <div className="group flex items-start gap-3 px-4 py-2.5">
                      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                        <AvatarFallback className={`text-[10px] font-semibold bg-gradient-to-br ${m.color} text-white`}>{m.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-xs font-medium text-foreground">{m.name}</p>
                          <Badge variant="outline" className={cn('text-[10px] h-4 px-2 rounded-full font-normal', isDark ? 'border-[#3d3d3d] text-gray-400' : 'border-gray-200 text-gray-500')}>{m.relationship}</Badge>
                        </div>
                        {m.email && (
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={cn('flex items-center justify-center h-4 w-4 rounded-full shrink-0', isDark ? 'bg-blue-500/15' : 'bg-blue-50')}>
                              <Mail className="h-2.5 w-2.5 text-blue-500" />
                            </span>
                            <a href={`mailto:${m.email}`} className="text-[11px] text-blue-600 underline underline-offset-2 truncate hover:text-blue-700">{m.email}</a>
                          </div>
                        )}
                        {m.phone && (
                          <div className="flex items-center gap-1.5">
                            <span className={cn('flex items-center justify-center h-4 w-4 rounded-full shrink-0', isDark ? 'bg-emerald-500/15' : 'bg-emerald-50')}>
                              <Phone className="h-2.5 w-2.5 text-emerald-500" />
                            </span>
                            <a href={`tel:${m.phone}`} className="text-[11px] text-emerald-600 underline underline-offset-2 truncate hover:text-emerald-700">{m.phone}</a>
                          </div>
                        )}
                      </div>
                      <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 mt-0.5">
                        <button className={`p-1 rounded ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Pencil className="h-3 w-3 text-muted-foreground" /></button>
                        <button onClick={() => setDeleteFamilyTarget({ id: m.id, name: m.name })} className={`p-1 rounded ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Trash2 className="h-3 w-3 text-muted-foreground" /></button>
                      </div>
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><button className="p-1 rounded"><MoreVertical className="h-3.5 w-3.5 text-muted-foreground" /></button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-28">
                            <DropdownMenuItem><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteFamilyTarget({ id: m.id, name: m.name })} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {i < familyMembers.length - 1 && <div className={`h-px mx-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`} />}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Collaborators */}
          <Accordion type="single" collapsible>
            <AccordionItem value="collaborators" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border [&[data-state=open]]:text-foreground transition-colors duration-150">
                <span className="flex items-center gap-2 flex-1">
                  Collaborators
                  {collaborators.length > 0 && <Badge className="h-4 px-1.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border-border">{collaborators.length}</Badge>}
                  <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); setShowAddCollaborator(true); }} onKeyDown={e => e.key==='Enter'&&(e.stopPropagation(),setShowAddCollaborator(true))} className={`ml-auto mr-1 p-1 rounded cursor-pointer ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Plus className="h-3.5 w-3.5 text-muted-foreground" /></span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                {collaborators.length === 0 ? (
                  <p className="text-xs px-4 py-2.5 text-muted-foreground">No collaborators added.</p>
                ) : collaborators.map((c, i) => (
                  <div key={c.id}>
                    <div className="group flex items-center gap-3 min-h-12 px-4 py-1.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className={`text-[10px] font-semibold bg-gradient-to-br ${c.color} text-white`}>{c.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-medium text-foreground">{c.name}</p>
                          <Badge variant="outline" className={cn('text-[10px] h-4 px-2 rounded-full font-normal', isDark ? 'border-[#3d3d3d] text-gray-400' : 'border-gray-200 text-gray-500')}>{c.role}</Badge>
                          {c.isInvited && <Badge variant="outline" className="text-[10px] h-4 px-2 rounded-full bg-amber-50 text-amber-700 border-amber-200">Invited</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{c.access}</p>
                      </div>
                      <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                        <button className={`p-1 rounded ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Pencil className="h-3 w-3 text-muted-foreground" /></button>
                        <button onClick={() => setRemoveCollabTarget({ id: c.id, name: c.name })} className={`p-1 rounded ${isDark ? 'hover:bg-[#3d3d3d]' : 'hover:bg-gray-100'}`}><Trash2 className="h-3 w-3 text-muted-foreground" /></button>
                      </div>
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><button className="p-1 rounded"><MoreVertical className="h-3.5 w-3.5 text-muted-foreground" /></button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-28">
                            <DropdownMenuItem><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRemoveCollabTarget({ id: c.id, name: c.name })} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {i < collaborators.length - 1 && <div className="h-px border-b border-border mx-4" />}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Details - moved up, open by default, includes Added on + Source */}
          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border">
                Details
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                <div className="px-4 py-2">
                  {[
                    ['Added on', 'JUN 3 2024'],
                    ['Source', 'Radius Marketplace'],
                    ['Agent', 'Blaize Zeglaya'],
                    ['Timeline', '0-3 Months'],
                  ].map(([k, v], i, arr) => (
                    <React.Fragment key={k}>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[11px] text-muted-foreground">{k}</span>
                        <span className="text-[11px] font-medium text-foreground">{v}</span>
                      </div>
                      {i < arr.length - 1 && <Separator className="opacity-20" />}
                    </React.Fragment>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Custom Fields */}
          <Accordion type="single" collapsible>
            <AccordionItem value="custom-fields" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border">
                Custom Fields
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                {/* Segmented control */}
                <div className="px-4 pt-3 pb-2">
                  <div className={`flex rounded-md p-0.5 ${isDark ? 'bg-[#2a2a2a]' : 'bg-muted'}`}>
                    {(['my', 'team'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setCustomFieldTab(tab)}
                        className={cn(
                          'flex-1 text-xs py-1 rounded-sm transition-colors font-medium',
                          customFieldTab === tab
                            ? isDark ? 'bg-[#3d3d3d] text-white shadow-sm' : 'bg-white text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {tab === 'my' ? 'My Fields' : 'Team Fields'}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Field rows */}
                {customFields.filter(f => customFieldTab === 'my' ? f.visibility === 'me' : f.visibility === 'team').map((f, i, arr) => (
                  <React.Fragment key={f.id}>
                    <div className="group flex items-center gap-2 px-4 py-2">
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.visibility === 'me' ? 'Only for me' : 'Shared to everyone'}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] h-4 px-2 rounded-full shrink-0 font-normal">{f.type}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted shrink-0">
                            <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {i < arr.length - 1 && <Separator className="mx-4 opacity-30" />}
                  </React.Fragment>
                ))}
                {customFields.filter(f => customFieldTab === 'my' ? f.visibility === 'me' : f.visibility === 'team').length === 0 && (
                  <p className="text-xs text-muted-foreground px-4 py-2.5">No fields yet.</p>
                )}
                <div className="px-4 py-2.5 border-t border-border">
                  <button onClick={() => setShowAddCustomField(true)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3 w-3" />Add Custom Field
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Additional Details */}
          <Accordion type="single" collapsible>
            <AccordionItem value="additional" className="border-none">
              <AccordionTrigger className="px-4 py-0 min-h-12 text-sm font-medium text-muted-foreground hover:no-underline hover:text-foreground border-b border-border">
                Additional Details
              </AccordionTrigger>
              <AccordionContent className="border-b border-border pb-0">
                <div className="px-4 py-2">
                  {[
                    ['Gender','Female'],['Location','Palo Alto, CA'],['Birthday','Mar 15, 1985'],
                    ['Spouse Birthday','Jul 22, 1983'],['Home Anniversary','Jun 10, 2015'],
                    ['Company','TechSolutions Inc.'],['Website','violet.techsolutions.com'],
                    ['Facebook','—'],['Twitter','—'],['LinkedIn','—'],
                    ['Attorney','James Parker'],['First Call Date','JUN 3 2024'],
                    ['Close Date','—'],['Commission %','3%'],['Priority Status','High'],
                    ['Last Visit','Jan 12, 2025'],['Listings Viewed','24'],
                    ['Showing Requests','6'],['Favorites','8'],
                  ].map(([k, v], i, arr) => (
                    <React.Fragment key={k}>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[11px] text-muted-foreground">{k}</span>
                        <span className="text-[11px] font-medium text-foreground">{v}</span>
                      </div>
                      {i < arr.length - 1 && <Separator className="opacity-20" />}
                    </React.Fragment>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Background hidden — data preserved in future data model */}
        </SidebarContent>

        <SidebarFooter className="px-4 py-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              <span>{isDark ? 'Dark mode' : 'Light mode'}</span>
            </div>
            <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} className="scale-75 origin-right" />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* MIDDLE PANEL - Content */}
      <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
        <div className="p-6 space-y-6">
          {/* Header with Tabs */}
          <div className={`flex items-center gap-1 border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
            {[
              { id: 'activity', icon: ActivityIcon, label: 'Activity' },
              { id: 'notes', icon: StickyNote, label: 'Notes' },
              { id: 'properties', icon: Building2, label: 'Properties' },
              { id: 'offers', icon: Briefcase, label: 'Offers' },
              { id: 'reminders', icon: Bell, label: 'Reminders' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors ${
                  activeTab === id
                    ? isDark ? 'border-white text-white' : 'border-black text-black'
                    : isDark ? 'border-transparent text-gray-500 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Note Composer */}
          <Card className={`p-4 shadow-sm ${isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gradient-to-br from-background via-blue-50/60 to-violet-50/40 border-blue-200/60'}`}>
            <Textarea
              placeholder="Add notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className={`min-h-[80px] resize-none ${isDark ? 'bg-[#262626] border-[#3d3d3d] text-white placeholder:text-gray-500' : 'border-gray-200'}`}
            />
            <div className="flex items-center justify-end gap-2 mt-3">
              <Select defaultValue="general">
                <SelectTrigger className={`w-[140px] ${isDark ? 'bg-[#262626] border-[#3d3d3d] text-white' : 'border-gray-200'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="search">Search</SelectItem>
                </SelectContent>
              </Select>
              <DSButton size="sm" className={isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}>Add Note</DSButton>
            </div>
          </Card>

          {/* Tab Content */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select defaultValue="all">
                  <SelectTrigger className={`w-[180px] ${isDark ? 'bg-[#1a1a1a] border-[#2d2d2d] text-white' : 'border-gray-200'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                  </SelectContent>
                </Select>
                <DSButton variant="ghost" size="sm" className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}>
                  Export Activity
                </DSButton>
              </div>
              <div className="space-y-4">
                <div className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Today 15 Jan 2025</div>
                {[
                  { text: 'Mortgage status pre-approved.' },
                  { text: '{Client_name} started a search for "2-bed condos under $800K in San Francisco."' },
                  { text: '{Agent_name} started a search for default "New Market for the client in Palo Alto."' },
                ].map((item, i) => (
                  <Card key={i} className={`p-4 shadow-sm ${isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gradient-to-br from-background via-blue-50/60 to-violet-50/40 border-blue-200/60'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{item.text}</p>
                    <p className="text-xs text-gray-500 mt-1">less than a minute ago</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {['notes', 'properties', 'offers', 'reminders'].includes(activeTab) && (
            <Card className={`p-8 shadow-sm text-center ${isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gradient-to-br from-background via-blue-50/60 to-violet-50/40 border-blue-200/60'}`}>
              <p className="text-sm text-gray-500">No {activeTab} yet</p>
            </Card>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <ClientRightPanel isDark={isDark} />
      </div>

      {/* Custom Field Dialog */}
      <Dialog open={showAddCustomField} onOpenChange={o => !o && setShowAddCustomField(false)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Add Custom Field</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Field Name</Label>
              <Input placeholder="e.g. Lead Temperature" value={cfDraft.name} onChange={e => setCfDraft(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Field Type</Label>
              <div className="flex gap-2">
                {['Text', 'Date', 'Link'].map(t => (
                  <button key={t} onClick={() => setCfDraft(d => ({ ...d, type: t }))}
                    className={cn('flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors',
                      cfDraft.type === t ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:text-foreground')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <RadioGroup value={cfDraft.visibility} onValueChange={v => setCfDraft(d => ({ ...d, visibility: v }))} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="me" id="vis-me" />
                  <Label htmlFor="vis-me" className="font-normal cursor-pointer">Only for me</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="team" id="vis-team" />
                  <Label htmlFor="vis-team" className="font-normal cursor-pointer">Share to everyone</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCustomField(false)}>Cancel</Button>
            <Button disabled={!cfDraft.name.trim()} onClick={() => {
              if (!cfDraft.name.trim()) return;
              setCustomFields(prev => [...prev, { id: `cf${Date.now()}`, name: cfDraft.name.trim(), type: cfDraft.type, visibility: cfDraft.visibility, value: '' }]);
              setCfDraft({ name: '', type: 'Text', visibility: 'me' });
              setShowAddCustomField(false);
            }}>Save Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <AddFamilyMemberDialog
        open={showAddFamily}
        onClose={() => setShowAddFamily(false)}
        onSave={(draft: FamilyMemberDraft) => {
          const initials = draft.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          const colors = ['from-pink-400 to-violet-400', 'from-sky-400 to-blue-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500'];
          const color = colors[familyMembers.length % colors.length];
          setFamilyMembers(prev => [...prev, {
            id: `fm${Date.now()}`, name: draft.name, relationship: draft.relationship,
            phone: draft.phones[0]?.value ?? '', email: draft.emails[0]?.value ?? '',
            initials, color,
          }]);
        }}
      />
      <AddCollaboratorDialog
        open={showAddCollaborator}
        onClose={() => setShowAddCollaborator(false)}
        onSave={(draft: CollaboratorDraft) => {
          const initials = draft.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          const colors = ['from-violet-400 to-purple-500', 'from-sky-400 to-blue-500', 'from-emerald-400 to-teal-500'];
          const color = colors[collaborators.length % colors.length];
          setCollaborators(prev => [...prev, { id: `c${Date.now()}`, name: draft.name, role: draft.role, access: draft.access, initials, color, isInvited: false }]);
        }}
      />

      {/* Delete family member */}
      <AlertDialog open={!!deleteFamilyTarget} onOpenChange={o => !o && setDeleteFamilyTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove family member?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove <strong>{deleteFamilyTarget?.name}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteFamilyTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setFamilyMembers(prev => prev.filter(m => m.id !== deleteFamilyTarget?.id)); setDeleteFamilyTarget(null); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove collaborator */}
      <AlertDialog open={!!removeCollabTarget} onOpenChange={o => !o && setRemoveCollabTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove collaborator?</AlertDialogTitle>
            <AlertDialogDescription>This will remove <strong>{removeCollabTarget?.name}</strong> from Violet's collaborators.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveCollabTarget(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setCollaborators(prev => prev.filter(c => c.id !== removeCollabTarget?.id)); setRemoveCollabTarget(null); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
