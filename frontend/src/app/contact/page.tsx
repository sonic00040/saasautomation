'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  HelpCircle,
  Book,
  Video,
  Users,
  Zap,
  Shield,
  Heart,
  Star,
  FileText,
  ExternalLink,
  Calendar
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    urgency: '',
    type: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        urgency: '',
        type: ''
      })
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat",
      color: "bg-blue-500",
      badge: "Fastest Response"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed questions or feedback",
      availability: "Response within 2 hours",
      action: "Send Email",
      color: "bg-green-500",
      badge: "Detailed Help"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our technical team",
      availability: "Mon-Fri, 9AM-6PM EST",
      action: "Schedule Call",
      color: "bg-purple-500",
      badge: "Personal Touch"
    },
    {
      icon: Calendar,
      title: "Book Demo",
      description: "Schedule a personalized product demo",
      availability: "Flexible scheduling",
      action: "Book Now",
      color: "bg-orange-500",
      badge: "Custom Demo"
    }
  ]

  const helpResources = [
    {
      icon: Book,
      title: "Documentation",
      description: "Comprehensive guides and API references",
      link: "/docs",
      category: "Self-Service"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step walkthrough videos",
      link: "/tutorials",
      category: "Learning"
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions and answers",
      link: "/faq",
      category: "Quick Help"
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other users and share tips",
      link: "/community",
      category: "Community"
    },
    {
      icon: FileText,
      title: "Status Page",
      description: "Check system status and uptime",
      link: "/status",
      category: "System Info"
    },
    {
      icon: Zap,
      title: "API Status",
      description: "Real-time API performance monitoring",
      link: "/api-status",
      category: "Developers"
    }
  ]

  const supportStats = [
    { label: "Average Response Time", value: "< 2 hours", icon: Clock },
    { label: "Customer Satisfaction", value: "98%", icon: Star },
    { label: "Issues Resolved", value: "99.5%", icon: CheckCircle },
    { label: "Support Languages", value: "12+", icon: MessageSquare }
  ]

  const officeLocations = [
    {
      city: "San Francisco",
      address: "123 Tech Street, Suite 400",
      timezone: "PST",
      type: "Headquarters"
    },
    {
      city: "New York",
      address: "456 Business Ave, Floor 15",
      timezone: "EST",
      type: "Sales Office"
    },
    {
      city: "London",
      address: "789 Innovation Lane, Level 8",
      timezone: "GMT",
      type: "European Hub"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" size="lg" className="mb-6">
            <Heart className="h-4 w-4 mr-2" />
            We're Here to Help
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get in Touch with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Our Support Team</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you have questions, need technical support, or want to explore how our platform can help your business, we're here to assist you every step of the way.
          </p>
        </div>
      </section>

      {/* Support Stats */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-lg text-gray-600">Multiple ways to reach us, tailored to your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" size="sm">{method.badge}</Badge>
                </div>
                <CardHeader className="pt-8">
                  <div className={`w-16 h-16 rounded-full ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {method.availability}
                  </div>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="h-6 w-6" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600">We'll get back to you within 2 hours during business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Inquiry Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales Question</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Need help soon</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical - System down</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please provide as much detail as possible..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Office Locations */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Our Offices
                  </CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  {officeLocations.map((office, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{office.city}</h4>
                        <Badge variant="outline" size="sm">{office.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{office.address}</p>
                      <p className="text-xs text-gray-500">{office.timezone}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-6 bg-red-50 border-red-200">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Shield className="h-5 w-5" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <p className="text-sm text-red-700 mb-3">
                  For critical system outages or security issues affecting your production environment:
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  Emergency Hotline: +1 (555) 911-HELP
                </Button>
              </Card>

              {/* Business Hours */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-2 border-t text-xs text-gray-500">
                    * Live chat and emergency support available 24/7
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Help Resources */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Self-Service Help Center</h2>
            <p className="text-lg text-gray-600">Find answers instantly with our comprehensive resources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpResources.map((resource, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <resource.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" size="sm">{resource.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}