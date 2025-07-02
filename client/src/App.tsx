
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import type { Email, CreateEmailInput } from '../../server/src/schema';
import { EmailList } from '@/components/EmailList';
import { EmailView } from '@/components/EmailView';
import { ComposeEmail } from '@/components/ComposeEmail';

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [inboxEmails, setInboxEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('user@company.com');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('inbox');

  // Load all emails for general overview
  const loadAllEmails = useCallback(async () => {
    try {
      const result = await trpc.getAllEmails.query();
      setEmails(result);
    } catch (error) {
      console.error('Failed to load emails:', error);
    }
  }, []);

  // Load inbox emails for current user
  const loadInboxEmails = useCallback(async () => {
    try {
      const result = await trpc.getEmailsByRecipient.query({ recipient: currentUser });
      setInboxEmails(result);
    } catch (error) {
      console.error('Failed to load inbox emails:', error);
    }
  }, [currentUser]);

  // Handle sending email
  const handleSendEmail = async (emailData: CreateEmailInput) => {
    setIsLoading(true);
    try {
      const newEmail = await trpc.createEmail.mutate(emailData);
      // Update emails list
      setEmails((prev: Email[]) => [newEmail, ...prev]);
      // If email is to current user, also update inbox
      if (emailData.recipient === currentUser) {
        setInboxEmails((prev: Email[]) => [newEmail, ...prev]);
      }
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email selection for detailed view
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setActiveTab('detail');
  };

  // Load data on component mount
  useEffect(() => {
    loadAllEmails();
    loadInboxEmails();
  }, [loadAllEmails, loadInboxEmails]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📧 Internal Email Client</h1>
              <p className="text-gray-600 mt-1">Manage your internal communications</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Logged in as: <Badge variant="secondary">{currentUser}</Badge>
              </div>
              <Input
                placeholder="Change user email..."
                value={currentUser}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentUser(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inbox">
              📥 Inbox ({inboxEmails.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              📋 All Emails ({emails.length})
            </TabsTrigger>
            <TabsTrigger value="compose">
              ✍️ Compose
            </TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedEmail}>
              📖 Detail
            </TabsTrigger>
          </TabsList>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📥</span>
                  <span>Your Inbox</span>
                </CardTitle>
                <CardDescription>
                  Emails addressed to {currentUser}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inboxEmails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>📭 No emails in your inbox yet!</p>
                    <p className="text-sm mt-2">Send yourself an email to test the system.</p>
                  </div>
                ) : (
                  <EmailList 
                    emails={inboxEmails} 
                    onEmailSelect={handleEmailSelect}
                    currentUser={currentUser}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Emails Tab */}
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📋</span>
                  <span>All System Emails</span>
                </CardTitle>
                <CardDescription>
                  Complete list of all emails in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>📪 No emails in the system yet!</p>
                    <p className="text-sm mt-2">Compose your first email to get started.</p>
                  </div>
                ) : (
                  <EmailList 
                    emails={emails} 
                    onEmailSelect={handleEmailSelect}
                    currentUser={currentUser}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>✍️</span>
                  <span>Compose New Email</span>
                </CardTitle>
                <CardDescription>
                  Send an email to anyone in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComposeEmail
                  onSend={handleSendEmail}
                  isLoading={isLoading}
                  defaultSender={currentUser}
                  onSuccess={() => {
                    setActiveTab('inbox');
                    loadAllEmails();
                    loadInboxEmails();
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Detail Tab */}
          <TabsContent value="detail" className="space-y-4">
            {selectedEmail ? (
              <EmailView 
                email={selectedEmail} 
                onClose={() => setActiveTab('inbox')}
                currentUser={currentUser}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-gray-500">
                  <p>No email selected</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
