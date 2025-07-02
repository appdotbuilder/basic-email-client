import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { CreateEmailInput } from '../../../server/src/schema';

interface ComposeEmailProps {
  onSend: (email: CreateEmailInput) => Promise<boolean>;
  isLoading: boolean;
  defaultSender: string;
  onSuccess?: () => void;
}

export function ComposeEmail({ onSend, isLoading, defaultSender, onSuccess }: ComposeEmailProps) {
  const [formData, setFormData] = useState<CreateEmailInput>({
    sender: defaultSender,
    recipient: '',
    subject: '',
    body: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await onSend(formData);
    
    if (success) {
      // Reset form
      setFormData({
        sender: defaultSender,
        recipient: '',
        subject: '',
        body: ''
      });
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleInputChange = (field: keyof CreateEmailInput, value: string) => {
    setFormData((prev: CreateEmailInput) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {showSuccess && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <span>✅</span>
              <span className="font-medium">Email sent successfully!</span>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="sender">From</Label>
            <Input
              id="sender"
              type="email"
              placeholder="your.email@company.com"
              value={formData.sender}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('sender', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">To</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="recipient@company.com"
              value={formData.recipient}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('recipient', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={formData.subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleInputChange('subject', e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Write your email message here..."
              value={formData.body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                handleInputChange('body', e.target.value)
              }
              rows={8}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            📝 All fields are required
          </div>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                sender: defaultSender,
                recipient: '',
                subject: '',
                body: ''
              })}
              disabled={isLoading}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="mr-2">📤</span>
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}