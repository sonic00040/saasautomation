'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Crown,
  Shield,
  Mail,
  Calendar,
  Building,
  Globe,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  UserPlus,
  Settings,
  Key,
  Eye,
  EyeOff
} from "lucide-react"

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState(false)

  // Mock data
  const companyInfo = {
    name: "Acme Corporation",
    website: "https://acme.com",
    industry: "Technology",
    size: "50-200 employees",
    address: "123 Business St, San Francisco, CA 94107",
    phone: "+1 (555) 123-4567",
    timezone: "America/Los_Angeles",
    description: "Leading provider of innovative business solutions"
  }

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@acme.com",
      role: "Owner",
      status: "Active",
      joinDate: "2023-01-15",
      lastActive: "2 minutes ago",
      permissions: ["admin", "billing", "analytics", "settings"]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@acme.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-02-20",
      lastActive: "1 hour ago",
      permissions: ["admin", "analytics", "settings"]
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@acme.com",
      role: "Member",
      status: "Active",
      joinDate: "2023-03-10",
      lastActive: "3 hours ago",
      permissions: ["analytics"]
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa@acme.com",
      role: "Member",
      status: "Pending",
      joinDate: "2023-09-12",
      lastActive: "Never",
      permissions: ["analytics"]
    }
  ]

  const pendingInvitations = [
    {
      id: 1,
      email: "alex@acme.com",
      role: "Member",
      invitedBy: "John Smith",
      invitedDate: "2023-09-10",
      expiresDate: "2023-09-17"
    },
    {
      id: 2,
      email: "taylor@acme.com",
      role: "Admin",
      invitedBy: "Sarah Johnson",
      invitedDate: "2023-09-11",
      expiresDate: "2023-09-18"
    }
  ]

  const roles = [
    {
      name: "Owner",
      description: "Full access to all features including billing and team management",
      permissions: ["All permissions"],
      color: "bg-yellow-500",
      icon: Crown
    },
    {
      name: "Admin",
      description: "Access to most features except billing and owner settings",
      permissions: ["Team management", "Bot configuration", "Analytics", "Knowledge base"],
      color: "bg-blue-500",
      icon: Shield
    },
    {
      name: "Member",
      description: "Limited access to specific features based on assigned permissions",
      permissions: ["View analytics", "Test bots"],
      color: "bg-green-500",
      icon: Users
    }
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner': return Crown
      case 'Admin': return Shield
      default: return Users
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner': return 'bg-yellow-500'
      case 'Admin': return 'bg-blue-500'
      default: return 'bg-green-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Company</h1>
          <p className="text-gray-600">Manage your company profile and team members</p>
        </div>
        <Button
          onClick={() => setShowInviteForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="company">Company Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  <p className="text-sm text-gray-600">Total Members</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.status === 'Active').length}
                  </p>
                  <p className="text-sm text-gray-600">Active Members</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingInvitations.length}</p>
                  <p className="text-sm text-gray-600">Pending Invites</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.role === 'Admin' || m.role === 'Owner').length}
                  </p>
                  <p className="text-sm text-gray-600">Admins</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
              <CardDescription>Latest team member actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lisa Chen was invited to join the team</p>
                    <p className="text-xs text-gray-500">2 days ago by John Smith</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mike Davis role updated to Member</p>
                    <p className="text-xs text-gray-500">1 week ago by Sarah Johnson</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Johnson accepted admin invitation</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {/* Active Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const RoleIcon = getRoleIcon(member.role)
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <div className={`w-6 h-6 ${getRoleColor(member.role)} rounded-full flex items-center justify-center`}>
                              <RoleIcon className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Joined {member.joinDate}</span>
                            <span className="text-xs text-gray-500">Last active: {member.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{member.role}</Badge>
                        {getStatusBadge(member.status)}
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {member.role !== 'Owner' && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Users who have been invited but haven't joined yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingInvitations.map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invite.email}</p>
                          <p className="text-sm text-gray-600">
                            Invited by {invite.invitedBy} on {invite.invitedDate}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires on {invite.expiresDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{invite.role}</Badge>
                        <Badge variant="warning">Pending</Badge>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            Resend
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon
              return (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Permissions:</p>
                      <ul className="space-y-1">
                        {role.permissions.map((permission, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Detailed Permissions Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions Matrix</CardTitle>
              <CardDescription>Detailed breakdown of what each role can do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Permission</th>
                      <th className="text-center py-2">Owner</th>
                      <th className="text-center py-2">Admin</th>
                      <th className="text-center py-2">Member</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {[
                      { name: 'Manage billing', owner: true, admin: false, member: false },
                      { name: 'Manage team', owner: true, admin: true, member: false },
                      { name: 'Configure bots', owner: true, admin: true, member: false },
                      { name: 'View analytics', owner: true, admin: true, member: true },
                      { name: 'Test bots', owner: true, admin: true, member: true },
                      { name: 'Manage knowledge base', owner: true, admin: true, member: false },
                      { name: 'Company settings', owner: true, admin: false, member: false },
                    ].map((perm, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 font-medium">{perm.name}</td>
                        <td className="text-center py-2">
                          {perm.owner ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto"></div>}
                        </td>
                        <td className="text-center py-2">
                          {perm.admin ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto"></div>}
                        </td>
                        <td className="text-center py-2">
                          {perm.member ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto"></div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Profile Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Manage your company profile and settings</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditingCompany(!editingCompany)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editingCompany ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingCompany ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue={companyInfo.name} />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={companyInfo.website} />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select defaultValue={companyInfo.industry.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="size">Company Size</Label>
                      <Select defaultValue="50-200">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={companyInfo.phone} />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue={companyInfo.timezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" defaultValue={companyInfo.address} rows={2} />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" defaultValue={companyInfo.description} rows={3} />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Button className="mr-2">Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditingCompany(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Company Name</p>
                        <p className="font-medium">{companyInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium text-blue-600">{companyInfo.website}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Industry</p>
                        <p className="font-medium">{companyInfo.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Company Size</p>
                        <p className="font-medium">{companyInfo.size}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{companyInfo.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{companyInfo.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Timezone</p>
                        <p className="font-medium">Pacific Time (PST)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Edit className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-medium">{companyInfo.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Modal/Form */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to join your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input id="inviteEmail" type="email" placeholder="colleague@company.com" />
              </div>
              <div>
                <Label htmlFor="inviteRole">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
                <Textarea id="inviteMessage" placeholder="Welcome to the team!" rows={3} />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">Send Invitation</Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}