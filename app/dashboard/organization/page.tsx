'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthGuard } from '@/contexts/AuthContext';
import {
  Organization,
  OrganizationMember,
  getUserOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  addOrganizationMember,
  removeOrganizationMember,
} from '@/lib/organization';
import {
  Building,
  Users,
  Plus,
  Trash2,
  Settings,
  ArrowLeft,
  Edit,
  Save,
  UserPlus,
  UserMinus,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function OrganizationPage() {
  // Use auth guard
  useAuthGuard();

  const { user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'member'>('member');

  // Load organizations
  useEffect(() => {
    loadOrganizations();
  }, [token]);

  const loadOrganizations = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const result = await getUserOrganizations(token);
      if (result.success && result.organizations) {
        setOrganizations(result.organizations);
        // Select the first organization by default if none is selected
        if (result.organizations.length > 0 && !selectedOrg) {
          setSelectedOrg(result.organizations[0]);
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load organizations",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organizations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async () => {
    if (!token || !newOrgName.trim()) return;

    try {
      const result = await createOrganization({ name: newOrgName.trim() }, token);
      if (result.success && result.organization) {
        await loadOrganizations(); // Reload all organizations
        setSelectedOrg(result.organization);
        setIsCreateDialogOpen(false);
        setNewOrgName('');
        toast({
          title: "Success",
          description: "Organization created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create organization",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrganization = async () => {
    if (!token || !selectedOrg || !editedName.trim()) return;

    try {
      const result = await updateOrganization(selectedOrg.id, { name: editedName.trim() }, token);
      if (result.success && result.organization) {
        await loadOrganizations(); // Reload all organizations
        setSelectedOrg(result.organization);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Organization updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update organization",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrganization = async () => {
    if (!token || !selectedOrg) return;

    try {
      const result = await deleteOrganization(selectedOrg.id, token);
      if (result.success) {
        await loadOrganizations(); // Reload all organizations
        setSelectedOrg(null);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Success",
          description: "Organization deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete organization",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async () => {
    if (!token || !selectedOrg || !newMemberEmail.trim()) return;

    try {
      const result = await addOrganizationMember(selectedOrg.id, {
        email: newMemberEmail.trim(),
        role: newMemberRole,
      }, token);
      if (result.success && result.member) {
        await loadOrganizations(); // Reload all organizations
        setIsAddMemberDialogOpen(false);
        setNewMemberEmail('');
        setNewMemberRole('member');
        toast({
          title: "Success",
          description: "Member added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!token || !selectedOrg) return;

    try {
      const result = await removeOrganizationMember(selectedOrg.id, memberId, token);
      if (result.success) {
        await loadOrganizations(); // Reload all organizations
        toast({
          title: "Success",
          description: "Member removed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const startEditing = () => {
    if (selectedOrg) {
      setEditedName(selectedOrg.name);
      setIsEditing(true);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Organization Management</h1>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : organizations.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Organizations</h3>
              <p className="text-muted-foreground mb-4">
                Create your first organization to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Organization List */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Your Organizations</CardTitle>
              <CardDescription>Select an organization to manage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {organizations.map((org) => (
                  <Button
                    key={org.id}
                    variant={selectedOrg?.id === org.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedOrg(org)}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    {org.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          {selectedOrg && (
            <div className="col-span-8 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>Manage your organization settings</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Button onClick={handleUpdateOrganization}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    ) : (
                      <Button onClick={startEditing}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Organization Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter organization name"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={selectedOrg.name}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Created At</Label>
                      <Input
                        value={new Date(selectedOrg.createdAt).toLocaleDateString()}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>Manage organization members</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddMemberDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrg.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="space-y-1">
                            <p className="font-medium">{member.displayName}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>
                            {member.role}
                          </Badge>
                          {member.role !== 'owner' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Create Organization Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to manage your team and resources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrganization}
              disabled={!newOrgName.trim()}
            >
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Organization Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                All organization data, including members and settings, will be permanently deleted.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteOrganization}
            >
              Delete Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organization Member</DialogTitle>
            <DialogDescription>
              Add a new member to your organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberEmail">Email Address</Label>
              <Input
                id="memberEmail"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter member's email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberRole">Role</Label>
              <Select
                value={newMemberRole}
                onValueChange={(value: 'admin' | 'member') => setNewMemberRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={!newMemberEmail.trim()}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 