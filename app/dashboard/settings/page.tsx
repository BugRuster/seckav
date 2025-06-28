'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthGuard } from '@/contexts/AuthContext';
import { 
  getUserProfile, 
  updateUserProfile, 
  generateApiKey, 
  listApiKeys, 
  revokeApiKey,
  UserProfile,
  ApiKey
} from '@/lib/auth';
import { 
  User, 
  Key, 
  Shield, 
  Copy, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Settings,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user, token, login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  // Profile states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // API Key states
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);
  
  // Dialog states
  const [isNewKeyDialogOpen, setIsNewKeyDialogOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  
  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Store generated keys temporarily for revocation (since backend list doesn't return keys)
  const [generatedKeys, setGeneratedKeys] = useState<Record<string, string>>({});

  // Use auth guard
  useAuthGuard();

  // Load profile and API keys on mount
  useEffect(() => {
    if (token && isAuthenticated) {
      loadProfile();
      loadApiKeys();
    }
    
    // Load stored API keys from localStorage
    const storedKeys = localStorage.getItem('seckav_generated_keys');
    if (storedKeys) {
      try {
        setGeneratedKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error('Error loading stored API keys:', error);
      }
    }
  }, [token, isAuthenticated]);

  const loadProfile = async () => {
    if (!token) return;
    
    setIsLoadingProfile(true);
    try {
      const result = await getUserProfile(token);
      if (result.success && result.user) {
        setProfile(result.user);
        setDisplayName(result.user.displayName);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadApiKeys = async () => {
    if (!token) return;
    
    setIsLoadingKeys(true);
    try {
      const result = await listApiKeys(token);
      if (result.success && result.apiKeys) {
        setApiKeys(result.apiKeys);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load API keys",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!token || !displayName.trim()) return;
    
    setIsUpdatingProfile(true);
    try {
      const result = await updateUserProfile({ displayName: displayName.trim() }, token);
      if (result.success && result.user) {
        setProfile(result.user);
        // Update the auth context
        if (user) {
          login({ ...user, displayName: result.user.displayName }, token);
        }
        toast({
          title: "Success",
          description: result.message || "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!token || !newApiKeyName.trim()) return;
    
    setIsGeneratingKey(true);
    try {
      const result = await generateApiKey({ name: newApiKeyName.trim() }, token);
      if (result.success && result.apiKey) {
        setGeneratedKey(result.apiKey);
        setShowGeneratedKey(true);
        
        // Store the generated key locally for future revocation
        const keyName = newApiKeyName.trim();
        const updatedKeys = { ...generatedKeys, [keyName]: result.apiKey };
        setGeneratedKeys(updatedKeys);
        localStorage.setItem('seckav_generated_keys', JSON.stringify(updatedKeys));
        
        setNewApiKeyName('');
        setIsNewKeyDialogOpen(false);
        await loadApiKeys(); // Refresh the list
        toast({
          title: "Success",
          description: "API key generated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokeApiKey = async (keyName: string) => {
    if (!token) return;
    
    // Get the actual key from our stored keys
    const actualKey = generatedKeys[keyName];
    if (!actualKey) {
      toast({
        title: "Error",
        description: "Cannot revoke this API key. Key was generated before this session or in a different browser.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await revokeApiKey(actualKey, token);
      if (result.success) {
        // Remove from stored keys
        const updatedKeys = { ...generatedKeys };
        delete updatedKeys[keyName];
        setGeneratedKeys(updatedKeys);
        localStorage.setItem('seckav_generated_keys', JSON.stringify(updatedKeys));
        
        await loadApiKeys(); // Refresh the list
        toast({
          title: "Success",
          description: result.message || "API key revoked successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to revoke API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
    setKeyToRevoke(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your profile information and API keys
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingProfile ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                      />
                    </div>

                    {/* Role (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="role"
                          value={profile?.role || 'developer'}
                          disabled
                          className="bg-muted flex-1"
                        />
                        <Badge variant="secondary">
                          {profile?.role || 'developer'}
                        </Badge>
                      </div>
                    </div>

                    {/* Email Verification Status */}
                    <div className="space-y-2">
                      <Label>Email Verification</Label>
                      <div className="flex items-center space-x-2">
                        {profile?.isEmailVerified ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Account Created */}
                    {profile?.createdAt && (
                      <div className="space-y-2">
                        <Label>Account Created</Label>
                        <Input
                          value={formatDate(profile.createdAt)}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    )}

                    {/* Update Button */}
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleUpdateProfile}
                        disabled={isUpdatingProfile || !displayName.trim() || displayName === profile?.displayName}
                        className="flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>
                          {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                        </span>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            {/* Information Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Only API keys generated in this browser session can be revoked. 
                Keys created before this session or in other browsers will show as "Legacy" and cannot be revoked from here.
              </AlertDescription>
            </Alert>

            {/* Generated Key Display */}
            {generatedKey && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="space-y-3">
                  <div>
                    <strong>Your API key has been generated!</strong>
                  </div>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
                    {showGeneratedKey ? generatedKey : '•'.repeat(32)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowGeneratedKey(!showGeneratedKey)}
                    >
                      {showGeneratedKey ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {showGeneratedKey ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedKey)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setGeneratedKey(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ⚠️ Make sure to copy your API key now. You won't be able to see it again!
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="h-5 w-5" />
                      <span>API Keys</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your API keys for programmatic access
                    </CardDescription>
                  </div>
                  <Dialog open={isNewKeyDialogOpen} onOpenChange={setIsNewKeyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Generate Key</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate New API Key</DialogTitle>
                        <DialogDescription>
                          Create a new API key for accessing the SecKav API programmatically.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="keyName">API Key Name</Label>
                          <Input
                            id="keyName"
                            placeholder="e.g., Production App, Development Testing"
                            value={newApiKeyName}
                            onChange={(e) => setNewApiKeyName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsNewKeyDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleGenerateApiKey}
                          disabled={isGeneratingKey || !newApiKeyName.trim()}
                        >
                          {isGeneratingKey ? 'Generating...' : 'Generate Key'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingKeys ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : apiKeys.length > 0 ? (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey, index) => {
                      const canRevoke = generatedKeys[apiKey.name];
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{apiKey.name}</h4>
                                {canRevoke ? (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Revocable
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-orange-600">
                                    Legacy
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Created: {formatDate(apiKey.createdAt)}</span>
                                {apiKey.lastUsed && (
                                  <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                                )}
                              </div>
                              {!canRevoke && (
                                <p className="text-xs text-orange-600">
                                  This key was created before this session. Cannot be revoked from here.
                                </p>
                              )}
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  disabled={!canRevoke}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Revoke
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Revoke API Key</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to revoke the API key "{apiKey.name}"? 
                                    This action cannot be undone and any applications using this key will stop working.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleRevokeApiKey(apiKey.name)}
                                  >
                                    Revoke Key
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No API Keys</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't generated any API keys yet. Create one to start using the SecKav API.
                    </p>
                    <Button onClick={() => setIsNewKeyDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Your First API Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
