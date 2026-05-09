import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ChevronDown,
  Plus,
  MoreVertical,
  AlertCircle,
  Search as SearchIcon,
  Users,
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from './ui/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

type TxStatus =
  | 'new-client'
  | 'new-offer'
  | 'pending'
  | 'incomplete-contract'
  | 'active'
  | 'in-escrow'
  | 'closing-soon'
  | 'closed';

type SearchStatus = 'active' | 'alerts-on' | 'paused' | 'new-client';

interface Transaction {
  id: string;
  address: string;
  listingType: 'Listing' | 'Contract';
  transactionType: 'Buyer' | 'Seller' | 'Landlord' | 'Tenant';
  status: TxStatus;
  price: string | null;
  beds: number;
  baths: number;
  sqft: string;
  clientName: string;
  clientInitials: string;
  acceptanceDate: string | null;
  closeOfEscrow: string | null;
  agentName: string;
  agentInitials: string;
  collaboratorName: string | null;
  collaboratorCount: number;
}

interface SearchItem {
  id: string;
  name: string;
  status: SearchStatus;
  budgetMin: string;
  budgetMax: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  offersCount: number;
  lastUpdated: string;
}

// ─── Static labels ─────────────────────────────────────────────────────────────

const TX_STATUS_LABEL: Record<TxStatus, string> = {
  'new-client': 'New Client',
  'new-offer': 'New Offer',
  pending: 'Pending',
  'incomplete-contract': 'Incomplete Contract',
  active: 'Active',
  'in-escrow': 'In Escrow',
  'closing-soon': 'Closing Soon',
  closed: 'Closed',
};

const TX_STATUS_OPTIONS: TxStatus[] = [
  'new-client',
  'new-offer',
  'pending',
  'incomplete-contract',
  'active',
  'in-escrow',
  'closing-soon',
  'closed',
];

const TX_STATUS_CLS: Record<TxStatus, string> = {
  'new-client': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  'new-offer': 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  'incomplete-contract': 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  active: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  'in-escrow': 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
  'closing-soon': 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  closed: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
};

const SEARCH_STATUS_LABEL: Record<SearchStatus, string> = {
  active: 'Active',
  'alerts-on': 'Alerts On',
  paused: 'Paused',
  'new-client': 'New Client',
};

const SEARCH_STATUS_OPTIONS: SearchStatus[] = ['active', 'alerts-on', 'paused', 'new-client'];

const SEARCH_STATUS_CLS: Record<SearchStatus, string> = {
  active: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  'alerts-on': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  paused: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200',
  'new-client': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
};

// ─── Seed data ─────────────────────────────────────────────────────────────────

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    address: '456 Sunset Boulevard, Los Angeles, CA 90028',
    listingType: 'Listing',
    transactionType: 'Buyer',
    status: 'new-client',
    price: '$200,000',
    beds: 3,
    baths: 3,
    sqft: '2,500',
    clientName: 'Violet Cole',
    clientInitials: 'VC',
    acceptanceDate: '08/12/2025',
    closeOfEscrow: '08/12/2025',
    agentName: 'Ashuthosh iOSacc',
    agentInitials: 'AI',
    collaboratorName: 'Dillion Den',
    collaboratorCount: 6,
  },
  {
    id: 'tx2',
    address: '1234 Market Street, Suite 567, San Francisco, CA 94103',
    listingType: 'Contract',
    transactionType: 'Buyer',
    status: 'incomplete-contract',
    price: '$730,000',
    beds: 3,
    baths: 3,
    sqft: '2,500',
    clientName: 'Violet Cole',
    clientInitials: 'VC',
    acceptanceDate: '08/12/2025',
    closeOfEscrow: '08/12/2025',
    agentName: 'Any Williams',
    agentInitials: 'AW',
    collaboratorName: 'Any Williams',
    collaboratorCount: 2,
  },
];

const INITIAL_SEARCHES: SearchItem[] = [
  {
    id: 'sr1',
    name: 'Skyline Apartments',
    status: 'active',
    budgetMin: '$1,490,000',
    budgetMax: '$2,495,000',
    location: 'Almeida, San Francisco, Ne... +2',
    beds: 3,
    baths: 3,
    sqft: '2,500',
    offersCount: 4,
    lastUpdated: '08/12/2025',
  },
];

// ─── RightPanelSection ─────────────────────────────────────────────────────────

