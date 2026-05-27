import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   "calc(var(--radius) + 4px)",
        "2xl":"calc(var(--radius) + 8px)",
        "3xl":"calc(var(--radius) + 16px)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        marquee: {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-28px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(28px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.95)", boxShadow: "0 0 0 0 hsl(var(--primary) / 0.4)" },
          "70%":  { transform: "scale(1)",    boxShadow: "0 0 0 10px hsl(var(--primary) / 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        shimmer:           "shimmer 2.5s infinite",
        float:             "float 4s ease-in-out infinite",
        marquee:           "marquee 30s linear infinite",
        "fade-up":         "fade-up 0.6s ease-out forwards",
        "fade-in":         "fade-in 0.8s ease-out forwards",
        "scale-in":        "scale-in 0.5s ease-out forwards",
        "slide-in-left":   "slide-in-left 0.6s ease-out forwards",
        "slide-in-right":  "slide-in-right 0.6s ease-out forwards",
        "pulse-ring":      "pulse-ring 2s ease-in-out infinite",
        "spin-slow":       "spin-slow 8s linear infinite",
      },
      boxShadow: {
        card:         "0 1px 3px hsl(222 35% 12% / 0.06), 0 4px 16px -4px hsl(222 35% 12% / 0.08)",
        "card-hover": "0 4px 8px hsl(222 35% 12% / 0.08), 0 16px 40px -8px hsl(222 35% 12% / 0.14)",
        elevated:     "0 20px 60px -12px hsl(222 35% 12% / 0.22)",
        "glow-sm":    "0 0 15px hsl(var(--primary) / 0.2)",
        "glow-md":    "0 0 30px hsl(var(--primary) / 0.25)",
        "glow-gold":  "0 0 30px hsl(40 90% 52% / 0.35)",
        inner:        "inset 0 2px 4px hsl(222 35% 12% / 0.06)",
      },
      backgroundImage: {
        "hero-gradient":    "linear-gradient(135deg, hsl(222 65% 16%) 0%, hsl(222 55% 28%) 50%, hsl(200 60% 30%) 100%)",
        "gold-gradient":    "linear-gradient(135deg, hsl(40 90% 52%) 0%, hsl(36 95% 58%) 100%)",
        "card-gradient":    "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)",
        "sidebar-gradient": "linear-gradient(180deg, hsl(222 50% 13%) 0%, hsl(222 45% 10%) 100%)",
        "shimmer-gradient": "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 75%)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
