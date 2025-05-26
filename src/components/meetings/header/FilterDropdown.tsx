
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { COMMITTEES } from '@/lib/data/committees';

interface FilterDropdownProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filter, setFilter }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {filter || 'All Committees'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setFilter(null)}>
          All Committees
        </DropdownMenuItem>
        {COMMITTEES.map(committee => (
          <DropdownMenuItem key={committee} onClick={() => setFilter(committee)}>
            {committee}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
