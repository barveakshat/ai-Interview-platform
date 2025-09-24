// app/page.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Brain,
  Clock,
  FileSpreadsheet,
  UserCheck,
  ChevronRight,
  Play,
  Sparkles,
  ArrowRight,
  Eye,
  Github,
} from "lucide-react";
import { useUser } from "@/app/provider";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(
      ".feature-card, .tech-item, .step-item"
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800" 
            : "bg-transparent"
        }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 group-hover:from-emerald-300 group-hover:to-blue-300 transition-all duration-300">
                PrepTrack
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="relative text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-medium group">
                <span>Features</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link
                href="#tech-stack"
                className="relative text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-medium group">
                <span>Tech Stack</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link
                href="#how-it-works"
                className="relative text-gray-300 hover:text-emerald-400 transition-colors duration-300 font-medium group">
                <span>How It Works</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              {user ? (
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href="/dashboard" className="w-32 text-center">
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href="/auth" className="w-28 text-center">
                    Sign In
                  </Link>
                </Button>
              )}
            </nav>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-300 hover:text-emerald-400 focus:outline-none transition-colors duration-300">
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-lg">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-1 py-4">
                <Link
                  href="#features"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 transition-all duration-300 py-3 px-4 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}>
                  Features
                </Link>
                <Link
                  href="#tech-stack"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 transition-all duration-300 py-3 px-4 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}>
                  Tech Stack
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50 transition-all duration-300 py-3 px-4 rounded-lg font-medium"
                  onClick={() => setMenuOpen(false)}>
                  How It Works
                </Link>
                <div className="pt-2">
                  {user ? (
                    <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold">
                      <Link href="/dashboard" className="text-center">
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold">
                      <Link href="/auth" className="text-center">
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-emerald-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-600/20 via-emerald-600/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-gradient-radial from-emerald-600/10 to-transparent blur-2xl" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div
                className={`space-y-8 transition-all duration-1000 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}>
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm border border-emerald-500/30">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    AI-Powered Interview Platform
                  </span>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                    <span className="block text-white">
                      Smart Interviews
                    </span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-300 animate-gradient-x">
                      Made Simple
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed">
                    Practice and master your interview skills with AI-powered mock interviews. 
                    <span className="font-semibold text-emerald-400"> Boost your confidence</span> and land your dream job.
                  </p>
                </div>

                {/* Statistics */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">
                      <span className="font-semibold text-white">10,000+</span> Questions Generated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">
                      <span className="font-semibold text-white">500+</span> Companies Trust Us
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">
                      <span className="font-semibold text-white">95%</span> Time Saved
                    </span>
                  </div>
                </div>

                {/* Enhanced CTA Section */}
                <div className="space-y-6">
                  {/* Primary CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user ? (
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Link href="/dashboard" className="flex items-center gap-3">
                          Go to Dashboard
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Link href="/auth" className="flex items-center gap-3">
                          Get Started Free
                          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Demo CTA - More Prominent */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="relative bg-gray-800/80 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl shadow-sm">
                            <Play className="h-6 w-6 text-white ml-0.5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">
                              Try it now - No signup required!
                            </h3>
                            <p className="text-sm text-gray-400">
                              Experience the full platform instantly
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-emerald-400">
                            Live Demo
                          </span>
                        </div>
                      </div>

                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 hover:border-emerald-400 text-emerald-400 font-semibold text-lg py-4 h-auto group-hover:scale-[1.02] transition-all duration-300">
                        <Link
                          href="/guest/dashboard"
                          className="flex items-center justify-center gap-3">
                          <Eye className="h-5 w-5" />
                          See How It Works
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>

                      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          </div>
                          <span>No credit card</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          </div>
                          <span>Instant access</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          </div>
                          <span>Full features</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`relative transition-all duration-1000 delay-300 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}>
                <div className="relative group">
                  {/* Floating elements around the main image */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl opacity-20 blur-lg animate-pulse group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-full opacity-15 blur-xl animate-pulse delay-1000 group-hover:scale-105 transition-transform duration-300"></div>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/50 backdrop-blur-sm group-hover:shadow-3xl transition-all duration-500">
                    <Image
                      src="/aiInterviewTrans.png"
                      alt="AI-powered interview dashboard"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-blue-600/10 group-hover:from-emerald-600/20 group-hover:to-blue-600/20 transition-all duration-500" />
                    
                    {/* Overlay stats */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-700/50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-300 font-medium">AI Interview Active</span>
                          </div>
                          <span className="text-gray-400">2m 34s elapsed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full shadow-sm border border-emerald-500/30 mb-6">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  Powerful Features
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Streamline Your Interview Process
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our platform offers powerful tools to make interviewing more
                effective, efficient, and engaging for both interviewers and candidates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 - Enhanced */}
              <div
                className="feature-card group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ transitionDelay: "100ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                    <Brain className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors duration-500">
                    AI-Powered Generation
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                    Leverage advanced AI to generate relevant, role-specific
                    interview questions in seconds with perfect accuracy.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <ArrowRight className="h-4 w-4" />
                    <span>Learn more</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Enhanced */}
              <div
                className="feature-card group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ transitionDelay: "200ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                    <Clock className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-500">
                    Time Efficiency
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                    Cut interview preparation time by 80%. Focus on evaluating
                    candidates, not creating questions manually.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <ArrowRight className="h-4 w-4" />
                    <span>Save time now</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Enhanced */}
              <div
                className="feature-card group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ transitionDelay: "300ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                    <FileSpreadsheet className="h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors duration-500">
                    Smart Templates
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                    Create and save intelligent templates for different roles and departments
                    within your organization for consistency.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <ArrowRight className="h-4 w-4" />
                    <span>Explore templates</span>
                  </div>
                </div>
              </div>

              {/* Feature 4 - Enhanced */}
              <div
                className="feature-card group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 h-full border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ transitionDelay: "400ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                    <UserCheck className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-500">
                    Skill Verification
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                    Ensure questions accurately assess the skills and experience
                    required for each position with precision.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <ArrowRight className="h-4 w-4" />
                    <span>Verify skills</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Bonus Feature 1 */}
              <div className="group relative bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-sm border border-gray-700/50">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white">Real-time Analysis</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Get instant feedback and performance analytics during interviews
                </p>
              </div>

              {/* Bonus Feature 2 */}
              <div className="group relative bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-blue-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-sm border border-gray-700/50">
                    <Brain className="h-5 w-5 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white">Voice Interviews</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Conduct natural voice conversations with AI-powered interviews
                </p>
              </div>

              {/* Bonus Feature 3 */}
              <div className="group relative bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center shadow-sm backdrop-blur-sm border border-gray-700/50">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white">Detailed Reports</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Generate comprehensive interview reports with recommendations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="py-24 bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full shadow-sm border border-blue-500/30 mb-6">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  Modern Tech Stack
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Built With Modern Technologies
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Leveraging cutting-edge tools for reliability, security, and
                performance to deliver the best interview experience
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Next.js - Enhanced */}
              <div
                className="tech-item group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center h-full"
                style={{ transitionDelay: "0ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                      <svg width="40" height="24" viewBox="0 0 394 80" className="text-white fill-current">
                        <path d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z"/>
                        <path d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V0.0330722H149.052Z"/>
                        <path d="M183.32 0.0330722H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.0330722H229.312L206.352 28.2874L183.32 0.0330722Z"/>
                        <path d="M201.6 56.7148L192.679 45.6229L165.455 79.4312H183.269L201.6 56.7148Z"/>
                        <circle cx="34.52" cy="39.5" r="3"/>
                        <circle cx="49.52" cy="39.5" r="3"/>
                        <circle cx="19.52" cy="39.5" r="3"/>
                        <path d="M0 39.5219C0 17.6985 17.6985 0 39.5219 0C61.3453 0 79.0438 17.6985 79.0438 39.5219C79.0438 61.3453 61.3453 79.0438 39.5219 79.0438C17.6985 79.0438 0 61.3453 0 39.5219Z" fill="url(#paint0_linear)"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-300 transition-colors duration-500">Next.js</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    The React framework for production
                  </p>
                </div>
              </div>

              {/* React - Enhanced */}
              <div
                className="tech-item group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center h-full"
                style={{ transitionDelay: "100ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                      <svg width="36" height="32" viewBox="0 0 256 228" className="text-white fill-current">
                        <path d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32.533c7.467 1.867 12.8 7.467 18.133 13.6 8.533 9.6 18.133 20.267 39.467 20.267 34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 18.667-7.467-1.867-12.8-7.467-18.133-13.6C158.933 10.667 149.333 0 128 0z"/>
                        <path d="M64 51.2C29.867 51.2 8.533 68.267 0 102.4c12.8-17.067 27.733-23.467 44.8-18.667 7.467 1.867 12.8 7.467 18.133 13.6 8.533 9.6 18.133 20.267 39.467 20.267 34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 18.667-7.467-1.867-12.8-7.467-18.133-13.6C94.933 61.867 85.333 51.2 64 51.2z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors duration-500">React</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    A JavaScript library for building UIs
                  </p>
                </div>
              </div>

              {/* AI/OpenAI - Enhanced */}
              <div
                className="tech-item group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center h-full"
                style={{ transitionDelay: "200ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors duration-500">AI/OpenAI</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    Powerful AI for intelligent interviews
                  </p>
                </div>
              </div>

              {/* Supabase - Enhanced */}
              <div
                className="tech-item group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center h-full"
                style={{ transitionDelay: "300ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="relative w-20 h-20 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow duration-500">
                      <svg width="32" height="32" viewBox="0 0 256 256" className="text-white fill-current">
                        <path d="M149.602 129.834c0-21.532-17.467-38.999-38.999-38.999s-38.999 17.467-38.999 38.999 17.467 38.999 38.999 38.999 38.999-17.467 38.999-38.999zm-38.999 19.5c-10.766 0-19.5-8.734-19.5-19.5s8.734-19.5 19.5-19.5 19.5 8.734 19.5 19.5-8.734 19.5-19.5 19.5z"/>
                        <path d="M256 129.834c0 70.692-57.308 128-128 128S0 200.526 0 129.834 57.308 1.834 128 1.834 256 59.142 256 129.834zM128 21.334c-59.933 0-108.5 48.567-108.5 108.5s48.567 108.5 108.5 108.5 108.5-48.567 108.5-108.5-48.567-108.5-108.5-108.5z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-green-300 transition-colors duration-500">Supabase</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                    Open source Firebase alternative
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Tech Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mt-12">
              {/* Tailwind CSS */}
              <div className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 256 154" className="text-white fill-current">
                      <path d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32.533c7.467 1.867 12.8 7.467 18.133 13.6 8.533 9.6 18.133 20.267 39.467 20.267 34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 18.667-7.467-1.867-12.8-7.467-18.133-13.6C158.933 10.667 149.333 0 128 0z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white text-sm">Tailwind CSS</h4>
                  <p className="text-gray-300 text-xs">Utility-first CSS</p>
                </div>
              </div>

              {/* Framer Motion */}
              <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="text-white fill-current">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white text-sm">Framer Motion</h4>
                  <p className="text-gray-300 text-xs">Smooth animations</p>
                </div>
              </div>

              {/* TypeScript */}
              <div className="group relative bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-blue-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <span className="text-white font-bold text-sm">TS</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">TypeScript</h4>
                  <p className="text-gray-300 text-xs">Type-safe JavaScript</p>
                </div>
              </div>

              {/* Vercel */}
              <div className="group relative bg-gradient-to-br from-gray-700/20 to-gray-800/20 rounded-2xl p-6 border border-gray-600/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <svg width="20" height="18" viewBox="0 0 76 65" className="text-white fill-current">
                      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white text-sm">Vercel</h4>
                  <p className="text-gray-300 text-xs">Fast deployment</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                How PrepTrack Works
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Generate professional interview questions in four simple steps
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Step 1 - Hardcoded */}
              <div
                className="step-item mb-8"
                style={{ transitionDelay: "0ms" }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="font-semibold">1</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 shadow-sm flex-grow relative">
                    <div className="absolute h-full w-0.5 bg-emerald-500/30 left-[-21px] top-[48px]"></div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center text-white">
                      Sign in to your account
                    </h3>
                    <p className="text-gray-300">
                      Create an account or sign in with your existing
                      credentials to access the platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 - Hardcoded */}
              <div
                className="step-item mb-8"
                style={{ transitionDelay: "100ms" }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 shadow-sm flex-grow relative">
                    <div className="absolute h-full w-0.5 bg-emerald-500/30 left-[-21px] top-[48px]"></div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center text-white">
                      Specify the job role
                    </h3>
                    <p className="text-gray-300">
                      Enter the job title, required skills, and experience level
                      to generate tailored interview questions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 - Hardcoded */}
              <div
                className="step-item mb-8"
                style={{ transitionDelay: "200ms" }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="font-semibold">3</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 shadow-sm flex-grow relative">
                    <div className="absolute h-full w-0.5 bg-emerald-500/30 left-[-21px] top-[48px]"></div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center text-white">
                      Generate AI powered interviews
                    </h3>
                    <p className="text-gray-300">
                      Share or attend the interviews conducted by AI assistant
                      for your desired job role.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 - Hardcoded */}
              <div className="step-item" style={{ transitionDelay: "300ms" }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="font-semibold">4</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 shadow-sm flex-grow">
                    <h3 className="text-xl font-semibold mb-2 flex items-center text-white">
                      Feedback and verdict
                      <Image src="/check.png" alt="Check" width={20} height={20} className="object-contain ml-2" />
                    </h3>
                    <p className="text-gray-300">
                      Get instant feedback on the interviews that where attended
                      and get instant verdict based on that feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                  PrepTrack
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Transform your hiring process with AI-powered interviews. 
                Conduct smarter, faster, and more effective interviews that identify top talent.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="w-10 h-10 bg-gray-800/50 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-gray-800/50 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-gray-800/50 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/all-interviews" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    All Interviews
                  </Link>
                </li>
                <li>
                  <Link href="/scheduled-interviews" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Scheduled
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} PrepTrack. All rights reserved. Made with ❤️ for better hiring.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
