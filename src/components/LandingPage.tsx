import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AlertTriangle, Shield, Users, MapPin, Bell, Radio } from 'lucide-react';
import { LoginDialog } from './LoginDialog';
import { useState } from 'react';
import logo from '../assets/logo.png';
import flood from  '../assets/flood.jpg';

interface LandingPageProps {
  onCitizenLogin: () => void;
  onAuthorityLogin: () => void;
}

export function LandingPage({ onCitizenLogin, onAuthorityLogin }: LandingPageProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    {/* Left side: Logo + Title */}
    <div className="flex items-center gap-3">
      <img
        src={logo}  // 👈 path to your image
        alt="SDACS Logo"
        className="h-12 w-12 object-contain"
      />
      <h1 className="text-xl font-semibold text-slate-800"> Alert Sphere</h1>
    </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            <Button variant="outline" size="sm" onClick={() => setShowLoginDialog(true)}>Login</Button>
          </nav>
        </div>
      </header>

      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onCitizenLogin={onCitizenLogin}
        onAuthorityLogin={onAuthorityLogin}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24" id="about">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
              <Radio className="w-4 h-4" />
              <span>Real-time Disaster Management</span>
            </div>
            
            <h1 className="text-slate-900">
              Smart Disaster Alert & Coordination System
            </h1>
            
            <p className="text-slate-600">
              A unified platform connecting citizens and government authorities to manage disaster situations in real time. 
              Stay informed during floods, earthquakes, fires, and other emergencies with instant alerts, interactive maps, 
              and coordinated rescue operations.
            </p>

            

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-slate-900">24/7</div>
                <div className="text-slate-600">Active Monitoring</div>
              </div>
              <div className="w-px h-12 bg-slate-300"></div>
              <div>
                <div className="text-slate-900">Real-time</div>
                <div className="text-slate-600">Alert System</div>
              </div>
              <div className="w-px h-12 bg-slate-300"></div>
              <div>
                <div className="text-slate-900">Instant</div>
                <div className="text-slate-600">Coordination</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
              <ImageWithFallback 
                src={flood}
                alt="Disaster Management"
                className="w-full h-auto rounded-xl"
              />
              
              {/* Floating Alert Cards */}
              <div className="absolute -top-4 -left-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <div className="text-xs opacity-90">Active Alert</div>
                  <div>Flood Warning</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <div>
                  <div className="text-xs opacity-90">Safe Zone</div>
                  <div>Shelter Located</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">Key Features</h2>
          <p className="text-slate-600">Comprehensive tools for disaster management and coordination</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-slate-900 mb-2">Live Alerts</h3>
            <p className="text-slate-600">Get real-time notifications about disasters in your area with severity levels and safety instructions.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-slate-900 mb-2">Interactive Maps</h3>
            <p className="text-slate-600">View disaster locations, safe zones, and shelters on an interactive map with real-time updates.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-slate-900 mb-2">Report Incidents</h3>
            <p className="text-slate-600">Citizens can quickly report disasters with photos, descriptions, and auto-captured location data.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-slate-900 mb-2">Coordinated Response</h3>
            <p className="text-slate-600">Authorities can monitor, verify, and coordinate rescue operations with resource management tools.</p>
          </div>
        </div>
      </section>
            {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Have questions, feedback, or need assistance during emergencies?  
            Reach out to us — we’re here 24/7 to help ensure your safety.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-900 text-lg font-semibold mb-2">Contact Information</h3>
              <p className="text-slate-600">Feel free to contact us through the following channels:</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700"> Alertsphere,Bengaluru,India</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">support@alertsphere.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">+91 XXXXX XXXXX</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-slate-500 text-sm">
                Our team is available round-the-clock to respond to disaster-related inquiries and technical support requests.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-slate-700 mb-1 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-slate-700 mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-slate-700 mb-1 font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Type your message here..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Send Message
            </Button>
          </form>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div >
                <img
        src={logo}  // 👈 path to your image
        alt= "Logo"
        className="h-10 w-15 object-contain"  
      />
              </div>
              <span className="text-slate-900"> Alert Sphere</span>
            </div>
            <p className="text-slate-600">© 2025 Alert Sphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}