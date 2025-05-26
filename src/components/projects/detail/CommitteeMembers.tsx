
import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommitteeMembers } from '@/hooks/useCommitteeMembers';

interface CommitteeMembersProps {
  committeeName: string;
}

const CommitteeMembers: React.FC<CommitteeMembersProps> = ({ committeeName }) => {
  const { data: members = [], isLoading, error } = useCommitteeMembers(committeeName);
  
  // Calculate the correct member text (singular or plural)
  const memberText = members.length === 1 ? 'member' : 'members';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center">
          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
          {committeeName} Committee Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-destructive">
            Error loading committee members
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No committee members found
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs">
                    {member.name ? member.name.split(' ').map((n) => n[0]).join('') : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommitteeMembers;
