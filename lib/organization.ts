import { makeApiRequest } from './api';

// Types
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  ownerId: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface CreateOrganizationData {
  name: string;
}

export interface UpdateOrganizationData {
  name?: string;
}

export interface AddMemberData {
  email: string;
  role: 'admin' | 'member';
}

// Mock data for fallback
const mockOrganizations: Organization[] = [];

// Organization Management Functions
export async function createOrganization(data: CreateOrganizationData, token: string) {
  try {
    const response = await makeApiRequest('/api/v1/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);

    if (response.success) {
      return {
        success: true,
        organization: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to create organization',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    // Mock implementation
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: data.name,
      createdAt: new Date().toISOString(),
      ownerId: 'current_user_id',
      members: [{
        id: 'current_user_id',
        email: 'user@example.com',
        displayName: 'Current User',
        role: 'owner',
        joinedAt: new Date().toISOString(),
      }],
    };
    mockOrganizations.push(newOrg);
    return {
      success: true,
      organization: newOrg,
    };
  }
}

export async function getUserOrganizations(token: string) {
  try {
    const response = await makeApiRequest('/api/v1/organizations', {
      method: 'GET',
    }, token);

    if (response.success) {
      return {
        success: true,
        organizations: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to fetch organizations',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    return {
      success: true,
      organizations: mockOrganizations,
    };
  }
}

export async function getOrganizationDetails(orgId: string, token: string) {
  try {
    const response = await makeApiRequest(`/api/v1/organizations/${orgId}`, {
      method: 'GET',
    }, token);

    if (response.success) {
      return {
        success: true,
        organization: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to fetch organization details',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    const org = mockOrganizations.find(o => o.id === orgId);
    return {
      success: !!org,
      organization: org,
      message: org ? undefined : 'Organization not found',
    };
  }
}

export async function updateOrganization(orgId: string, data: UpdateOrganizationData, token: string) {
  try {
    const response = await makeApiRequest(`/api/v1/organizations/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);

    if (response.success) {
      return {
        success: true,
        organization: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to update organization',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    const orgIndex = mockOrganizations.findIndex(o => o.id === orgId);
    if (orgIndex === -1) {
      return {
        success: false,
        message: 'Organization not found',
      };
    }
    mockOrganizations[orgIndex] = {
      ...mockOrganizations[orgIndex],
      ...data,
    };
    return {
      success: true,
      organization: mockOrganizations[orgIndex],
    };
  }
}

export async function deleteOrganization(orgId: string, token: string) {
  try {
    const response = await makeApiRequest(`/api/v1/organizations/${orgId}`, {
      method: 'DELETE',
    }, token);

    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to delete organization',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    const orgIndex = mockOrganizations.findIndex(o => o.id === orgId);
    if (orgIndex === -1) {
      return {
        success: false,
        message: 'Organization not found',
      };
    }
    mockOrganizations.splice(orgIndex, 1);
    return {
      success: true,
    };
  }
}

export async function addOrganizationMember(orgId: string, data: AddMemberData, token: string) {
  try {
    const response = await makeApiRequest(`/api/v1/organizations/${orgId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);

    if (response.success) {
      return {
        success: true,
        member: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to add member',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    const org = mockOrganizations.find(o => o.id === orgId);
    if (!org) {
      return {
        success: false,
        message: 'Organization not found',
      };
    }
    const newMember: OrganizationMember = {
      id: `user_${Date.now()}`,
      email: data.email,
      displayName: data.email.split('@')[0],
      role: data.role,
      joinedAt: new Date().toISOString(),
    };
    org.members.push(newMember);
    return {
      success: true,
      member: newMember,
    };
  }
}

export async function removeOrganizationMember(orgId: string, memberId: string, token: string) {
  try {
    const response = await makeApiRequest(`/api/v1/organizations/${orgId}/members`, {
      method: 'DELETE',
      body: JSON.stringify({ memberId }),
    }, token);

    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to remove member',
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock data');
    const org = mockOrganizations.find(o => o.id === orgId);
    if (!org) {
      return {
        success: false,
        message: 'Organization not found',
      };
    }
    const memberIndex = org.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return {
        success: false,
        message: 'Member not found',
      };
    }
    org.members.splice(memberIndex, 1);
    return {
      success: true,
    };
  }
} 