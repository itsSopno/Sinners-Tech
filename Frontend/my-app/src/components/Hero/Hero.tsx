"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Session } from "next-auth";
import { useGlobalContext, IUserData } from "@/context/globalContext";

interface HeroProps {
  session: Session | null;
}

const Hero = ({ session }: HeroProps) => {
  const { allUsers } = useGlobalContext();
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if current user is in the database
  const isUserMatched = allUsers?.some((user: IUserData) => user.email === session?.user?.email);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Entrance Animations
      tl.from(".hero-video-container", {
        scale: 1.1,
        duration: 2.5,
        ease: "power2.out",
      })
      .from(".hero-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
      }, "-=1.5")
      .from(".bottom-bar", {
        y: 20,
        opacity: 0,
        duration: 1,
      }, "-=1");

      // Subtle video parallax/movement on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth - 0.5) * 10;
        const yPercent = (clientY / window.innerHeight - 0.5) * 10;

        gsap.to(videoRef.current, {
          x: xPercent,
          y: yPercent,
          duration: 2,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* ── BACKGROUND VIDEO ── */}
      <div className="hero-video-container absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center scale-110 absolute inset-0 opacity-60 transition-opacity duration-1000"
          onCanPlayThrough={(e) => (e.currentTarget.style.opacity = "0.7")}
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Sleek Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* ── CONTENT LAYER ── */}
      <div className="relative z-10 hero-content flex flex-col items-center justify-center text-center px-6 max-w-6xl w-full">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="hidden sm:block h-[1px] w-12 bg-white/30"></span>
          <span className="tracking-[0.5em] text-[10px] sm:text-xs text-white/70 uppercase font-medium">
            Next Generation Tech Collection
          </span>
          <span className="hidden sm:block h-[1px] w-12 bg-white/30"></span>
        </div>

        <h1 className="font-space font-extrabold text-[clamp(48px,10vw,140px)] leading-[0.8] text-white uppercase italic mb-12 tracking-tighter select-none">
          Sinners <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">Studio</span><br />
          <span className="text-white/90">Ecosystem</span>
        </h1>

        {/* Buttons Centering Fix applied here with flex-center and adjusting flex-wrap */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
          <Link 
            href="/Store" 
            className="group relative px-10 py-4 sm:px-12 sm:py-5 overflow-hidden transition-all duration-300 w-full sm:w-auto text-center"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white group-hover:scale-105 transition-all duration-300"></div>
            <span className="relative z-10 font-bebas text-xl sm:text-2xl tracking-[0.1em] text-white group-hover:text-black transition-colors duration-300">
              Explore Store
            </span>
          </Link>

          <Link 
            href="/Story" 
            className="group relative px-10 py-4 sm:px-12 sm:py-5 overflow-hidden w-full sm:w-auto text-center"
          >
            <div className="absolute inset-0 border border-white/10 hover:border-white/40 transition-colors duration-300"></div>
            <span className="relative z-10 font-bebas text-xl sm:text-2xl tracking-[0.1em] text-white/80 hover:text-white transition-colors duration-300">
              Our Vision
            </span>
          </Link>

          {isUserMatched ? (
            <Link 
              href="/Community" 
              className="group relative px-10 py-4 sm:px-12 sm:py-5 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/50 hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_30px_rgba(79,70,229,0.2)] w-full sm:w-auto text-center"
            >
              <span className="relative z-10 font-bebas text-xl sm:text-2xl tracking-[0.1em] text-white">
                Social
              </span>
            </Link>
          ) : (
            <Link 
              href="/CreateProfile" 
              className="group relative px-10 py-4 sm:px-12 sm:py-5 bg-white text-black hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] w-full sm:w-auto text-center"
            >
              <span className="relative z-10 font-bebas text-xl sm:text-2xl tracking-[0.1em] uppercase">
                Join Us
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="bottom-bar absolute bottom-10 w-full px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 font-bebas text-sm tracking-[0.3em]">
        <div className="flex items-center gap-4">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="italic">SYSTEM ONLINE / DHAKA HUB</span>
        </div>
        
        <div className="flex gap-8">
          {['Instagram', 'Discord', 'Github'].map((platform) => (
            <a 
              key={platform} 
              href="#" 
              className="hover:text-white transition-colors duration-300 uppercase"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-20"></div>
    </section>
  );
};

export default Hero;