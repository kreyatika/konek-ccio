
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X } from 'lucide-react';
import { COMMITTEES } from '@/lib/data/committees';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface CommitteeSelectProps {
  selectedCommittees: string[];
  onAdd: (committee: string) => void;
  onRemove: (committee: string) => void;
}

const CommitteeSelect: React.FC<CommitteeSelectProps> = ({
  selectedCommittees = [],
  onAdd,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCommittees);

  // Update local state when props change
  React.useEffect(() => {
    setLocalSelected(selectedCommittees);
  }, [selectedCommittees]);

  const handleAddCommittee = (committee: string) => {
    // Update local state immediately for responsive UI
    setLocalSelected(prev => [...prev, committee]);
    
    // Call the parent handler
    onAdd(committee);
    toast.success(`Added to ${committee} committee`);
  };

  const handleRemoveCommittee = (committee: string, e?: React.MouseEvent) => {
    // Stop event propagation to prevent the popover from closing when clicking a badge's X button
    if (e) {
      e.stopPropagation(); 
    }
    
    // Update local state immediately for responsive UI
    setLocalSelected(prev => prev.filter(c => c !== committee));
    
    // Call the parent handler
    onRemove(committee);
    toast.success(`Removed from ${committee} committee`);
  };

  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">Committees</label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {localSelected.map((committee) => (
          <Badge key={committee} variant="outline" className="flex items-center gap-1 px-2 py-1">
            {committee}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 p-0 ml-1 rounded-full"
              onClick={(e) => handleRemoveCommittee(committee, e)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex justify-between w-full sm:w-[180px]">
            <span>Add committee</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {COMMITTEES.map((committee) => {
                const isSelected = localSelected.includes(committee);
                return (
                  <div
                    key={committee}
                    className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => {
                      if (isSelected) {
                        handleRemoveCommittee(committee);
                      } else {
                        handleAddCommittee(committee);
                      }
                    }}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => {
                        if (isSelected) {
                          handleRemoveCommittee(committee);
                        } else {
                          handleAddCommittee(committee);
                        }
                      }}
                    />
                    <span>{committee}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CommitteeSelect;
