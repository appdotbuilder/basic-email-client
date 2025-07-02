import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Email } from '../../../server/src/schema';

interface EmailViewProps {
  email: Email;
  onClose: () => void;
  currentUser: string;
}

export function EmailView({ email, onClose, currentUser }: EmailViewProps) {
  const isReceived = email.recipient === currentUser;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={isReceived ? "default" : "secondary"}>
                {isReceived ? "📥 Received" : "📤 Sent"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Email ID: {email.id}
              </span>
            </div>
            <CardTitle className="text-xl">{email.subject}</CardTitle>
            <CardDescription className="mt-2">
              Sent on {email.sent_at.toLocaleDateString()} at {email.sent_at.toLocaleTimeString()}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            ← Back
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Email Headers */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-muted-foreground min-w-16">From:</span>
            <span className="text-foreground">{email.sender}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-muted-foreground min-w-16">To:</span>
            <span className="text-foreground">{email.recipient}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-muted-foreground min-w-16">Subject:</span>
            <span className="text-foreground">{email.subject}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-muted-foreground min-w-16">Date:</span>
            <span className="text-foreground">
              {email.sent_at.toLocaleDateString()} {email.sent_at.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <Separator />

        {/* Email Body */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">Message:</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {email.body}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isReceived ? '📨 This email was sent to you' : '📤 You sent this email'}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}