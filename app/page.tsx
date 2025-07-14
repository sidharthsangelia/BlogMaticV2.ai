"use client";
import Link from "next/link";
import { ArrowRight, Video, PenTool, Sparkles, Clock, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VideoToBlog
          </span>
        </div>
        
        <div className="flex gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
            Admin
          </Link>
          <Link href="/posts" className="text-gray-600 hover:text-blue-600 transition-colors">
            Posts
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Transform Videos into
              <br />
              <span className="relative">
                Magical Blog Posts
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Let our AI wizards turn your videos into captivating blog posts. Upload, configure, and watch the magic happen! ✨
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/dashboard" className="group">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3">
                <Video className="w-5 h-5" />
                Start Creating Magic
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Upload</h3>
            <p className="text-gray-600">
              Upload your videos and let our digital wizards handle the rest. Supports multiple formats and sizes.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Writing</h3>
            <p className="text-gray-600">
              Our content sorcerers craft engaging blog posts tailored to your audience and tone preferences.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              From video to blog post in minutes. Watch the magic happen in real-time with our cute progress updates.
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">How the Magic Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Upload Video</h3>
                <p className="text-gray-600">Drop your video and watch our wizards begin their spell</p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 -z-10"></div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Configure Style</h3>
                <p className="text-gray-600">Choose your tone, audience, and variations</p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 -z-10"></div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Get Results</h3>
                <p className="text-gray-600">Receive your polished blog post ready to publish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of creators who've discovered the magic of AI-powered content creation</p>
          <Link href="/dashboard">
            <Button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-50">
              Start Your Journey Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}