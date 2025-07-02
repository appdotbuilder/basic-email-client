
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Email } from '../../../server/src/schema';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  currentUser: string;
}

export function EmailList({ emails, onEmailSelect, currentUser }: EmailListProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {emails.map((email: Email) => (
        <Card 
          key={email.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEmailSelect(email)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={email.recipient === currentUser ? "default" : "secondary"}>
                    {email.recipient === currentUser ? "📥 Received" : "📤 Sent"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {email.sent_at.toLocaleDateString()} {email.sent_at.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-600">From:</span>
                  <span className="text-sm text-gray-900">{email.sender}</span>
                  <span className="text-sm font-medium text-gray-600">To:</span>
                  <span className="text-sm text-gray-900">{email.recipient}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {email.subject}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {email.body.length > 100 
                    ? `${email.body.substring(0, 100)}...` 
                    : email.body
                  }
                </p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onEmailSelect(email);
                }}
                className="ml-4 flex-shrink-0"
              >
                View →
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