function RightPanelSection({
  title,
  count,
  onAdd,
  children,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  onAdd?: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] font-semibold text-foreground truncate">{title}</span>
          {typeof count === 'number' && count > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px] rounded-full shrink-0">
              {count}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onAdd}
              aria-label={`Add to ${title}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Toggle section">
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                  !open && '-rotate-90',
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

// ─── StatusDropdown (reused for tx + search) ───────────────────────────────────

function TxStatusDropdown({ status, onChange }: { status: TxStatus; onChange: (s: TxStatus) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn('inline-flex items-center h-6 px-2 rounded-full border text-xs font-medium transition-colors cursor-pointer', TX_STATUS_CLS[status])} aria-label="Change transaction status">
          {TX_STATUS_LABEL[status]}
          <ChevronDown className="h-3 w-3 ml-0.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        {TX_STATUS_OPTIONS.map((s) => (
          <DropdownMenuItem key={s} className={cn(s === status && 'font-medium bg-muted')} onClick={() => onChange(s)}>
            {TX_STATUS_LABEL[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchStatusDropdown({ status, onChange }: { status: SearchStatus; onChange: (s: SearchStatus) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn('inline-flex items-center h-6 px-2 rounded-full border text-xs font-medium transition-colors cursor-pointer', SEARCH_STATUS_CLS[status])} aria-label="Change search status">
          {SEARCH_STATUS_LABEL[status]}
          <ChevronDown className="h-3 w-3 ml-0.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {SEARCH_STATUS_OPTIONS.map((s) => (
          <DropdownMenuItem key={s} className={cn(s === status && 'font-medium bg-muted')} onClick={() => onChange(s)}>
            {SEARCH_STATUS_LABEL[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── TransactionCard ───────────────────────────────────────────────────────────

function TransactionCard({
  tx,
  onStatusChange,
}: {
  tx: Transaction;
  onStatusChange: (id: string, status: TxStatus) => void;
}) {
  return (
    <Card className="p-3 rounded-xl hover:shadow-md hover:border-border/80 transition-shadow cursor-pointer" style={{ gap: 0 }}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Badge variant="outline" className="text-xs h-6 px-2 rounded-full font-medium border-purple-200 bg-purple-50 text-purple-700 shrink-0">
            {tx.listingType}
          </Badge>
          <Badge variant="outline" className="text-xs h-6 px-2 rounded-full font-normal border-border text-muted-foreground shrink-0">
            {tx.transactionType}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Open transaction actions">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Address */}
      <p className="mt-1.5 text-sm font-semibold leading-5 line-clamp-2 text-foreground">
        {tx.address}
      </p>

      {/* Price + specs */}
      <div className="mt-1 flex items-center gap-1.5">
        {tx.price && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{tx.price}</span>}
        <span className="text-xs text-muted-foreground truncate">{tx.beds} bd · {tx.baths} ba · {tx.sqft}</span>
      </div>

      <Separator className="my-1.5" />

      {/* Metadata grid — inline label:value per cell */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground shrink-0">Client</span>
          <Avatar className="h-3.5 w-3.5 shrink-0">
            <AvatarFallback className="text-[7px] font-bold bg-violet-100 text-violet-700">{tx.clientInitials}</AvatarFallback>
          </Avatar>
          <span className="text-[11px] leading-none text-foreground truncate">{tx.clientName}</span>
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground shrink-0">Acc.</span>
          <span className="text-[11px] leading-none text-foreground truncate">{tx.acceptanceDate ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground shrink-0">Escrow</span>
          <span className="text-[11px] leading-none text-foreground truncate">{tx.closeOfEscrow ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground shrink-0">Agent</span>
          <Avatar className="h-3.5 w-3.5 shrink-0">
            <AvatarFallback className="text-[7px] font-bold bg-sky-100 text-sky-700">{tx.agentInitials}</AvatarFallback>
          </Avatar>
          <span className="text-[11px] leading-none text-foreground truncate">{tx.agentName}</span>
        </div>
        {tx.collaboratorName && (
          <div className="col-span-2 flex items-center gap-1 min-w-0">
            <Users className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-[11px] leading-none text-foreground truncate">{tx.collaboratorName}</span>
            {tx.collaboratorCount > 0 && (
              <Badge variant="outline" className="text-[9px] h-4 px-1 rounded-full shrink-0 font-normal">
                +{tx.collaboratorCount}
              </Badge>
            )}
          </div>
        )}
      </div>

      <Separator className="my-1.5" />

      {/* Status row */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase text-muted-foreground">Status</span>
        <TxStatusDropdown status={tx.status} onChange={(s) => onStatusChange(tx.id, s)} />
      </div>
    </Card>
  );
}

// ─── SearchCard ────────────────────────────────────────────────────────────────

function SearchCard({
  search,
  onStatusChange,
}: {
  search: SearchItem;
  onStatusChange: (id: string, status: SearchStatus) => void;
}) {
  return (
    <Card className="p-3 rounded-xl hover:shadow-md hover:border-border/80 transition-shadow cursor-pointer" style={{ gap: 0 }}>
      {/* Header: name + status + kebab */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground line-clamp-1 flex-1 min-w-0">{search.name}</p>
        <div className="flex items-center gap-1 shrink-0">
          <SearchStatusDropdown status={search.status} onChange={(s) => onStatusChange(search.id, s)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Open search actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem>View search</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Budget */}
      <p className="mt-1.5 text-sm font-semibold text-foreground truncate">{search.budgetMin} – {search.budgetMax}</p>

      <Separator className="my-2" />

      {/* Metadata */}
      <p className="text-xs text-muted-foreground line-clamp-1">{search.location}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{search.beds} beds · {search.baths} baths · {search.sqft} sqft</p>
      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{search.offersCount} offers · Updated {search.lastUpdated}</p>
    </Card>
  );
}

// ─── FinancingCard ─────────────────────────────────────────────────────────────

function FinancingCard() {
  return (
    <Card className="p-3 rounded-xl border-l-2 border-l-emerald-500" style={{ gap: 0 }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-foreground">Pre-approval available</p>
        <Badge variant="outline" className="text-xs h-6 px-2 rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 shrink-0 font-medium whitespace-nowrap">
          6.25% fixed
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-2 leading-4">
        Help this client get pre-approved before writing an offer.
      </p>
      <Button size="sm" className="h-8 text-xs w-full" onClick={() => toast.success('Pre-approval flow opened.')}>
        Pre-approve client
      </Button>
    </Card>
  );
}

// ─── Empty states ──────────────────────────────────────────────────────────────

function EmptyTransactions({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="p-4 flex flex-col items-center gap-2 text-center border-dashed">
      <AlertCircle className="h-5 w-5 text-muted-foreground/40" />
      <p className="text-xs text-muted-foreground">No transactions or listings added yet.</p>
      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onAdd}>
        + Transaction / Listing
      </Button>
    </Card>
  );
}

function EmptySearches({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="p-4 flex flex-col items-center gap-2 text-center border-dashed">
      <SearchIcon className="h-5 w-5 text-muted-foreground/40" />
      <p className="text-xs text-muted-foreground">No searches added yet.</p>
      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onAdd}>
        + Search
      </Button>
    </Card>
  );
}

// ─── ClientRightPanel ──────────────────────────────────────────────────────────

export function ClientRightPanel({ isDark }: { isDark: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searches, setSearches] = useState<SearchItem[]>(INITIAL_SEARCHES);

  const handleTxStatus = useCallback((id: string, status: TxStatus) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(`Status updated to ${TX_STATUS_LABEL[status]}`);
    // TODO: PATCH /transactions/:id { status }
  }, []);

  const handleSearchStatus = useCallback((id: string, status: SearchStatus) => {
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    toast.success(`Status updated to ${SEARCH_STATUS_LABEL[status]}`);
    // TODO: PATCH /searches/:id { status }
  }, []);

  return (
    <div
      className={cn(
        'w-[360px] shrink-0 border-l flex flex-col h-screen',
        isDark ? 'border-[#2d2d2d] bg-[#111111]' : 'border-gray-200 bg-[#fafafa]',
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="py-1 space-y-0">

          {/* ── Transactions & Listings ── */}
          <RightPanelSection
            title="Transactions and listings"
            count={transactions.length}
            onAdd={() => toast('Add transaction / listing — coming soon')}
          >
            <div className="px-3 pb-3 space-y-2">
              {transactions.length === 0 ? (
                <EmptyTransactions onAdd={() => toast('Add transaction / listing — coming soon')} />
              ) : (
                transactions.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} onStatusChange={handleTxStatus} />
                ))
              )}
            </div>
          </RightPanelSection>

          <Separator className={isDark ? 'bg-[#2d2d2d]' : ''} />

          {/* ── Searches ── */}
          <RightPanelSection
            title="Searches"
            count={searches.length}
            onAdd={() => toast('Add search — coming soon')}
          >
            <div className="px-3 pb-3 space-y-2">
              {searches.length === 0 ? (
                <EmptySearches onAdd={() => toast('Add search — coming soon')} />
              ) : (
                searches.map((s) => (
                  <SearchCard key={s.id} search={s} onStatusChange={handleSearchStatus} />
                ))
              )}
            </div>
          </RightPanelSection>

          <Separator className={isDark ? 'bg-[#2d2d2d]' : ''} />

          {/* ── Financing ── */}
          <RightPanelSection title="Financing">
            <div className="px-3 pb-3">
              <FinancingCard />
            </div>
          </RightPanelSection>

        </div>
      </div>
    </div>
  );
}
